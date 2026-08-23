'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/lib/types/database'
import { translateAuthError } from '@/lib/authErrors'

async function currentOrigin() {
  const headersList = await headers()
  return headersList.get('origin') ?? `http://${headersList.get('host')}`
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    redirect(`/login?error=${encodeURIComponent(translateAuthError(error.message))}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle()

  redirect(profile?.role === 'professional' || profile?.role === 'admin' ? '/panel' : '/cuenta')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const role = formData.get('role') as UserRole

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, full_name: fullName },
      emailRedirectTo: `${await currentOrigin()}/auth/callback`,
    },
  })
  if (error) {
    redirect(`/registro?error=${encodeURIComponent(translateAuthError(error.message))}`)
  }
  if (data.session) {
    redirect(role === 'professional' ? '/panel' : '/cuenta')
  }
  redirect(`/login?message=${encodeURIComponent('Revisá tu email para confirmar la cuenta')}`)
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await currentOrigin()}/auth/callback?next=/actualizar-contrasena`,
  })

  redirect(
    `/login?message=${encodeURIComponent('Si el email existe, te enviamos instrucciones para restablecer tu contraseña')}`
  )
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?error=${encodeURIComponent('El enlace expiró, solicitá uno nuevo')}`)
  }

  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    redirect(`/actualizar-contrasena?error=${encodeURIComponent(translateAuthError(error.message))}`)
  }

  redirect(`/login?message=${encodeURIComponent('Contraseña actualizada, iniciá sesión')}`)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
