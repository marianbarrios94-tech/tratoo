'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { PreApproval } from 'mercadopago'
import { createClient } from '@/lib/supabase/server'
import { createMercadoPagoClient } from '@/lib/mercadopago/server'

async function currentOrigin() {
  const headersList = await headers()
  return headersList.get('origin') ?? `http://${headersList.get('host')}`
}

export async function startCheckout(formData: FormData) {
  const mpClient = createMercadoPagoClient()
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
    .select('name, price_monthly, currency')
    .eq('id', planId)
    .single()

  if (!plan) {
    redirect(
      `/panel/suscripcion?error=${encodeURIComponent('Este plan todavía no está disponible para pago')}`
    )
  }

  const origin = await currentOrigin()

  let preapproval
  try {
    preapproval = await new PreApproval(mpClient).create({
      body: {
        reason: `Zolvi — Plan ${plan.name}`,
        external_reference: `${user.id}:${planId}`,
        payer_email: user.email,
        back_url: `${origin}/panel/suscripcion?checkout=success`,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: plan.price_monthly,
          currency_id: plan.currency.toUpperCase(),
        },
      },
    })
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    redirect(`/panel/suscripcion?error=${encodeURIComponent(`DEBUG: ${detail}`)}`)
  }

  redirect(preapproval.init_point!)
}

export async function cancelSubscription() {
  const mpClient = createMercadoPagoClient()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('professional_profiles')
    .select('mp_preapproval_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!profile?.mp_preapproval_id) {
    redirect(
      `/panel/suscripcion?error=${encodeURIComponent('Todavía no tenés una suscripción activa')}`
    )
  }

  try {
    await new PreApproval(mpClient).update({
      id: profile.mp_preapproval_id,
      body: { status: 'cancelled' },
    })
  } catch {
    redirect(
      `/panel/suscripcion?error=${encodeURIComponent('No pudimos cancelar la suscripción, intentá de nuevo en unos minutos')}`
    )
  }

  redirect(
    `/panel/suscripcion?message=${encodeURIComponent('Suscripción cancelada')}`
  )
}
