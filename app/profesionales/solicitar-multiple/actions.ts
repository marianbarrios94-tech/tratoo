'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { notifyNewRequest } from '@/lib/email/notify'
import { hasActiveSubscription, FREE_TIER_MONTHLY_REQUEST_LIMIT } from '@/lib/constants/subscriptions'
import { getMonthlyClientIds } from '@/lib/freeTier'

export async function createMultipleServiceRequests(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const professionalIds = (formData.get('professional_ids') as string).split(',').filter(Boolean)
  const message = formData.get('message') as string
  const scheduledAt = formData.get('scheduled_at') as string

  const { data: professionals } = await supabase
    .from('professional_profiles')
    .select('user_id, business_name, category_id, subscription_status')
    .in('user_id', professionalIds)

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()

  let createdCount = 0
  let cappedCount = 0

  for (const professional of professionals ?? []) {
    if (!hasActiveSubscription(professional.subscription_status)) {
      const distinctClients = new Set(await getMonthlyClientIds(professional.user_id))
      const capReached =
        !distinctClients.has(user.id) && distinctClients.size >= FREE_TIER_MONTHLY_REQUEST_LIMIT
      if (capReached) {
        cappedCount++
        continue
      }
    }

    const { error } = await supabase.from('service_requests').insert({
      client_id: user.id,
      professional_id: professional.user_id,
      category_id: professional.category_id,
      message: message || null,
      scheduled_at: scheduledAt || null,
      status: 'pending',
    })

    if (!error) {
      createdCount++
      await notifyNewRequest({
        professionalId: professional.user_id,
        clientName: profile?.full_name ?? 'Un cliente',
        message: message || null,
      })
    }
  }

  if (createdCount === 0) {
    redirect(
      `/profesionales?error=${encodeURIComponent(
        'No pudimos enviar tu solicitud: los profesionales seleccionados ya alcanzaron su límite gratuito este mes.'
      )}`
    )
  }

  const summary =
    cappedCount > 0
      ? `Enviamos tu solicitud a ${createdCount} profesional${createdCount === 1 ? '' : 'es'} (${cappedCount} ya había${cappedCount === 1 ? '' : 'n'} alcanzado su límite gratuito este mes).`
      : `Enviamos tu solicitud a ${createdCount} profesional${createdCount === 1 ? '' : 'es'}.`

  redirect(`/cuenta/solicitudes?message=${encodeURIComponent(summary)}`)
}
