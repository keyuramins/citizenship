import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripeClient';
import { createSupabaseServerClient } from '../../../../lib/supabaseClient';

export async function POST(req: NextRequest) {
  // Get user session from Supabase
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const subscriptionId = user.user_metadata?.subscription;
  if (!subscriptionId) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 400 });
  }
  // Get the Stripe subscription to find the customer ID
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.NEXT_PUBLIC_BASE_URL + '/dashboard',
  });
  return NextResponse.json({ url: portalSession.url });
} 