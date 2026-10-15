import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// Tipos de enlace por mail que se verifican con token_hash.
const OTP_TYPES: EmailOtpType[] = ['recovery', 'email']

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Enlaces nuevos: el mail trae un token_hash que se verifica directo. A
  // diferencia del flujo con `code` (PKCE), no depende de que el enlace se
  // abra en el mismo navegador desde donde se pidió, así que funciona aunque
  // la persona toque el link desde la app de Gmail o desde otro dispositivo.
  if (tokenHash && type && OTP_TYPES.includes(type)) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('El enlace venció o ya se usó. Pedí uno nuevo desde "¿Olvidaste tu contraseña?"')}`
    )
  }

  // Enlaces con `code` (mails ya enviados con el flujo anterior).
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent('No pudimos confirmar tu cuenta, intentá de nuevo')}`
  )
}
