import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

const MAX_AVATAR_BYTES = 3 * 1024 * 1024

/**
 * Uploads the "avatar" file from formData (if present) to the "avatars"
 * storage bucket and saves its public URL on profiles.avatar_url. Returns
 * an error message on failure, or null on success / no file provided.
 */
export async function uploadAvatarIfProvided(
  supabase: SupabaseClient<Database>,
  userId: string,
  formData: FormData
): Promise<string | null> {
  const file = formData.get('avatar')
  if (!(file instanceof File) || file.size === 0) {
    return null
  }

  if (!file.type.startsWith('image/')) {
    return 'La foto de perfil debe ser una imagen'
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return 'La foto de perfil no puede superar los 3MB'
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${userId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { contentType: file.type })

  if (uploadError) {
    return uploadError.message
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(path)

  const { error: dbError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)

  return dbError?.message ?? null
}
