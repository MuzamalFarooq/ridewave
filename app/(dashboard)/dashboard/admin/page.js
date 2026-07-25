import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata = { title: 'Admin Dashboard — RideWave' };

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/auth/login');

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalUsers, newUsersThisMonth,
    totalRides, activeRides,
    totalBookings, completedBookings,
    totalRevenue, monthRevenue, lastMonthRevenue,
    pendingVerifications,
    recentUsers, recentRides, recentBookings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.ride.count(),
    prisma.ride.count({ where: { status: 'PUBLISHED' } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'COMPLETED' } }),
    prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: startOfMonth } }, _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { amount: true } }),
    prisma.vehicle.count({ where: { verificationStatus: 'PENDING' } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true, image: true } }),
    prisma.ride.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { rider: { select: { name: true } }, vehicle: { select: { vehicleType: true } } } }),
    prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }, take: 10,
      include: {
        traveler: { select: { name: true } },
        ride: { select: { pickupAddress: true, destinationAddress: true } },
        payment: { select: { amount: true, status: true } },
      },
    }),
  ]);

  const stats = {
    totalUsers, newUsersThisMonth,
    totalRides, activeRides,
    totalBookings, completedBookings,
    totalRevenue: totalRevenue._sum.amount || 0,
    monthRevenue: monthRevenue._sum.amount || 0,
    lastMonthRevenue: lastMonthRevenue._sum.amount || 0,
    pendingVerifications,
    revenueGrowth: lastMonthRevenue._sum.amount
      ? ((((monthRevenue._sum.amount || 0) - lastMonthRevenue._sum.amount) / lastMonthRevenue._sum.amount) * 100).toFixed(1)
      : 0,
  };

  return <AdminDashboardClient stats={stats} recentUsers={recentUsers} recentRides={recentRides} recentBookings={recentBookings} />;
}
