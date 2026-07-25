import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createPaymentIntent, constructWebhookEvent } from '@/lib/stripe';

// POST /api/payments/create-intent
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { bookingId, amount, currency = 'usd' } = await request.json();

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, travelerId: session.user.id },
    });
    if (!booking) return NextResponse.json({ message: 'Booking not found' }, { status: 404 });

    const paymentIntent = await createPaymentIntent({
      amount,
      currency,
      metadata: { bookingId, userId: session.user.id },
    });

    // Update/create payment record
    await prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        userId: session.user.id,
        amount,
        currency,
        method: 'STRIPE',
        status: 'PENDING',
        stripePaymentIntentId: paymentIntent.id,
      },
      update: { stripePaymentIntentId: paymentIntent.id },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent error:', error);
    return NextResponse.json({ message: 'Payment failed' }, { status: 500 });
  }
}
