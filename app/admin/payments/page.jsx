import { prisma } from '@/lib/prisma';
import AdminPaymentsClient from '@/components/admin/AdminPaymentsClient';

export const metadata = {
  title: 'Payments & Revenue — RideWave Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const limit = 15;

  const [payments, total, totalStats] = await Promise.all([
    prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        booking: {
          select: {
            id: true,
            bookingRef: true,
            seatsBooked: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.payment.count(),
    prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true, refundedAmount: true },
      _count: { id: true },
    }),
  ]);

  const summary = {
    totalCompletedAmount: totalStats._sum.amount || 0,
    totalRefundedAmount: totalStats._sum.refundedAmount || 0,
    completedCount: totalStats._count.id || 0,
  };

  return (
    <AdminPaymentsClient
      initialPayments={payments}
      totalPayments={total}
      totalPages={Math.ceil(total / limit)}
      summary={summary}
    />
  );
}

