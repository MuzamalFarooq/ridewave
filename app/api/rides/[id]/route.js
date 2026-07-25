import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/rides/[id] — Single ride with all details
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const ride = await prisma.ride.findUnique({
      where: { id },
      include: {
        rider: {
          select: {
            id: true, name: true, image: true, phone: true,
            profile: {
              select: {
                bio: true, averageRating: true, totalReviews: true,
                totalTrips: true, isIdVerified: true, isRiderVerified: true, joinedAt: true,
              },
            },
          },
        },
        vehicle: true,
        stops: true,
        reviews: {
          include: { author: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            bookings: { where: { status: { in: ['PENDING', 'CONFIRMED'] } } },
            reviews: true,
          },
        },
      },
    });

    if (!ride) return NextResponse.json({ message: 'Ride not found' }, { status: 404 });

    // Add bookedSeats count
    const enriched = { ...ride, bookedSeats: ride._count.bookings };

    return NextResponse.json({ ride: enriched });
  } catch (error) {
    console.error('GET /api/rides/[id] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/rides/[id] — Update ride (rider only)
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const ride = await prisma.ride.findUnique({ where: { id } });
    if (!ride) return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
    if (ride.riderId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { status, pricePerSeat, availableSeats, description, rules, instantBooking, luggageAllowed, smokingAllowed, petsAllowed } = body;

    const updated = await prisma.ride.update({
      where: { id },
      data: {
        ...(status !== undefined ? { status } : {}),
        ...(pricePerSeat !== undefined ? { pricePerSeat: parseFloat(pricePerSeat) } : {}),
        ...(availableSeats !== undefined ? { availableSeats: parseInt(availableSeats) } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(rules !== undefined ? { rules } : {}),
        ...(instantBooking !== undefined ? { instantBooking } : {}),
        ...(luggageAllowed !== undefined ? { luggageAllowed } : {}),
        ...(smokingAllowed !== undefined ? { smokingAllowed } : {}),
        ...(petsAllowed !== undefined ? { petsAllowed } : {}),
      },
    });

    return NextResponse.json({ ride: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/rides/[id] — Cancel/delete ride
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const ride = await prisma.ride.findUnique({ where: { id }, include: { _count: { select: { bookings: true } } } });
    if (!ride) return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
    if (ride.riderId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Cancel all bookings and notify travellers
    await prisma.booking.updateMany({
      where: { rideId: id, status: { in: ['PENDING', 'CONFIRMED'] } },
      data: { status: 'CANCELLED', cancellationReason: 'Ride cancelled by rider' },
    });

    await prisma.ride.update({ where: { id }, data: { status: 'CANCELLED' } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
