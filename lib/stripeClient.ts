// Stripe client setup for browser-side usage (Stripe.js)
// For server-side, use Stripe secret key in API routes only

// TODO: Implement Stripe client logic for payment flows
// Example: import { loadStripe } from '@stripe/stripe-js';
// export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); 

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function getStripeProductsWithPrices() {
  const products = await stripe.products.list({ active: true });
  const prices = await stripe.prices.list({ active: true });
  return products.data.map(product => ({
    ...product,
    prices: prices.data.filter(price => price.product === product.id),
  }));
}

export async function createStripeCheckoutSession({
  priceId,
  customerEmail,
  successUrl,
  cancelUrl,
  customerId,
  metadata,
}: {
  priceId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
  metadata?: Record<string, any>;
}) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: customerEmail,
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    metadata,
    payment_intent_data: {
      metadata,
    },
    subscription_data: {
      metadata,
    },
  });
} 