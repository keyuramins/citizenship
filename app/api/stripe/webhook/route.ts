// /app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripeClient';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const supabaseUrl    = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function findUserByEmail(supabase: any, email: string) {
  let page = 1;
  const perPage = 100;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((u: any) => u.email === email);
    if (match) return match;
    if (data.users.length < perPage) break;
    page++;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const sig     = req.headers.get('stripe-signature')!;
  const rawBody = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'invoice.payment_succeeded'
  ) {
    const obj          = event.data.object as any;
    const metadata     = obj.metadata || {};
    const supabaseUserId = metadata.customerId as string | undefined;
    const email        = metadata.customerEmail as string;
    const subscriptionId = obj.subscription as string;
    const name         = obj.customer_details?.name || obj.billing_details?.name || '';

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    if (supabaseUserId) {
      const { data: getRes } = await supabase.auth.admin.getUserById(supabaseUserId);
      if (getRes.user) {
        const existingMeta = getRes.user.user_metadata;
        await supabase.auth.admin.updateUserById(supabaseUserId, {
          user_metadata: { ...existingMeta, subscription: subscriptionId }
        });
      }
    } else {
      const existing = await findUserByEmail(supabase, email);
      if (existing) {
        const existingMeta = existing.user_metadata;
        await supabase.auth.admin.updateUserById(existing.id, {
          user_metadata: { ...existingMeta, subscription: subscriptionId }
        });
      } else {
        const randomPassword = randomBytes(12).toString('base64');
        await supabase.auth.admin.createUser({
          email,
          password: randomPassword,
          email_confirm: true,
          user_metadata: { full_name: name, subscription: subscriptionId }
        });
        await supabase.auth.admin.inviteUserByEmail(email);
      }
    }
  }

  return NextResponse.json({ received: true });
}
