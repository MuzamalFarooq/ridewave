import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        rider: { select: { id: true, name: true, image: true, profile: { select: { averageRating: true, totalTrips: true, city: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ favorites });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { riderId } = await request.json();
    if (!riderId) return NextResponse.json({ message: 'riderId required' }, { status: 400 });
    const existing = await prisma.favorite.findFirst({ where: { userId: session.user.id, riderId } });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    }
    const favorite = await prisma.favorite.create({ data: { userId: session.user.id, riderId } });
    return NextResponse.json({ favorited: true, favorite }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
