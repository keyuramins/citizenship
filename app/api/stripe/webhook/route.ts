import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripeClient';
import { createSupabaseServerClient } from '../../../../lib/supabaseClient';
import { randomBytes } from 'crypto';

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
    const customerName = session.customer_details?.name || "";

    const supabase = await createSupabaseServerClient();
    // Use Auth admin API to find user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
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
      if (!createError) {
        // Send invite/password reset email
        await supabase.auth.admin.inviteUserByEmail(customerEmail);
      }
    } else {
      // User exists: update metadata
      const newMeta = { ...user.user_metadata, subscription: subscriptionId };
      await supabase.auth.admin.updateUserById(user.id, { user_metadata: newMeta });
    }
  }

  return NextResponse.json({ received: true });
} 