import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/admin-auth';

// GET /api/admin/search?q=... — Global admin multi-category search
export async function GET(request) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [], riders: [], bookings: [] });
    }

    const [users, riders, bookings] = await Promise.all([
      // Users (Travelers / general users)
      prisma.user.findMany({
        where: {
          role: 'TRAVELER',
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 6,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          role: true,
          isActive: true,
          isBanned: true,
          createdAt: true,
        },
      }),

      // Riders
      prisma.user.findMany({
        where: {
          role: 'RIDER',
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
            {
              vehicles: {
                some: {
                  registrationNumber: { contains: query, mode: 'insensitive' },
                },
              },
            },
          ],
        },
        take: 6,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          role: true,
          isActive: true,
          isBanned: true,
          vehicles: {
            take: 1,
            select: { brand: true, model: true, registrationNumber: true },
          },
        },
      }),

      // Bookings
      prisma.booking.findMany({
        where: {
          OR: [
            { bookingRef: { contains: query, mode: 'insensitive' } },
            { passengerName: { contains: query, mode: 'insensitive' } },
            { pickupAddress: { contains: query, mode: 'insensitive' } },
            { dropoffAddress: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 6,
        include: {
          traveler: { select: { name: true, email: true } },
          ride: { select: { pickupAddress: true, destinationAddress: true, departureDate: true } },
          payment: { select: { amount: true, status: true } },
        },
      }),
    ]);

    return NextResponse.json({
      users,
      riders,
      bookings,
    });
  } catch (error) {
    console.error('GET /api/admin/search error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

