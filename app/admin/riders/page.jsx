import { prisma } from '@/lib/prisma';
import AdminRidersClient from '@/components/admin/AdminRidersClient';

export const metadata = {
  title: 'Rider & Vehicle Management — RideWave Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminRidersPage() {
  const limit = 15;
  const where = { role: 'RIDER' };

  const [riders, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        isActive: true,
        isBanned: true,
        blockedAt: true,
        blockedReason: true,
        blockedBy: true,
        createdAt: true,
        profile: {
          select: {
            averageRating: true,
            totalTrips: true,
            totalDistance: true,
            isRiderVerified: true,
            licenseNumber: true,
          },
        },
        vehicles: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true,
            year: true,
            registrationNumber: true,
            vehicleType: true,
            verificationStatus: true,
            isActive: true,
            seatCapacity: true,
          },
        },
        verification: {
          select: {
            status: true,
            idType: true,
            reviewedAt: true,
          },
        },
        _count: {
          select: {
            ridesAsRider: true,
            vehicles: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return (
    <AdminRidersClient
      initialRiders={riders}
      totalRiders={total}
      totalPages={Math.ceil(total / limit)}
      initialPage={1}
    />
  );
}

