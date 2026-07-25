import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'RIDER')
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const reviews = await prisma.review.findMany({
      where: { targetId: session.user.id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        ride:   { select: { pickupAddress: true, destinationAddress: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalCount = reviews.length;

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let ratingSum = 0;

    for (const r of reviews) {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
      ratingSum += r.rating;
    }

    const averageRating = totalCount > 0 ? ratingSum / totalCount : 0;

    return NextResponse.json({ reviews, averageRating, totalCount, breakdown });
  } catch (error) {
    console.error('Rider reviews GET error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
