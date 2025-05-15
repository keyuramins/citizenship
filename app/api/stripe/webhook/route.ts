import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripeClient';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const customerEmail = session.customer_email;
    const subscriptionId = session.subscription;
    // Update Supabase user
    const supabase = createSupabaseServerClient({});
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, raw_user_meta_data')
      .eq('email', customerEmail)
      .single();
    if (!error && user) {
      const newMeta = { ...user.raw_user_meta_data, subscription: subscriptionId };
      await supabase.auth.admin.updateUserById(user.id, { user_metadata: newMeta });
    }
  }

  return NextResponse.json({ received: true });
} 