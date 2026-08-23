import { createClient } from '@/lib/supabase/server'
import { AvatarUpload } from '@/components/AvatarUpload'
import { saveClientProfile } from './actions'

export default async function PerfilClientePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('full_name, phone, city, avatar_url')
        .eq('id', user.id)
        .maybeSingle()
    : { data: null }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Tu perfil</h1>
        <p className="mt-1 text-zinc-500">Mantené tus datos de contacto al día.</p>
      </div>

      {message && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
      )}
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="max-w-lg">
        <AvatarUpload avatarUrl={profile?.avatar_url ?? null} name={profile?.full_name ?? ''} />
      </div>

      <form action={saveClientProfile} className="flex max-w-lg flex-col gap-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium">
            Nombre completo
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            defaultValue={profile?.full_name ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={profile?.phone ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium">
            Ciudad
          </label>
          <input
            id="city"
            name="city"
            type="text"
            defaultValue={profile?.city ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          className="mt-2 self-start rounded-full bg-zinc-950 px-5 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Guardar perfil
        </button>
      </form>
    </div>
  )
}
