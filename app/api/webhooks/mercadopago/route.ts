import { NextResponse } from 'next/server'
import { PreApproval } from 'mercadopago'
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from 'mercadopago'
import { createMercadoPagoClient } from '@/lib/mercadopago/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasActiveSubscription } from '@/lib/constants/subscriptions'
import type { SubscriptionStatus } from '@/lib/types/database'

const VERIFIED_PLAN_SLUGS = ['pro', 'premium']

function mapStatus(status: string | undefined): SubscriptionStatus {
  switch (status) {
    case 'authorized':
      return 'active'
    case 'paused':
      return 'past_due'
    case 'pending':
      return 'trialing'
    default:
      return 'canceled'
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const dataId = searchParams.get('data.id')
  const xSignature = request.headers.get('x-signature')
  const xRequestId = request.headers.get('x-request-id')

  try {
    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId,
      dataId,
      secret: process.env.MP_WEBHOOK_SECRET!,
    })
  } catch (err) {
    if (err instanceof InvalidWebhookSignatureError) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }
    throw err
  }

  const body = await request.json()

  if (body.type === 'subscription_preapproval' && dataId) {
    const mpClient = createMercadoPagoClient()
    const preapproval = await new PreApproval(mpClient).get({ id: dataId })

    const [userId, planId] = (preapproval.external_reference ?? '').split(':')
    if (!userId) {
      return NextResponse.json({ received: true })
    }

    const supabase = createAdminClient()
    const { data: plan } = planId
      ? await supabase.from('subscription_plans').select('id, slug').eq('id', planId).maybeSingle()
      : { data: null }

    const status = mapStatus(preapproval.status)

    await supabase.from('professional_profiles').upsert({
      user_id: userId,
      subscription_status: status,
      mp_preapproval_id: preapproval.id,
      ...(plan && {
        subscription_plan_id: plan.id,
        verified: hasActiveSubscription(status) && VERIFIED_PLAN_SLUGS.includes(plan.slug),
      }),
    })
  }

  return NextResponse.json({ received: true })
}
