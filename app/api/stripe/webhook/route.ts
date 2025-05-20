import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripeClient';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err: any) {
    console.error('Stripe webhook signature error:', err);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const customerEmail = session.customer_email;
    const subscriptionId = session.subscription;
    const customerName = session.customer_details?.name || "";

    // Use Service Role Key for admin actions
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    // Use Auth admin API to find user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Supabase listUsers error:', listError);
      return NextResponse.json({ error: `Supabase listUsers error: ${listError.message}` }, { status: 500 });
    }
    const user = users?.users?.find((u: any) => u.email === customerEmail);

    if (!user) {
      // User does not exist: create user
      const randomPassword = randomBytes(12).toString('base64');
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: randomPassword,
        email_confirm: true,
        user_metadata: {
          full_name: customerName,
          subscription: subscriptionId,
        },
      });
      if (createError) {
        console.error('Supabase createUser error:', createError);
        return NextResponse.json({ error: `Supabase createUser error: ${createError.message}` }, { status: 500 });
      }
      if (!createError) {
        // Send invite/password reset email
        try {
        await supabase.auth.admin.inviteUserByEmail(customerEmail);
        } catch (inviteError) {
          console.error('Supabase inviteUserByEmail error:', inviteError);
        }
      }
    } else {
      // User exists: update metadata
      const newMeta = { ...user.user_metadata, subscription: subscriptionId };
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { user_metadata: newMeta });
      if (updateError) {
        console.error('Supabase updateUserById error:', updateError);
        return NextResponse.json({ error: `Supabase updateUserById error: ${updateError.message}` }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
} 