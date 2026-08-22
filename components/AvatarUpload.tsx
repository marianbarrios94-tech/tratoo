'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { saveAvatarUrl } from '@/lib/avatar'

const MAX_AVATAR_BYTES = 3 * 1024 * 1024

export function AvatarUpload({
  avatarUrl: initialAvatarUrl,
  name,
}: {
  avatarUrl: string | null
  name: string
}) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('La foto de perfil debe ser una imagen')
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError('La foto de perfil no puede superar los 3MB')
      return
    }

    setUploading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Iniciá sesión de nuevo para subir una foto')
      setUploading(false)
      return
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${user.id}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { contentType: file.type })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(path)

    const saveError = await saveAvatarUrl(publicUrl)
    if (saveError) {
      setError(saveError)
      setUploading(false)
      return
    }

    setAvatarUrl(publicUrl)
    setUploading(false)
  }

  return (
    <div>
      <label className="block text-sm font-medium">Foto de perfil</label>
      <div className="mt-1 flex items-center gap-4">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL externa de Supabase Storage
          <img src={avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 text-lg font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {initial}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={handleChange}
          className="text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 disabled:opacity-50 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-300"
        />
      </div>
      {uploading && <p className="mt-1 text-xs text-zinc-500">Subiendo...</p>}
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
      {!uploading && !error && (
        <p className="mt-1 text-xs text-zinc-500">
          JPG o PNG, hasta 3MB. Se guarda automáticamente al elegirla.
        </p>
      )}
    </div>
  )
}
