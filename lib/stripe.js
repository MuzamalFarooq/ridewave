import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  appInfo: {
    name: 'RideWave',
    version: '1.0.0',
  },
});

/**
 * Create a Stripe PaymentIntent
 */
export const createPaymentIntent = async ({ amount, currency = 'usd', metadata = {} }) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  });
  return paymentIntent;
};

/**
 * Confirm a PaymentIntent
 */
export const confirmPaymentIntent = async (paymentIntentId) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};

/**
 * Create a refund
 */
export const createRefund = async ({ chargeId, amount, reason = 'requested_by_customer' }) => {
  return await stripe.refunds.create({
    charge: chargeId,
    amount: amount ? Math.round(amount * 100) : undefined,
    reason,
  });
};

/**
 * Validate Stripe webhook event
 */
export const constructWebhookEvent = (payload, signature) => {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
};
