'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createStripeClient } from '@/lib/stripe/server'

async function currentOrigin() {
  const headersList = await headers()
  return headersList.get('origin') ?? `http://${headersList.get('host')}`
}

export async function startCheckout(formData: FormData) {
  const stripe = createStripeClient()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const planId = formData.get('plan_id') as string

  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('stripe_price_id')
    .eq('id', planId)
    .single()

  if (!plan?.stripe_price_id) {
    redirect(
      `/panel/suscripcion?error=${encodeURIComponent('Este plan todavía no está disponible para pago')}`
    )
  }

  const { data: profile } = await supabase
    .from('professional_profiles')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  const origin = await currentOrigin()

  let customerId = profile?.stripe_customer_id ?? null
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    })
    customerId = customer.id
    await supabase
      .from('professional_profiles')
      .upsert({ user_id: user.id, stripe_customer_id: customerId })
  }

  let session
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      success_url: `${origin}/panel/suscripcion?checkout=success`,
      cancel_url: `${origin}/panel/suscripcion?checkout=cancelled`,
    })
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes('combine currencies')
        ? 'No pudimos iniciar el pago porque tu cuenta de facturación ya tiene una moneda distinta. Escribinos para ayudarte a migrar de plan.'
        : 'No pudimos iniciar el pago, intentá de nuevo en unos minutos'
    redirect(`/panel/suscripcion?error=${encodeURIComponent(message)}`)
  }

  redirect(session.url!)
}

export async function openBillingPortal() {
  const stripe = createStripeClient()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('professional_profiles')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!profile?.stripe_customer_id) {
    redirect(
      `/panel/suscripcion?error=${encodeURIComponent('Todavía no tenés una suscripción activa')}`
    )
  }

  const origin = await currentOrigin()

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/panel/suscripcion`,
  })

  redirect(session.url)
}
