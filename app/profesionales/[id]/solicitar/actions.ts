'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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

  redirect('/cuenta/solicitudes?message=Solicitud enviada')
}
