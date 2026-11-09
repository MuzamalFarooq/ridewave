import { prisma } from '@/lib/prisma';
import AdminUsersClient from '@/components/admin/AdminUsersClient';

export const metadata = {
  title: 'User Management — RideWave Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const limit = 15;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        isActive: true,
        isBanned: true,
        blockedAt: true,
        blockedReason: true,
        blockedBy: true,
        walletBalance: true,
        createdAt: true,
        profile: {
          select: {
            averageRating: true,
            totalTrips: true,
            isRiderVerified: true,
          },
        },
        _count: {
          select: {
            ridesAsRider: true,
            bookingsAsTraveler: true,
            vehicles: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.user.count(),
  ]);

  return (
    <AdminUsersClient
      initialUsers={users}
      totalUsers={total}
      totalPages={Math.ceil(total / limit)}
      initialPage={1}
    />
  );
}

