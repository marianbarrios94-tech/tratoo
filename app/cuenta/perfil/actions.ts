'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { uploadAvatarIfProvided } from '@/lib/avatar'

export async function saveClientProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const avatarError = await uploadAvatarIfProvided(supabase, user.id, formData)
  if (avatarError) {
    redirect(`/cuenta/perfil?error=${encodeURIComponent(avatarError)}`)
  }

  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const city = formData.get('city') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phone || null,
      city: city || null,
    })
    .eq('id', user.id)

  if (error) {
    redirect(`/cuenta/perfil?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/cuenta/perfil?message=Perfil guardado')
}
