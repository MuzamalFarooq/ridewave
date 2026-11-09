import { prisma } from '@/lib/prisma';
import AdminLogsClient from '@/components/admin/AdminLogsClient';

export const metadata = {
  title: 'Audit Logs — RideWave Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminLogsPage() {
  const limit = 20;

  const [logs, total] = await Promise.all([
    prisma.adminLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.adminLog.count(),
  ]);

  return (
    <AdminLogsClient
      initialLogs={logs}
      totalLogs={total}
      totalPages={Math.ceil(total / limit)}
    />
  );
}

