import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest, logAdminActivity } from '@/lib/admin-auth';

// GET /api/admin/bookings — Search & filter bookings
export async function GET(request) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status'); // PENDING | CONFIRMED | COMPLETED | CANCELLED | REJECTED | ALL

    const where = {
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(search
        ? {
            OR: [
              { bookingRef: { contains: search, mode: 'insensitive' } },
              { passengerName: { contains: search, mode: 'insensitive' } },
              { passengerPhone: { contains: search, mode: 'insensitive' } },
              { pickupAddress: { contains: search, mode: 'insensitive' } },
              { dropoffAddress: { contains: search, mode: 'insensitive' } },
              { traveler: { name: { contains: search, mode: 'insensitive' } } },
              { traveler: { email: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          traveler: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
          ride: {
            include: {
              rider: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
              vehicle: {
                select: {
                  brand: true,
                  model: true,
                  vehicleType: true,
                  registrationNumber: true,
                },
              },
            },
          },
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/admin/bookings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/bookings — Update booking status (e.g. CANCEL, COMPLETE)
export async function PATCH(request) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, status, cancellationReason } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ message: 'bookingId and status are required' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { ride: true },
    });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const updateData = { status };
    if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
      updateData.cancellationReason = cancellationReason || 'Cancelled by administrator';
    } else if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    } else if (status === 'CONFIRMED') {
      updateData.confirmedAt = new Date();
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    await logAdminActivity({
      adminEmail: admin.email,
      action: `BOOKING_${status}`,
      targetType: 'BOOKING',
      targetId: bookingId,
      details: { previousStatus: booking.status, newStatus: status, reason: cancellationReason },
      req: request,
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error('PATCH /api/admin/bookings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

