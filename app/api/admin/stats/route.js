import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/stats — Admin overview analytics
export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers, newUsers7d,
      totalRides, activeRides,
      totalBookings, completedBookings,
      totalRevenue, pendingVerifications,
      openTickets,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.ride.count(),
      prisma.ride.count({ where: { status: { in: ['PUBLISHED', 'ONGOING'] } } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      prisma.vehicle.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.supportTicket.count({ where: { status: 'OPEN' } }),
    ]);

    // Revenue last 30 days by day
    const recentPayments = await prisma.payment.findMany({
      where: { status: 'COMPLETED', createdAt: { gte: thirtyDaysAgo } },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const revenueByDay = {};
    recentPayments.forEach(({ amount, createdAt }) => {
      const day = new Date(createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' });
      revenueByDay[day] = (revenueByDay[day] || 0) + amount;
    });

    const revenueChart = Object.entries(revenueByDay).map(([date, amount]) => ({ date, amount }));

    // Recent activities
    const [recentUsers, recentBookings] = await Promise.all([
      prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, role: true, createdAt: true, image: true } }),
      prisma.booking.findMany({
        take: 5, orderBy: { createdAt: 'desc' },
        include: { ride: { select: { pickupAddress: true, destinationAddress: true } }, traveler: { select: { name: true } } },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers, newUsers7d, totalRides, activeRides,
        totalBookings, completedBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingVerifications, openTickets,
      },
      revenueChart,
      recentUsers,
      recentBookings,
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
