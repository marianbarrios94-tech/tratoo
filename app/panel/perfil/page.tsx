import { createClient } from '@/lib/supabase/server'
import { VERTICALS } from '@/lib/constants/categories'
import { saveProfessionalProfile } from './actions'

export default async function PerfilProfesionalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: contact }, { data: categories }] = await Promise.all([
    user
      ? supabase.from('professional_profiles').select('*').eq('user_id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase.from('professional_contacts').select('phone').eq('user_id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from('categories').select('id, slug, name, vertical').order('name'),
  ])

  const categoriesByVertical = new Map(VERTICALS.map((v) => [v.slug, [] as typeof categories]))
  for (const category of categories ?? []) {
    categoriesByVertical.get(category.vertical)?.push(category)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Tu perfil profesional</h1>
        <p className="mt-1 text-zinc-500">
          Completalo para aparecer en el directorio público de Zolvi.
        </p>
      </div>

      {message && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
      )}
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <form action={saveProfessionalProfile} className="flex max-w-lg flex-col gap-4">
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium">
            Nombre o marca
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            required
            defaultValue={profile?.business_name ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label htmlFor="category_id" className="block text-sm font-medium">
            Categoría
          </label>
          <select
            id="category_id"
            name="category_id"
            required
            defaultValue={profile?.category_id ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="" disabled>
              Elegí una categoría
            </option>
            {VERTICALS.map((v) => (
              <optgroup key={v.slug} label={v.label}>
                {categoriesByVertical.get(v.slug)?.map((c) => (
                  <option key={c!.id} value={c!.id}>
                    {c!.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
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

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Teléfono (WhatsApp)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+54 9 11 1234-5678"
            defaultValue={contact?.phone ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Incluí el código de país. Solo lo ven los clientes cuya solicitud aceptaste.
          </p>
        </div>

        <div>
          <label htmlFor="years_experience" className="block text-sm font-medium">
            Años de experiencia
          </label>
          <input
            id="years_experience"
            name="years_experience"
            type="number"
            min={0}
            defaultValue={profile?.years_experience ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium">
            Sobre vos
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={profile?.bio ?? ''}
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
