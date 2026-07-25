import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/cloudinary';

// GET /api/profile — Get current user profile
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        vehicles: { where: { isActive: true }, take: 5 },
        _count: { select: { ridesAsRider: true, bookingsAsPassenger: true } },
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/profile — Update profile
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, phone, image, bio, city, dateOfBirth, gender, preferredLanguage } = body;

    const [user] = await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: name || undefined,
          phone: phone || undefined,
          image: image || undefined,
        },
      }),
      prisma.profile.update({
        where: { userId: session.user.id },
        data: {
          bio: bio !== undefined ? bio : undefined,
          city: city !== undefined ? city : undefined,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          gender: gender || undefined,
          preferredLanguage: preferredLanguage || undefined,
        },
      }),
    ]);

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
