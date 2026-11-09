import { prisma } from '@/lib/prisma';
import AdminBookingsClient from '@/components/admin/AdminBookingsClient';

export const metadata = {
  title: 'Ride Bookings — RideWave Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const limit = 15;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      include: {
        traveler: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        ride: {
          include: {
            rider: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            vehicle: {
              select: {
                brand: true,
                model: true,
                vehicleType: true,
                registrationNumber: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.booking.count(),
  ]);

  return (
    <AdminBookingsClient
      initialBookings={bookings}
      totalBookings={total}
      totalPages={Math.ceil(total / limit)}
      initialPage={1}
    />
  );
}

