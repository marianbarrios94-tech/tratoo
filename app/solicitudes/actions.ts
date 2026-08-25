'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { RequestStatus } from '@/lib/types/database'
import { notifyRequestStatusChange } from '@/lib/email/notify'

function revalidateRequestPages() {
  revalidatePath('/panel')
  revalidatePath('/panel/solicitudes')
  revalidatePath('/cuenta')
  revalidatePath('/cuenta/solicitudes')
}

async function transition(
  formData: FormData,
  allowedFrom: RequestStatus[],
  to: RequestStatus,
  side: 'client' | 'professional',
  notifyClient = false,
  extra: Record<string, unknown> = {}
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const requestId = formData.get('request_id') as string
  const redirectTo = (formData.get('redirect_to') as string) || '/'

  if (!user) {
    redirect('/login')
  }

  const { data: request } = await supabase
    .from('service_requests')
    .select('id, status, client_id, professional_id')
    .eq('id', requestId)
    .maybeSingle()

  const ownerId = side === 'client' ? request?.client_id : request?.professional_id

  if (!request || ownerId !== user.id || !allowedFrom.includes(request.status)) {
    redirect(`${redirectTo}?error=${encodeURIComponent('No se pudo actualizar la solicitud')}`)
  }

  const { error } = await supabase
    .from('service_requests')
    .update({ status: to, ...extra })
    .eq('id', requestId)

  if (error) {
    redirect(`${redirectTo}?error=${encodeURIComponent(error.message)}`)
  }

  if (notifyClient) {
    const { data: professionalProfile } = await supabase
      .from('professional_profiles')
      .select('business_name')
      .eq('user_id', user.id)
      .maybeSingle()

    await notifyRequestStatusChange({
      clientId: request.client_id,
      professionalName: professionalProfile?.business_name ?? 'Un profesional',
      status: to,
    })
  }

  revalidateRequestPages()
  redirect(redirectTo)
}

export async function acceptRequest(formData: FormData) {
  await transition(formData, ['pending'], 'accepted', 'professional', true)
}

export async function rejectRequest(formData: FormData) {
  await transition(formData, ['pending'], 'cancelled', 'professional', true)
}

export async function cancelRequest(formData: FormData) {
  await transition(formData, ['pending'], 'cancelled', 'client')
}

export async function leaveReview(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const requestId = formData.get('request_id') as string
  const rating = Number(formData.get('rating'))
  const comment = formData.get('comment') as string

  const { data: request } = await supabase
    .from('service_requests')
    .select('id, status, client_id, professional_id')
    .eq('id', requestId)
    .maybeSingle()

  if (!request || request.client_id !== user.id || request.status !== 'accepted') {
    redirect(`/cuenta/solicitudes?error=${encodeURIComponent('No se pudo dejar la reseña')}`)
  }

  const { error: statusError } = await supabase
    .from('service_requests')
    .update({ status: 'completed' })
    .eq('id', requestId)

  if (statusError) {
    redirect(`/cuenta/solicitudes?error=${encodeURIComponent(statusError.message)}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()

  const { error } = await supabase.from('reviews').insert({
    request_id: requestId,
    professional_id: request.professional_id,
    client_name: profile?.full_name ?? null,
    rating,
    comment: comment || null,
  })

  if (error) {
    redirect(`/cuenta/solicitudes?error=${encodeURIComponent(error.message)}`)
  }

  revalidateRequestPages()
  revalidatePath(`/profesionales/${request.professional_id}`)
  redirect(`/cuenta/solicitudes?message=${encodeURIComponent('¡Gracias por tu reseña! Marcamos el pedido como resuelto.')}`)
}
