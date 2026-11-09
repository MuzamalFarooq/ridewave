import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/admin-auth';

// GET /api/admin/riders — List and filter riders with vehicle and verification details
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
    const status = searchParams.get('status'); // ACTIVE | BLOCKED | ALL
    const verificationStatus = searchParams.get('verificationStatus'); // APPROVED | PENDING | REJECTED | ALL

    const where = {
      role: 'RIDER',
      ...(status === 'BLOCKED'
        ? { OR: [{ isBanned: true }, { isActive: false }] }
        : status === 'ACTIVE'
        ? { isBanned: false, isActive: true }
        : {}),
      ...(verificationStatus && verificationStatus !== 'ALL'
        ? {
            verification: {
              status: verificationStatus,
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              {
                vehicles: {
                  some: {
                    registrationNumber: { contains: search, mode: 'insensitive' },
                  },
                },
              },
            ],
          }
        : {}),
    };

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
              city: true,
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
              licenseUrl: true,
              idFrontUrl: true,
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      riders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/admin/riders error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

