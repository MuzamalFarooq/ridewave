import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendNotification } from '@/lib/notifications';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

// GET /api/bookings — List bookings (role-based)
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'traveler';
    const status = searchParams.get('status');
    const rideId = searchParams.get('rideId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where = {
      ...(role === 'rider'
        ? { ride: { riderId: session.user.id } }
        : { travelerId: session.user.id }),
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(rideId ? { rideId } : {}),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          ride: {
            include: {
              rider: { select: { id: true, name: true, image: true, profile: { select: { averageRating: true } } } },
              vehicle: { select: { brand: true, model: true, vehicleType: true } },
            },
          },
          traveler: { select: { id: true, name: true, image: true, phone: true } },
          payment: true,
          review: { select: { id: true, rating: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({ bookings, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('GET /api/bookings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/bookings — Create a booking
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { rideId, seatsBooked, paymentMethod, couponCode, passengerNotes } = body;

    if (!rideId || !seatsBooked || seatsBooked < 1) {
      return NextResponse.json({ message: 'rideId and seatsBooked are required' }, { status: 400 });
    }

    // Get ride with current booking count
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
      include: {
        rider: { select: { id: true, name: true } },
        _count: { select: { bookings: { where: { status: { in: ['PENDING', 'CONFIRMED'] } } } } },
      },
    });

    if (!ride) return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
    if (ride.riderId === session.user.id) return NextResponse.json({ message: 'You cannot book your own ride' }, { status: 400 });
    if (ride.status !== 'PUBLISHED') return NextResponse.json({ message: 'Ride is not available for booking' }, { status: 400 });

    const bookedSeats = ride._count.bookings;
    const availableSeats = ride.availableSeats - bookedSeats;
    if (seatsBooked > availableSeats) {
      return NextResponse.json({ message: `Only ${availableSeats} seats available` }, { status: 400 });
    }

    // Validate coupon
    let discount = 0;
    let couponId = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: { code: couponCode, isActive: true, expiresAt: { gt: new Date() } },
      });
      if (coupon && coupon.usageCount < coupon.usageLimit) {
        discount = coupon.discountType === 'PERCENTAGE'
          ? ride.pricePerSeat * seatsBooked * (coupon.discountValue / 100)
          : coupon.discountValue;
        couponId = coupon.id;
        await prisma.coupon.update({ where: { id: coupon.id }, data: { usageCount: { increment: 1 } } });
      }
    }

    const subtotal = ride.pricePerSeat * seatsBooked;
    const platformFee = subtotal * 0.08;
    const totalAmount = Math.max(0, subtotal - discount + platformFee);

    // Generate booking reference
    const bookingRef = `RW${Date.now().toString(36).toUpperCase()}`;

    // Generate QR code data
    const qrData = JSON.stringify({ ref: bookingRef, rideId, seats: seatsBooked, userId: session.user.id });

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        rideId,
        travelerId: session.user.id,
        seatsBooked,
        totalAmount,
        platformFee,
        paymentMethod: paymentMethod || 'CASH',
        status: ride.instantBooking ? 'CONFIRMED' : 'PENDING',
        couponId,
        passengerNotes,
        qrCode: qrData,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        userId: session.user.id,
        amount: totalAmount,
        currency: 'USD',
        method: paymentMethod || 'CASH',
        status: paymentMethod === 'CASH' ? 'PENDING' : 'PENDING',
      },
    });

    // Stripe payment intent
    let clientSecret = null;
    if (paymentMethod === 'STRIPE') {
      const pi = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency: 'usd',
        metadata: { bookingId: booking.id, userId: session.user.id },
      });
      clientSecret = pi.client_secret;
      await prisma.payment.updateMany({
        where: { bookingId: booking.id },
        data: { stripePaymentIntentId: pi.id },
      });
    }

    // Notify rider
    await sendNotification({
      userId: ride.riderId,
      type: 'BOOKING',
      title: `New booking request 🚗`,
      body: `${session.user.name} wants to book ${seatsBooked} seat${seatsBooked > 1 ? 's' : ''} on your ride to ${ride.destinationAddress}`,
      link: `/dashboard/rider/bookings`,
    });

    // Award loyalty points
    await prisma.user.update({
      where: { id: session.user.id },
      data: { loyaltyPoints: { increment: Math.floor(totalAmount * 2) } },
    });

    return NextResponse.json({ booking, clientSecret }, { status: 201 });
  } catch (error) {
    console.error('POST /api/bookings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
