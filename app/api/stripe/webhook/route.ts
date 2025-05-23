// app/api/stripe/webhook/route.ts

import { NextResponse } from 'next/server'
import { Stripe } from 'stripe'
import { stripe } from '../../../../lib/stripeClient'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import { Buffer } from 'buffer'

export const runtime = 'nodejs'
export const config = {
  api: {
    bodyParser: false,
  },
}

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
const supabaseUrl    = process.env.SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function findUserByEmail(supabase: any, email: string) {
  let page = 1
  const perPage = 100
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) throw error
    const match = data.users.find((u: any) => u.email === email)
    if (match) return match
    if (data.users.length < perPage) break
    page++
  }
  return null
}

export async function POST(req: Request) {
  // read raw body
  const buf = Buffer.from(await req.arrayBuffer())
  const sig = req.headers.get('stripe-signature')!
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed' || event.type === 'invoice.payment_succeeded') {
    const invoice          = event.data.object as Stripe.Invoice
    const metadata         = invoice.metadata || {}
    const supabaseUserId   = metadata.customerId as string | undefined
    const email            = metadata.customerEmail as string
                          || invoice.customer_email as string
                          || invoice.customer as string
    const subscriptionId   = (invoice as any).subscription as string | undefined
    const name             = (invoice as any).customer_details?.name
                          || (invoice as any).billing_details?.name
                          || ''

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    if (supabaseUserId) {
      const { data: getRes } = await supabase.auth.admin.getUserById(supabaseUserId)
      if (getRes.user) {
        await supabase.auth.admin.updateUserById(supabaseUserId, {
          user_metadata: {
            ...getRes.user.user_metadata,
            subscription: subscriptionId,
          },
        })
      }
    } else if (typeof email === 'string') {
      const existing = await findUserByEmail(supabase, email)
      if (existing) {
        await supabase.auth.admin.updateUserById(existing.id, {
          user_metadata: {
            ...existing.user_metadata,
            subscription: subscriptionId,
          },
        })
      } else {
        const randomPassword = randomBytes(12).toString('base64')
        await supabase.auth.admin.createUser({
          email,
          password: randomPassword,
          email_confirm: true,
          user_metadata: { full_name: name, subscription: subscriptionId },
        })
        await supabase.auth.admin.inviteUserByEmail(email)
      }
    }
  }

  return NextResponse.json({ received: true })
}
