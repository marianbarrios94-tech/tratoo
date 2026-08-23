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

async function logCall(
  supabase: ReturnType<typeof createAdminClient>,
  request: Request,
  rawBody: string,
  note: string
) {
  try {
    let parsedBody: Record<string, unknown> | null = null
    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody)
      } catch {
        parsedBody = { raw: rawBody }
      }
    }
    await supabase.from('webhook_logs').insert({
      source: 'mercadopago',
      headers: Object.fromEntries(request.headers.entries()),
      query: Object.fromEntries(new URL(request.url).searchParams.entries()),
      body: parsedBody,
      note,
    })
  } catch {
    // El logging es best-effort: nunca debe romper la respuesta del webhook.
  }
}

export async function POST(request: Request) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)

  // Mercado Pago puede mandar el body vacío en algunas notificaciones
  // (formato legado por query string) — leer como texto primero evita que
  // un JSON.parse() sobre un body vacío tire una excepción no controlada.
  const rawBody = await request.text()
  let body: Record<string, unknown> | null = null
  try {
    body = rawBody ? JSON.parse(rawBody) : null
  } catch {
    body = null
  }

  const xSignature = request.headers.get('x-signature')
  const xRequestId = request.headers.get('x-request-id')
  const dataId = searchParams.get('data.id') ?? searchParams.get('id')
  const eventType =
    (body?.type as string | undefined) ?? searchParams.get('type') ?? searchParams.get('topic')

  try {
    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId,
      dataId: dataId ?? undefined,
      secret: process.env.MP_WEBHOOK_SECRET!,
    })
  } catch (err) {
    await logCall(
      supabase,
      request,
      rawBody,
      `firma inválida: ${err instanceof Error ? err.message : String(err)}`
    )
    if (err instanceof InvalidWebhookSignatureError) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }
    throw err
  }

  await logCall(supabase, request, rawBody, `eventType=${eventType} dataId=${dataId}`)

  // Cubre "preapproval" y "subscription_preapproval" (los nombres varían
  // según el tópico configurado), pero no "subscription_preapproval_plan"
  // (cambios en la plantilla del plan, no en una suscripción puntual).
  const isPreapprovalEvent =
    eventType != null && eventType.includes('preapproval') && !eventType.includes('plan')

  if (isPreapprovalEvent && dataId) {
    const mpClient = createMercadoPagoClient()

    try {
      const preapproval = await new PreApproval(mpClient).get({ id: dataId })

      const [userId, planId] = (preapproval.external_reference ?? '').split(':')
      if (userId) {
        const { data: plan } = planId
          ? await supabase
              .from('subscription_plans')
              .select('id, slug')
              .eq('id', planId)
              .maybeSingle()
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
    } catch (err) {
      // dataId no correspondía a un preapproval válido (p. ej. era el id de
      // un pago suelto) — no hay nada que sincronizar, seguimos.
      await logCall(
        supabase,
        request,
        rawBody,
        `no se pudo procesar como preapproval: ${err instanceof Error ? err.message : String(err)}`
      )
    }
  }

  return NextResponse.json({ received: true })
}
