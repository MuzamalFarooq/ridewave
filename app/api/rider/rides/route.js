import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'RIDER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const rides = await prisma.ride.findMany({
      where: {
        riderId: session.user.id,
        ...(status ? { status } : {}),
      },
      include: {
        vehicle: { select: { brand: true, model: true, vehicleType: true, photos: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ rides });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
