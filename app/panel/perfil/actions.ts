'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { lookupCityCoordinates } from '@/lib/geo'

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
  const licenseNumber = formData.get('license_number') as string
  const city = formData.get('city') as string
  const province = formData.get('province') as string
  const yearsExperience = formData.get('years_experience') as string
  const bio = formData.get('bio') as string
  const phone = formData.get('phone') as string

  if (!categoryId && !customProfession) {
    redirect(
      `/panel/perfil?error=${encodeURIComponent('Elegí una categoría o contanos tu profesión')}`
    )
  }

  if (!province) {
    redirect(`/panel/perfil?error=${encodeURIComponent('Elegí tu provincia')}`)
  }

  if (!phone) {
    redirect(
      `/panel/perfil?error=${encodeURIComponent('Agregá un teléfono de WhatsApp para que los clientes puedan contactarte')}`
    )
  }

  const coords = lookupCityCoordinates(city)

  const { error } = await supabase.from('professional_profiles').upsert({
    user_id: user.id,
    business_name: businessName,
    category_id: categoryId || null,
    custom_profession: categoryId ? null : customProfession || null,
    license_number: licenseNumber || null,
    city: city || null,
    province,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
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

  revalidatePath('/panel')
  revalidatePath('/panel/perfil')
  revalidatePath('/profesionales')
  revalidatePath(`/profesionales/${user.id}`)
  redirect('/panel/perfil?message=Perfil guardado')
}

export async function toggleProfileVisibility(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const hidden = formData.get('hidden') === 'true'

  const { error } = await supabase
    .from('professional_profiles')
    .update({ hidden })
    .eq('user_id', user.id)

  if (error) {
    redirect(`/panel/perfil?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/panel')
  revalidatePath('/panel/perfil')
  revalidatePath('/profesionales')
  revalidatePath(`/profesionales/${user.id}`)
  redirect(
    `/panel/perfil?message=${encodeURIComponent(
      hidden ? 'Perfil oculto: ya no aparece en el directorio' : 'Perfil publicado de nuevo'
    )}`
  )
}
