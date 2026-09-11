'use server'

import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createResendClient } from '@/lib/resend/server'

// Ver la nota equivalente en lib/email/notify.ts sobre RESEND_FROM_EMAIL.
const FROM = process.env.RESEND_FROM_EMAIL || 'Tratoo <onboarding@resend.dev>'

// tratoo.ar ya está verificado en Resend — cambiar a tratoo.contacto@gmail.com
// cuando se quiera que los mensajes de contacto lleguen ahí en vez de acá.
const NOTIFY_EMAIL = 'marianbarrios94@gmail.com'

export async function sendContactMessage(formData: FormData) {
  const name = ((formData.get('name') as string) || '').trim() || null
  const email = ((formData.get('email') as string) || '').trim()
  const message = ((formData.get('message') as string) || '').trim()

  if (!email || !message) {
    redirect(`/contacto?error=${encodeURIComponent('Completá tu email y tu mensaje')}`)
  }

  const admin = createAdminClient()
  const { error } = await admin.from('contact_messages').insert({ name, email, message })

  if (error) {
    redirect(
      `/contacto?error=${encodeURIComponent('No pudimos enviar tu mensaje, intentá de nuevo')}`
    )
  }

  try {
    const resend = createResendClient()
    const { error: sendError } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `Nuevo mensaje de contacto${name ? ` de ${name}` : ''}`,
      text: `De: ${name ?? 'Sin nombre'} <${email}>\n\n${message}`,
    })
    // Resend no siempre tira una excepción ante un error de la API (ej.
    // remitente sin verificar) — lo devuelve en `error` sin lanzar nada.
    if (sendError) {
      const admin = createAdminClient()
      await admin
        .from('email_errors')
        .insert({ context: 'sendContactMessage', error_message: sendError.message })
    }
  } catch {
    // best-effort: el mensaje ya quedó guardado en la base
  }

  redirect(
    `/contacto?message=${encodeURIComponent('Gracias, recibimos tu mensaje. Te vamos a responder por email.')}`
  )
}
