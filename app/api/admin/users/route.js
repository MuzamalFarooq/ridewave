import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/admin-auth';

// GET /api/admin/users — List and filter users
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
    const role = searchParams.get('role');
    const status = searchParams.get('status'); // ACTIVE | BLOCKED | ALL

    const where = {
      ...(role && role !== 'ALL' ? { role } : {}),
      ...(status === 'BLOCKED'
        ? { OR: [{ isBanned: true }, { isActive: false }] }
        : status === 'ACTIVE'
        ? { isBanned: false, isActive: true }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
          loyaltyPoints: true,
          createdAt: true,
          profile: {
            select: {
              averageRating: true,
              totalTrips: true,
              isRiderVerified: true,
              city: true,
              country: true,
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/admin/users error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
