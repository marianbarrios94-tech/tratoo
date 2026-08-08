'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { notifyNewRequest } from '@/lib/email/notify'
import { hasActiveSubscription, FREE_TIER_MONTHLY_REQUEST_LIMIT } from '@/lib/constants/subscriptions'
import { getMonthlyClientIds } from '@/lib/freeTier'

export async function createServiceRequest(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const professionalId = formData.get('professional_id') as string
  const categoryId = formData.get('category_id') as string
  const message = formData.get('message') as string
  const scheduledAt = formData.get('scheduled_at') as string

  const { data: professional } = await supabase
    .from('professional_profiles')
    .select('subscription_status')
    .eq('user_id', professionalId)
    .maybeSingle()

  if (!professional) {
    redirect('/profesionales')
  }

  if (!hasActiveSubscription(professional.subscription_status)) {
    const distinctClients = new Set(await getMonthlyClientIds(supabase, professionalId))
    // Si este cliente ya le escribió este mes, no consume un cupo nuevo.
    if (!distinctClients.has(user.id) && distinctClients.size >= FREE_TIER_MONTHLY_REQUEST_LIMIT) {
      redirect(
        `/profesionales/${professionalId}/solicitar?error=${encodeURIComponent(
          'Este profesional ya alcanzó su límite de contactos gratuitos este mes.'
        )}`
      )
    }
  }

  const { error } = await supabase.from('service_requests').insert({
    client_id: user.id,
    professional_id: professionalId,
    category_id: categoryId || null,
    message: message || null,
    scheduled_at: scheduledAt || null,
    status: 'pending',
  })

  if (error) {
    redirect(
      `/profesionales/${professionalId}/solicitar?error=${encodeURIComponent(error.message)}`
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()

  await notifyNewRequest({
    professionalId,
    clientName: profile?.full_name ?? 'Un cliente',
    message: message || null,
  })

  redirect('/cuenta/solicitudes?message=Solicitud enviada')
}
