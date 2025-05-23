import { NextRequest, NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '../../../../lib/stripeClient';
import { createSupabaseServerClient } from '../../../../lib/supabaseClient';

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const bodyText = await req.text();
  let body;
  try {
    body = JSON.parse(bodyText);
  } catch {
    body = Object.fromEntries(new URLSearchParams(bodyText));
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
      metadata: { customerEmail: user && user.email || customerEmail, customerId: user && user.id || undefined },
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 