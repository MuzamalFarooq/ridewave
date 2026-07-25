import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendNotification } from '@/lib/notifications';

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        ride: {
          include: {
            rider: { select: { id: true, name: true, image: true, phone: true, profile: { select: { averageRating: true } } } },
            vehicle: { select: { brand: true, model: true, vehicleType: true } },
          },
        },
        traveler: { select: { id: true, name: true, image: true, phone: true } },
        payment: true,
        review: { select: { id: true, rating: true, comment: true } },
      },
    });

    if (!booking) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const isRider = booking.ride.riderId === session.user.id;
    const isTraveler = booking.travelerId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';
    if (!isRider && !isTraveler && !isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const { action, reason } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { ride: { include: { rider: true } }, traveler: true },
    });
    if (!booking) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const isRider = booking.ride.riderId === session.user.id;
    const isTraveler = booking.travelerId === session.user.id;

    let newStatus;
    let notifyUserId, notifyTitle, notifyBody;

    switch (action) {
      case 'CONFIRM':
        if (!isRider) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        newStatus = 'CONFIRMED';
        notifyUserId = booking.travelerId;
        notifyTitle = '✅ Booking Confirmed!';
        notifyBody = `${booking.ride.rider.name} confirmed your booking. Have a safe ride!`;
        break;
      case 'REJECT':
        if (!isRider) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        newStatus = 'REJECTED';
        notifyUserId = booking.travelerId;
        notifyTitle = '❌ Booking Rejected';
        notifyBody = `Your booking was rejected. ${reason || ''}`;
        break;
      case 'START':
        if (!isRider) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        newStatus = 'ONGOING';
        notifyUserId = booking.travelerId;
        notifyTitle = '🚗 Ride Started!';
        notifyBody = 'Your driver has started the ride. Track your journey in the app.';
        break;
      case 'COMPLETE':
        if (!isRider) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        newStatus = 'COMPLETED';
        notifyUserId = booking.travelerId;
        notifyTitle = '🎉 Ride Completed!';
        notifyBody = 'Ride completed! Please leave a review for your driver.';
        await prisma.payment.updateMany({ where: { bookingId: id }, data: { status: 'COMPLETED' } });
        await prisma.profile.update({ where: { userId: booking.ride.riderId }, data: { totalTrips: { increment: 1 } } });
        break;
      case 'CANCEL':
        if (!isTraveler && !isRider) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        newStatus = 'CANCELLED';
        notifyUserId = isTraveler ? booking.ride.riderId : booking.travelerId;
        notifyTitle = '🚫 Booking Cancelled';
        notifyBody = `${isTraveler ? booking.traveler.name : booking.ride.rider.name} cancelled the booking.`;
        break;
      default:
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: newStatus, ...(reason ? { cancellationReason: reason } : {}) },
    });

    await sendNotification({ userId: notifyUserId, type: 'BOOKING', title: notifyTitle, body: notifyBody });
    return NextResponse.json({ booking: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
