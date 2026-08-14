'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function saveProfessionalProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const businessName = formData.get('business_name') as string
  const categoryId = formData.get('category_id') as string
  const customProfession = formData.get('custom_profession') as string
  const city = formData.get('city') as string
  const yearsExperience = formData.get('years_experience') as string
  const bio = formData.get('bio') as string
  const phone = formData.get('phone') as string

  if (!categoryId && !customProfession) {
    redirect(
      `/panel/perfil?error=${encodeURIComponent('Elegí una categoría o contanos tu profesión')}`
    )
  }

  const { error } = await supabase.from('professional_profiles').upsert({
    user_id: user.id,
    business_name: businessName,
    category_id: categoryId || null,
    custom_profession: categoryId ? null : customProfession || null,
    city: city || null,
    years_experience: yearsExperience ? Number(yearsExperience) : null,
    bio: bio || null,
  })

  if (error) {
    redirect(`/panel/perfil?error=${encodeURIComponent(error.message)}`)
  }

  const { error: contactError } = await supabase
    .from('professional_contacts')
    .upsert({ user_id: user.id, phone: phone || null })

  if (contactError) {
    redirect(`/panel/perfil?error=${encodeURIComponent(contactError.message)}`)
  }

  redirect('/panel/perfil?message=Perfil guardado')
}
