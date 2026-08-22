'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Saves an already-uploaded avatar's public URL on profiles.avatar_url.
 * The upload itself happens client-side (AvatarUpload component), direct to
 * Supabase Storage — sending the file through a Server Action here hits a
 * Next.js 16 proxy bug where multipart bodies on proxy-matched routes cause
 * the session to be lost mid-request. Returns an error message, or null on
 * success.
 */
export async function saveAvatarUrl(url: string): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return 'Iniciá sesión de nuevo para guardar la foto'
  }

  const { error } = await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id)

  return error?.message ?? null
}
