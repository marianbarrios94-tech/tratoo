import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createStripeClient } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { SubscriptionStatus } from '@/lib/types/database'

function mapStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case 'trialing':
      return 'trialing'
    case 'active':
      return 'active'
    case 'past_due':
    case 'unpaid':
    case 'incomplete':
      return 'past_due'
    default:
      return 'canceled'
  }
}

async function syncFromSubscription(subscription: Stripe.Subscription, userId?: string | null) {
  const supabase = createAdminClient()
  const priceId = subscription.items.data[0]?.price.id

  const { data: plan } = priceId
    ? await supabase
        .from('subscription_plans')
        .select('id')
        .eq('stripe_price_id', priceId)
        .maybeSingle()
    : { data: null }

  const update = {
    subscription_status: mapStatus(subscription.status),
    subscription_plan_id: plan?.id ?? null,
    stripe_subscription_id: subscription.id,
    stripe_customer_id:
      typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id,
  }

  if (userId) {
    await supabase.from('professional_profiles').upsert({ user_id: userId, ...update })
  } else {
    await supabase
      .from('professional_profiles')
      .update(update)
      .eq('stripe_subscription_id', subscription.id)
  }
}

export async function POST(request: Request) {
  const stripe = createStripeClient()
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        await syncFromSubscription(subscription, session.client_reference_id)
      }
      break
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      await syncFromSubscription(subscription)
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const supabase = createAdminClient()
      await supabase
        .from('professional_profiles')
        .update({ subscription_status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
    default:
      break
  }

  return NextResponse.json({ received: true })
}
