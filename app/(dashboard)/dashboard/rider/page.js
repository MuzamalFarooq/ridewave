import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import RiderDashboardClient from './RiderDashboardClient';

export const metadata = { title: 'Rider Dashboard' };

export default async function RiderDashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user.role !== 'RIDER') redirect('/forbidden');

  const [recentBookings, vehicles, notifications] = await Promise.all([
    prisma.booking.findMany({
      where: { ride: { riderId: session.user.id } },
      include: {
        traveler: { select: { name: true, image: true } },
        ride: { select: { pickupAddress: true, destinationAddress: true, departureDate: true, departureTime: true } },
        payment: { select: { status: true, amount: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.vehicle.findMany({
      where: { ownerId: session.user.id, isActive: true },
      take: 3,
    }),
    prisma.notification.findMany({
      where: { userId: session.user.id, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  // Stats
  const [totalEarnings, thisMonthEarnings, totalRides, completedRides, avgRating, pendingBookings] = await Promise.all([
    prisma.payment.aggregate({
      where: { booking: { ride: { riderId: session.user.id } }, status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        booking: { ride: { riderId: session.user.id } },
        status: 'COMPLETED',
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
      _sum: { amount: true },
    }),
    prisma.ride.count({ where: { riderId: session.user.id } }),
    prisma.ride.count({ where: { riderId: session.user.id, status: 'COMPLETED' } }),
    prisma.review.aggregate({
      where: { ride: { riderId: session.user.id } },
      _avg: { rating: true },
    }),
    prisma.booking.count({ where: { ride: { riderId: session.user.id }, status: 'PENDING' } }),
  ]);

  const stats = {
    totalEarnings: totalEarnings._sum.amount || 0,
    thisMonthEarnings: thisMonthEarnings._sum.amount || 0,
    totalRides, completedRides,
    avgRating: avgRating._avg.rating || 0,
    pendingBookings,
  };

  return <RiderDashboardClient user={session.user} recentBookings={recentBookings} vehicles={vehicles} notifications={notifications} stats={stats} />;
}
