import { NextRequest, NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '../../../../lib/stripeClient';

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    // fallback for form-encoded
    const text = await req.text();
    body = Object.fromEntries(new URLSearchParams(text));
  }
  const { priceId, customerEmail, customerId } = body;
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL;
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