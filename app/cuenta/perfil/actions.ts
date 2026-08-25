'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveClientProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
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

  revalidatePath('/cuenta')
  revalidatePath('/cuenta/perfil')
  redirect('/cuenta/perfil?message=Perfil guardado')
}
