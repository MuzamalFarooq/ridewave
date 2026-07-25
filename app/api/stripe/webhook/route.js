import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { constructWebhookEvent } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    let event;
    try {
      event = constructWebhookEvent(body, signature);
    } catch (err) {
      return NextResponse.json({ message: `Webhook signature error: ${err.message}` }, { status: 400 });
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const { id, metadata } = event.data.object;
        const { bookingId } = metadata;

        await prisma.payment.update({
          where: { bookingId },
          data: { status: 'COMPLETED', stripeChargeId: event.data.object.latest_charge },
        });

        // Confirm booking if pending
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (booking?.status === 'PENDING') {
          await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED', confirmedAt: new Date() },
          });
          // Notify
          if (global.io) {
            global.io.to(`user:${booking.travelerId}`).emit('payment:success', { bookingId });
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const { metadata } = event.data.object;
        await prisma.payment.update({
          where: { bookingId: metadata.bookingId },
          data: { status: 'FAILED' },
        });
        break;
      }

      case 'charge.refunded': {
        const { metadata } = event.data.object;
        if (metadata?.bookingId) {
          await prisma.payment.update({
            where: { bookingId: metadata.bookingId },
            data: { status: 'REFUNDED', refundedAt: new Date() },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ message: 'Webhook error' }, { status: 500 });
  }
}
