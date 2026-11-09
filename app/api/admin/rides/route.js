import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest, logAdminActivity } from '@/lib/admin-auth';

// GET /api/admin/rides — List and filter rides
export async function GET(request) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    const where = {
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(search
        ? {
            OR: [
              { pickupAddress: { contains: search, mode: 'insensitive' } },
              { destinationAddress: { contains: search, mode: 'insensitive' } },
              { rider: { name: { contains: search, mode: 'insensitive' } } },
              { rider: { email: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [rides, total] = await Promise.all([
      prisma.ride.findMany({
        where,
        include: {
          rider: { select: { id: true, name: true, image: true, email: true, phone: true } },
          vehicle: { select: { brand: true, model: true, vehicleType: true, registrationNumber: true } },
          _count: { select: { bookings: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ride.count({ where }),
    ]);

    return NextResponse.json({
      rides,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/admin/rides error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/rides — Update ride status / feature flag
export async function PATCH(request) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const { rideId, isFeatured, status } = body || {};

    if (!rideId) {
      return NextResponse.json({ message: 'Ride ID is required' }, { status: 400 });
    }

    const existingRide = await prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!existingRide) {
      return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
    }

    const updateData = {};
    if (typeof isFeatured === 'boolean') updateData.isFeatured = isFeatured;
    if (typeof status === 'string') updateData.status = status;

    const ride = await prisma.ride.update({
      where: { id: rideId },
      data: updateData,
    });

    await logAdminActivity({
      adminEmail: admin.email,
      action: `RIDE_UPDATED`,
      targetType: 'RIDE',
      targetId: rideId,
      details: updateData,
      req: request,
    });

    return NextResponse.json({ success: true, ride });
  } catch (error) {
    console.error('PATCH /api/admin/rides error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
