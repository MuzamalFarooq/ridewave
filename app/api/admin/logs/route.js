import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/admin-auth';

// GET /api/admin/logs — List immutable audit logs
export async function GET(request) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '30', 10)));
    const targetType = searchParams.get('targetType');
    const search = searchParams.get('search')?.trim() || '';

    const where = {
      ...(targetType && targetType !== 'ALL' ? { targetType } : {}),
      ...(search
        ? {
            OR: [
              { action: { contains: search, mode: 'insensitive' } },
              { adminEmail: { contains: search, mode: 'insensitive' } },
              { targetId: { contains: search, mode: 'insensitive' } },
              { details: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [logs, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.adminLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/admin/logs error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

