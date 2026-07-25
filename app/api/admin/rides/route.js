import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where = {
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(search ? {
        OR: [
          { pickupAddress: { contains: search, mode: 'insensitive' } },
          { destinationAddress: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
    };

    const [rides, total] = await Promise.all([
      prisma.ride.findMany({
        where,
        include: {
          rider: { select: { name: true, image: true, email: true } },
          vehicle: { select: { brand: true, model: true, vehicleType: true } },
          _count: { select: { bookings: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ride.count({ where }),
    ]);

    return NextResponse.json({ rides, total });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
