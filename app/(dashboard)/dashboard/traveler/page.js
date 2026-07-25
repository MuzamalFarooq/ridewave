import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TravelerDashboardClient from './TravelerDashboardClient';

export const metadata = { title: 'Traveler Dashboard' };

export default async function TravelerDashboardPage() {
  const session = await auth();
  if (!session || session.user.role === 'ADMIN') redirect('/dashboard/admin');

  const [bookings, notifications, recentRides] = await Promise.all([
    prisma.booking.findMany({
      where: { travelerId: session.user.id },
      include: {
        ride: {
          include: {
            rider: { select: { name: true, image: true, profile: { select: { averageRating: true } } } },
            vehicle: { select: { brand: true, model: true, vehicleType: true } },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.notification.findMany({
      where: { userId: session.user.id, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.ride.findMany({
      where: { status: 'PUBLISHED', departureDate: { gte: new Date() } },
      include: {
        rider: { select: { name: true, image: true, profile: { select: { averageRating: true } } } },
        vehicle: { select: { brand: true, model: true, vehicleType: true } },
      },
      orderBy: { departureDate: 'asc' },
      take: 3,
    }),
  ]);

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });

  const stats = {
    totalBookings: await prisma.booking.count({ where: { travelerId: session.user.id } }),
    completedRides: await prisma.booking.count({ where: { travelerId: session.user.id, status: 'COMPLETED' } }),
    totalSpent: (await prisma.payment.aggregate({
      where: { userId: session.user.id, status: 'COMPLETED' },
      _sum: { amount: true },
    }))._sum.amount || 0,
    loyaltyPoints: (await prisma.user.findUnique({ where: { id: session.user.id }, select: { loyaltyPoints: true } }))?.loyaltyPoints || 0,
  };

  return <TravelerDashboardClient user={session.user} bookings={bookings} notifications={notifications} recentRides={recentRides} stats={stats} profile={profile} />;
}
