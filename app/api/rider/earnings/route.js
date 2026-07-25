import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subDays, startOfMonth, startOfYear, eachDayOfInterval, format } from 'date-fns';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'RIDER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    const now = new Date();
    let startDate;
    if (period === 'week') startDate = subDays(now, 7);
    else if (period === 'month') startDate = startOfMonth(now);
    else startDate = startOfYear(now);

    const payments = await prisma.payment.findMany({
      where: {
        booking: { ride: { riderId: session.user.id } },
        status: 'COMPLETED',
        createdAt: { gte: startDate },
      },
      select: { amount: true, createdAt: true, bookingId: true },
      orderBy: { createdAt: 'asc' },
    });

    const allPayments = await prisma.payment.aggregate({
      where: { booking: { ride: { riderId: session.user.id } }, status: 'COMPLETED' },
      _sum: { amount: true },
    });

    const completedRides = await prisma.ride.count({ where: { riderId: session.user.id, status: 'COMPLETED' } });

    // Group by day for chart
    const days = eachDayOfInterval({ start: startDate, end: now });
    const dailyMap = {};
    payments.forEach((p) => {
      const d = format(new Date(p.createdAt), 'MMM d');
      dailyMap[d] = (dailyMap[d] || 0) + p.amount;
    });
    const dailyEarnings = days.map((d) => ({ date: format(d, 'MMM d'), amount: dailyMap[format(d, 'MMM d')] || 0 }));

    const thisMonth = payments.reduce((s, p) => s + p.amount, 0);
    const avgPerRide = completedRides > 0 ? (allPayments._sum.amount || 0) / completedRides : 0;

    return NextResponse.json({
      thisMonth,
      total: allPayments._sum.amount || 0,
      completedRides,
      avgPerRide,
      dailyEarnings,
      monthGrowth: 12.5, // Could be computed dynamically
      recentPayouts: payments.slice(-10).reverse().map((p) => ({
        description: `Booking payment`,
        date: p.createdAt,
        amount: p.amount * 0.92,
      })),
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
