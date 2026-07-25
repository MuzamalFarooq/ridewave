import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/reviews
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { bookingId, rideId, rating, comment, tags } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Verify booking belongs to user and is completed
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, travelerId: session.user.id, status: 'COMPLETED' },
      include: { ride: { include: { rider: true } } },
    });
    if (!booking) return NextResponse.json({ message: 'Booking not found or not completed' }, { status: 404 });

    // Check not already reviewed
    const existing = await prisma.review.findFirst({ where: { bookingId } });
    if (existing) return NextResponse.json({ message: 'You have already reviewed this ride' }, { status: 409 });

    const review = await prisma.review.create({
      data: {
        authorId: session.user.id,
        subjectId: booking.ride.riderId,
        rideId,
        bookingId,
        rating: parseInt(rating),
        comment,
        tags: tags || [],
        type: 'RIDER_REVIEW',
      },
    });

    // Recalculate rider's average rating
    const stats = await prisma.review.aggregate({
      where: { subjectId: booking.ride.riderId, type: 'RIDER_REVIEW' },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.profile.update({
      where: { userId: booking.ride.riderId },
      data: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
