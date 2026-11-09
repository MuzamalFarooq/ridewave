import { prisma } from '@/lib/prisma';
import AdminComplaintsClient from '@/components/admin/AdminComplaintsClient';

export const metadata = {
  title: 'Complaints & Support Tickets — RideWave Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminComplaintsPage() {
  const limit = 15;

  const [tickets, total, countsByStatus] = await Promise.all([
    prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.supportTicket.count(),
    prisma.supportTicket.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ]);

  const statusCounts = {
    OPEN: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    CLOSED: 0,
  };
  countsByStatus.forEach((item) => {
    statusCounts[item.status] = item._count.id;
  });

  return (
    <AdminComplaintsClient
      initialTickets={tickets}
      totalTickets={total}
      totalPages={Math.ceil(total / limit)}
      statusCounts={statusCounts}
    />
  );
}

