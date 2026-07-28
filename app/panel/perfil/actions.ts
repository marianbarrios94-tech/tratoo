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
  const city = formData.get('city') as string
  const yearsExperience = formData.get('years_experience') as string
  const bio = formData.get('bio') as string

  const { error } = await supabase.from('professional_profiles').upsert({
    user_id: user.id,
    business_name: businessName,
    category_id: categoryId || null,
    city: city || null,
    years_experience: yearsExperience ? Number(yearsExperience) : null,
    bio: bio || null,
  })

  if (error) {
    redirect(`/panel/perfil?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/panel/perfil?message=Perfil guardado')
}
