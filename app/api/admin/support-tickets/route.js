import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/admin-auth';

// GET /api/admin/support-tickets — List and filter tickets/complaints
export async function GET(request) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status'); // OPEN | IN_PROGRESS | RESOLVED | CLOSED | ALL
    const priority = searchParams.get('priority'); // LOW | MEDIUM | HIGH | URGENT | ALL

    const where = {
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(priority && priority !== 'ALL' ? { priority } : {}),
      ...(search
        ? {
            OR: [
              { subject: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { category: { contains: search, mode: 'insensitive' } },
              { user: { name: { contains: search, mode: 'insensitive' } } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [tickets, total, countsByStatus] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
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

    return NextResponse.json({
      tickets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      statusCounts,
    });
  } catch (error) {
    console.error('Admin support tickets GET error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
