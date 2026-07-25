import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/rides — Search/list rides (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pickup = searchParams.get('pickup');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const seats = parseInt(searchParams.get('seats') || '1');
    const vehicleType = searchParams.get('vehicleType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'departureDate';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const where = {
      status: 'PUBLISHED',
      availableSeats: { gte: seats },
      ...(pickup ? { pickupAddress: { contains: pickup, mode: 'insensitive' } } : {}),
      ...(destination ? { destinationAddress: { contains: destination, mode: 'insensitive' } } : {}),
      ...(date ? { departureDate: { gte: new Date(date), lt: new Date(new Date(date).getTime() + 86400000) } } : {}),
      ...(vehicleType ? { vehicle: { vehicleType } } : {}),
      ...(minPrice ? { pricePerSeat: { gte: parseFloat(minPrice) } } : {}),
      ...(maxPrice ? { pricePerSeat: { ...(minPrice ? { gte: parseFloat(minPrice) } : {}), lte: parseFloat(maxPrice) } } : {}),
    };

    const orderBy = sortBy === 'price_asc' ? { pricePerSeat: 'asc' }
      : sortBy === 'price_desc' ? { pricePerSeat: 'desc' }
      : sortBy === 'rating' ? { rider: { profile: { averageRating: 'desc' } } }
      : { departureDate: 'asc' };

    const [rides, total] = await Promise.all([
      prisma.ride.findMany({
        where,
        include: {
          rider: {
            select: {
              id: true, name: true, image: true,
              profile: { select: { averageRating: true, totalTrips: true, isRiderVerified: true } },
            },
          },
          vehicle: { select: { brand: true, model: true, vehicleType: true, amenities: true, photos: true } },
          _count: { select: { bookings: { where: { status: { in: ['PENDING', 'CONFIRMED', 'ONGOING'] } } } } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ride.count({ where }),
    ]);

    // Add available seats count
    const enriched = rides.map((r) => ({
      ...r,
      seatsLeft: r.availableSeats - r._count.bookings,
    }));

    return NextResponse.json({ rides: enriched, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('GET /api/rides error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/rides — Create a new ride (rider only)
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'RIDER') {
      return NextResponse.json({ message: 'Only riders can create rides' }, { status: 403 });
    }

    const body = await request.json();
    const {
      vehicleId, pickupAddress, destinationAddress, pickupLat, pickupLng,
      destinationLat, destinationLng, departureDate, departureTime, estimatedArrival,
      availableSeats, pricePerSeat, description, rules, stops, instantBooking,
      luggageAllowed, smokingAllowed, petsAllowed, womenOnly, recurringDays,
      status,
    } = body;

    if (!vehicleId || !pickupAddress || !destinationAddress || !departureDate || !pricePerSeat) {
      return NextResponse.json({ message: 'vehicleId, pickup, destination, date, and price are required' }, { status: 400 });
    }

    // Verify vehicle belongs to rider and is approved
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, ownerId: session.user.id, verificationStatus: 'APPROVED' },
    });
    if (!vehicle) {
      return NextResponse.json({ message: 'Vehicle not found or not yet verified' }, { status: 400 });
    }

    const ride = await prisma.ride.create({
      data: {
        riderId: session.user.id,
        vehicleId,
        pickupAddress,
        destinationAddress,
        pickupLat: pickupLat || null,
        pickupLng: pickupLng || null,
        destinationLat: destinationLat || null,
        destinationLng: destinationLng || null,
        departureDate: new Date(departureDate),
        departureTime: departureTime || '',
        estimatedArrival: estimatedArrival ? new Date(estimatedArrival) : null,
        availableSeats: parseInt(availableSeats) || vehicle.seatCapacity,
        pricePerSeat: parseFloat(pricePerSeat),
        description: description || null,
        rules: rules || [],
        instantBooking: instantBooking || false,
        luggageAllowed: luggageAllowed !== false,
        smokingAllowed: smokingAllowed || false,
        petsAllowed: petsAllowed || false,
        womenOnly: womenOnly || false,
        recurringDays: recurringDays || [],
        status: status || 'PUBLISHED',
        stops: stops ? { create: stops.map((s, i) => ({ address: s.address, lat: s.lat, lng: s.lng, order: i + 1 })) } : undefined,
      },
      include: { vehicle: true, stops: true },
    });

    return NextResponse.json({ ride }, { status: 201 });
  } catch (error) {
    console.error('POST /api/rides error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
