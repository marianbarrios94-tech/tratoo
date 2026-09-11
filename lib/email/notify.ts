import { createResendClient } from '@/lib/resend/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Registra fallos de envío sin depender de los logs de Vercel (ver
// email_errors en las migraciones). El logging en sí también es
// best-effort: si falla, no debe romper nada.
async function logEmailError(context: string, detail: string) {
  try {
    const admin = createAdminClient()
    await admin.from('email_errors').insert({ context, error_message: detail })
  } catch {
    // noop
  }
}

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
  if (!email) return

  try {
    const resend = createResendClient()
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Tenés una nueva solicitud en Tratoo',
      html: `<p><strong>${clientName}</strong> te envió una solicitud de servicio en Tratoo.</p>${
        message ? `<p>"${message}"</p>` : ''
      }<p>Entrá a tu panel para aceptarla o rechazarla.</p>`,
    })
    // El SDK de Resend no siempre tira una excepción ante un error de la
    // API (ej. remitente sin verificar) — lo devuelve en `error` sin
    // lanzar nada, así que un try/catch solo no lo detecta.
    if (error) {
      await logEmailError('notifyNewRequest', error.message)
    }
  } catch (err) {
    // best-effort: un fallo de email nunca debe romper el flujo principal
    await logEmailError('notifyNewRequest', err instanceof Error ? err.message : String(err))
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
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `${professionalName} ${statusText}`,
      html: `<p><strong>${professionalName}</strong> ${statusText} en Tratoo. Entrá a tu cuenta para ver el detalle.</p>`,
    })
    if (error) {
      await logEmailError('notifyRequestStatusChange', error.message)
    }
  } catch (err) {
    // best-effort: un fallo de email nunca debe romper el flujo principal
    await logEmailError(
      'notifyRequestStatusChange',
      err instanceof Error ? err.message : String(err)
    )
  }
}
