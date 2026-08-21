export function AvatarUpload({ avatarUrl, name }: { avatarUrl: string | null; name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'

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
          name="avatar"
          accept="image/*"
          className="text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-300"
        />
      </div>
      <p className="mt-1 text-xs text-zinc-500">JPG o PNG, hasta 3MB.</p>
    </div>
  )
}
