import { NextRequest, NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/stripeClient';

export async function POST(req: NextRequest) {
  const { priceId, customerEmail, customerId } = await req.json();
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const session = await createStripeCheckoutSession({
      priceId,
      customerEmail,
      customerId,
      successUrl: `${origin}/dashboard?checkout=success`,
      cancelUrl: `${origin}/dashboard?checkout=cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 