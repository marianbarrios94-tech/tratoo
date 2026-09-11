import { createResendClient } from '@/lib/resend/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function logEmailTrace(context: string, note: string) {
  try {
    const admin = createAdminClient()
    await admin.from('email_errors').insert({
      context,
      error_message: note,
    })
  } catch {
    // el logging también es best-effort
  }
}

// Hasta que tratoo.ar esté verificado en Resend, esto sigue apuntando a la
// dirección de pruebas compartida (onboarding@resend.dev), que solo entrega
// a la propia casilla verificada en Resend — no a usuarios reales. Una vez
// verificado el dominio, definir RESEND_FROM_EMAIL en Vercel (ej. "Tratoo
// <notificaciones@tratoo.ar>") y volver a desplegar.
const FROM = process.env.RESEND_FROM_EMAIL || 'Tratoo <onboarding@resend.dev>'

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
  if (!email) {
    await logEmailTrace('notifyNewRequest', `sin email para professionalId=${professionalId}`)
    return
  }

  try {
    const resend = createResendClient()
    const result = await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Tenés una nueva solicitud en Tratoo',
      html: `<p><strong>${clientName}</strong> te envió una solicitud de servicio en Tratoo.</p>${
        message ? `<p>"${message}"</p>` : ''
      }<p>Entrá a tu panel para aceptarla o rechazarla.</p>`,
    })
    await logEmailTrace(
      'notifyNewRequest',
      `ok from=${FROM} envHasVar=${Boolean(process.env.RESEND_FROM_EMAIL)} to=${email} result=${JSON.stringify(result)}`
    )
  } catch (err) {
    // best-effort: un fallo de email nunca debe romper el flujo principal
    await logEmailTrace('notifyNewRequest', `error to=${email}: ${err instanceof Error ? err.message : String(err)}`)
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
  } catch (err) {
    // best-effort: un fallo de email nunca debe romper el flujo principal
    await logEmailTrace(
      'notifyRequestStatusChange',
      `error to=${email}: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}
