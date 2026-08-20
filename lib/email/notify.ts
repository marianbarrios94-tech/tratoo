import { createResendClient } from '@/lib/resend/server'
import { createAdminClient } from '@/lib/supabase/admin'

const FROM = 'Tratoo <onboarding@resend.dev>'

async function getProfileEmail(userId: string) {
  const admin = createAdminClient()
  const { data } = await admin.from('profiles').select('email').eq('id', userId).maybeSingle()
  return data?.email ?? null
}

export async function notifyNewRequest({
  professionalId,
  clientName,
  message,
}: {
  professionalId: string
  clientName: string
  message: string | null
}) {
  const email = await getProfileEmail(professionalId)
  if (!email) return

  try {
    const resend = createResendClient()
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Tenés una nueva solicitud en Tratoo',
      html: `<p><strong>${clientName}</strong> te envió una solicitud de servicio en Tratoo.</p>${
        message ? `<p>"${message}"</p>` : ''
      }<p>Entrá a tu panel para aceptarla o rechazarla.</p>`,
    })
  } catch {
    // best-effort: un fallo de email nunca debe romper el flujo principal
  }
}

const STATUS_TEXT: Record<string, string> = {
  accepted: 'aceptó tu solicitud',
  cancelled: 'no va a poder tomar tu solicitud',
  completed: 'marcó tu solicitud como completada',
}

export async function notifyRequestStatusChange({
  clientId,
  professionalName,
  status,
}: {
  clientId: string
  professionalName: string
  status: string
}) {
  const email = await getProfileEmail(clientId)
  if (!email) return

  const statusText = STATUS_TEXT[status]
  if (!statusText) return

  try {
    const resend = createResendClient()
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `${professionalName} ${statusText}`,
      html: `<p><strong>${professionalName}</strong> ${statusText} en Tratoo. Entrá a tu cuenta para ver el detalle.</p>`,
    })
  } catch {
    // best-effort: un fallo de email nunca debe romper el flujo principal
  }
}
