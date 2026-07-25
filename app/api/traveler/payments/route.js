import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'TRAVELER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const payments = await prisma.payment.findMany({
      where: { booking: { travelerId: session.user.id } },
      include: {
        booking: {
          include: {
            ride: { select: { pickupAddress: true, destinationAddress: true, departureDate: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalSpent = payments
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({ payments, totalSpent });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
