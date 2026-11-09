import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/admin-auth';

// GET /api/admin/stats — Comprehensive Admin Overview Analytics
export async function GET(request) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalUsers,
      activeUsers,
      blockedUsers,
      newUsers7d,
      newUsers30d,
      totalRiders,
      activeRiders,
      blockedRiders,
      totalRides,
      publishedRides,
      ongoingRides,
      completedRides,
      cancelledRides,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenueAgg,
      monthRevenueAgg,
      lastMonthRevenueAgg,
      pendingVerifications,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      recentPayments,
      recentUsers,
      recentBookings,
      recentLogs,
    ] = await Promise.all([
      // Users
      prisma.user.count(),
      prisma.user.count({ where: { isBanned: false, isActive: true } }),
      prisma.user.count({ where: { OR: [{ isBanned: true }, { isActive: false }] } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),

      // Riders
      prisma.user.count({ where: { role: 'RIDER' } }),
      prisma.user.count({ where: { role: 'RIDER', isBanned: false, isActive: true } }),
      prisma.user.count({ where: { role: 'RIDER', OR: [{ isBanned: true }, { isActive: false }] } }),

      // Rides
      prisma.ride.count(),
      prisma.ride.count({ where: { status: 'PUBLISHED' } }),
      prisma.ride.count({ where: { status: 'ONGOING' } }),
      prisma.ride.count({ where: { status: 'COMPLETED' } }),
      prisma.ride.count({ where: { status: 'CANCELLED' } }),

      // Bookings
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } }),

      // Revenue
      prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: startOfMonth } }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { amount: true } }),

      // Verification & Support
      prisma.vehicle.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      prisma.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),

      // Last 30 days payments for chart
      prisma.payment.findMany({
        where: { status: 'COMPLETED', createdAt: { gte: thirtyDaysAgo } },
        select: { amount: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),

      // Recent Users
      prisma.user.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isBanned: true,
          isActive: true,
          createdAt: true,
          image: true,
        },
      }),

      // Recent Bookings
      prisma.booking.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          ride: { select: { pickupAddress: true, destinationAddress: true, departureDate: true } },
          traveler: { select: { id: true, name: true, email: true } },
          payment: { select: { amount: true, status: true, method: true } },
        },
      }),

      // Recent Admin Logs
      prisma.adminLog.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Build 30-day timeline chart data
    const dailyMap = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap[label] = 0;
    }

    recentPayments.forEach(({ amount, createdAt }) => {
      const label = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyMap[label] !== undefined) {
        dailyMap[label] += amount;
      }
    });

    const revenueChart = Object.entries(dailyMap).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue * 100) / 100,
    }));

    const totalRevenue = totalRevenueAgg._sum.amount || 0;
    const monthRevenue = monthRevenueAgg._sum.amount || 0;
    const lastMonthRevenue = lastMonthRevenueAgg._sum.amount || 0;
    const revenueGrowth = lastMonthRevenue > 0
      ? (((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
      : '0.0';

    const rideDistribution = [
      { name: 'Published', value: publishedRides, color: '#10B981' },
      { name: 'Ongoing', value: ongoingRides, color: '#3B82F6' },
      { name: 'Completed', value: completedRides, color: '#059669' },
      { name: 'Cancelled', value: cancelledRides, color: '#EF4444' },
    ];

    const bookingDistribution = [
      { name: 'Confirmed', value: confirmedBookings, color: '#10B981' },
      { name: 'Completed', value: completedBookings, color: '#059669' },
      { name: 'Pending', value: pendingBookings, color: '#F59E0B' },
      { name: 'Cancelled', value: cancelledBookings, color: '#EF4444' },
    ];

    return NextResponse.json({
      metrics: {
        users: {
          total: totalUsers,
          active: activeUsers,
          blocked: blockedUsers,
          new7d: newUsers7d,
          new30d: newUsers30d,
        },
        riders: {
          total: totalRiders,
          active: activeRiders,
          blocked: blockedRiders,
          pendingVerifications,
        },
        rides: {
          total: totalRides,
          published: publishedRides,
          ongoing: ongoingRides,
          completed: completedRides,
          cancelled: cancelledRides,
          activeTotal: publishedRides + ongoingRides,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
        },
        revenue: {
          total: totalRevenue,
          month: monthRevenue,
          lastMonth: lastMonthRevenue,
          growthRate: revenueGrowth,
        },
        support: {
          open: openTickets,
          inProgress: inProgressTickets,
          resolved: resolvedTickets,
        },
      },
      revenueChart,
      rideDistribution,
      bookingDistribution,
      recentUsers,
      recentBookings,
      recentLogs,
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
