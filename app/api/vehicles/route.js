import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/vehicles — List rider's own vehicles
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const vehicles = await prisma.vehicle.findMany({
      where: { ownerId: session.user.id, isActive: true },
      include: {
        _count: { select: { rides: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ vehicles });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/vehicles — Register new vehicle
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const {
      brand, model, year, color, vehicleType, fuelType, transmission,
      seatCapacity, registrationNumber, insuranceNumber, amenities, photos, name,
    } = body;

    if (!brand || !model || !registrationNumber) {
      return NextResponse.json({ message: 'Brand, model, and registration number are required' }, { status: 400 });
    }

    // Check for duplicate registration
    const existing = await prisma.vehicle.findFirst({ where: { registrationNumber } });
    if (existing) {
      return NextResponse.json({ message: 'A vehicle with this registration number already exists' }, { status: 409 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        ownerId: session.user.id,
        name: name || `${brand} ${model}`,
        brand,
        model,
        year: parseInt(year) || new Date().getFullYear(),
        color: color || '',
        vehicleType: vehicleType || 'CAR',
        fuelType: fuelType || 'PETROL',
        transmission: transmission || 'MANUAL',
        seatCapacity: parseInt(seatCapacity) || 4,
        registrationNumber,
        insuranceNumber: insuranceNumber || null,
        amenities: amenities || [],
        photos: photos || [],
        verificationStatus: 'PENDING',
        isActive: true,
      },
    });

    // Notify admin of new vehicle for verification
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
    await Promise.all(admins.map((admin) =>
      prisma.notification.create({
        data: {
          userId: admin.id,
          type: 'SYSTEM',
          title: '🚗 New Vehicle Registration',
          body: `${session.user.name} registered a ${brand} ${model} (${registrationNumber}) pending verification.`,
          link: '/dashboard/admin/verification',
        },
      })
    ));

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    console.error('POST /api/vehicles error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
