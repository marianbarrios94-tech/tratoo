import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { VERTICALS } from '@/lib/constants/categories'
import { PROVINCES } from '@/lib/constants/provinces'
import { hasActiveSubscription } from '@/lib/constants/subscriptions'
import { AvatarUpload } from '@/components/AvatarUpload'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton'
import { ProfileOnboardingWizard } from '@/components/ProfileOnboardingWizard'
import { saveProfessionalProfile, toggleProfileVisibility } from './actions'

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

  const [{ data: profile }, { data: contact }, { data: categories }, { data: baseProfile }] =
    await Promise.all([
      user
        ? supabase.from('professional_profiles').select('*').eq('user_id', user.id).maybeSingle()
        : Promise.resolve({ data: null }),
      user
        ? supabase.from('professional_contacts').select('phone').eq('user_id', user.id).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase.from('categories').select('id, slug, name, vertical').order('name'),
      user
        ? supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).maybeSingle()
        : Promise.resolve({ data: null }),
    ])

  const categoriesByVertical = new Map(VERTICALS.map((v) => [v.slug, [] as typeof categories]))
  for (const category of categories ?? []) {
    categoriesByVertical.get(category.vertical)?.push(category)
  }

  const isOnboarded = Boolean(
    profile?.business_name &&
      (profile?.category_id || profile?.custom_profession) &&
      profile?.province &&
      contact?.phone
  )

  const completenessFields: [boolean, string][] = [
    [Boolean(profile?.business_name), 'el nombre o marca'],
    [Boolean(profile?.category_id || profile?.custom_profession), 'la categoría'],
    [Boolean(profile?.province), 'la provincia'],
    [Boolean(profile?.city), 'la ciudad'],
    [Boolean(contact?.phone), 'el teléfono'],
    [Boolean(profile?.years_experience), 'los años de experiencia'],
    [Boolean(profile?.bio), 'una descripción'],
    [Boolean(baseProfile?.avatar_url), 'una foto de perfil'],
  ]
  const completenessCount = completenessFields.filter(([done]) => done).length
  const completenessPercent = Math.round((completenessCount / completenessFields.length) * 100)
  const missingFields = completenessFields.filter(([done]) => !done).map(([, label]) => label)

  return (
    <div className="flex flex-col gap-8">
      <ScrollToTop when={message ?? error} />
      <div>
        <h1 className="text-2xl font-semibold">Tu perfil profesional</h1>
        <p className="mt-1 text-zinc-500">
          Completalo para aparecer en el directorio público de Tratoo.
        </p>
        {profile?.business_name && user && (
          <Link
            href={`/profesionales/${user.id}`}
            className="mt-2 inline-block text-sm font-medium text-emerald-600 underline hover:text-emerald-700 dark:text-emerald-400"
          >
            Ver tu perfil público y tus reseñas →
          </Link>
        )}
      </div>

      {isOnboarded && completenessPercent < 100 && (
        <div className="max-w-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Tu perfil está {completenessPercent}% completo</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${completenessPercent}%` }}
            />
          </div>
          {missingFields.length > 0 && (
            <p className="mt-1.5 text-sm text-zinc-500">
              Agregá {missingFields.slice(0, 2).join(' y ')}
              {missingFields.length > 2 ? ', entre otras cosas,' : ''} para mejorar tu perfil.
            </p>
          )}
        </div>
      )}

      {message && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
      )}
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {!isOnboarded && (
        <ProfileOnboardingWizard
          action={saveProfessionalProfile}
          verticals={VERTICALS}
          categoriesByVertical={categoriesByVertical as Map<string, NonNullable<typeof categories>>}
          provinces={PROVINCES}
          defaults={{
            businessName: profile?.business_name ?? '',
            categoryId: profile?.category_id ?? '',
            customProfession: profile?.custom_profession ?? '',
            city: profile?.city ?? '',
            province: profile?.province ?? '',
            phone: contact?.phone ?? '',
          }}
        />
      )}

      {isOnboarded && (
      <div className="max-w-lg">
        <AvatarUpload
          avatarUrl={baseProfile?.avatar_url ?? null}
          name={profile?.business_name || baseProfile?.full_name || ''}
        />
      </div>
      )}

      {isOnboarded && (
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
            defaultValue={profile?.category_id ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">Ninguna de estas</option>
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
          <label htmlFor="custom_profession" className="block text-sm font-medium">
            ¿Tu profesión no está en la lista?
          </label>
          <input
            id="custom_profession"
            name="custom_profession"
            type="text"
            placeholder="Ej: Profesor de inglés"
            defaultValue={profile?.custom_profession ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Escribila acá y aparece tal cual en tu perfil. Necesitás elegir una categoría o
            completar esto.
          </p>
        </div>

        <div>
          <label htmlFor="license_number" className="block text-sm font-medium">
            Matrícula o credencial (opcional)
          </label>
          <input
            id="license_number"
            name="license_number"
            type="text"
            placeholder="Ej: Matrícula N° 12345"
            defaultValue={profile?.license_number ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Si tenés una matrícula profesional o habilitación, mostrala en tu perfil para generar
            más confianza.
          </p>
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
          <label htmlFor="province" className="block text-sm font-medium">
            Provincia
          </label>
          <select
            id="province"
            name="province"
            required
            defaultValue={profile?.province ?? ''}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="" disabled>
              Elegí tu provincia
            </option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
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
      )}

      {profile?.business_name && (
        <form action={toggleProfileVisibility} className="max-w-lg border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <input type="hidden" name="hidden" value={profile.hidden ? 'false' : 'true'} />
          <ConfirmSubmitButton
            confirmMessage={
              profile.hidden
                ? '¿Volver a publicar tu perfil? Vas a aparecer de nuevo en el directorio.'
                : `¿Seguro que querés ocultar tu perfil? No vas a aparecer en el directorio, pero podés volver a publicarlo tocando este mismo botón cuando quieras.${
                    hasActiveSubscription(profile.subscription_status)
                      ? ' Tu suscripción paga sigue activa y se te va a seguir cobrando.'
                      : ''
                  }`
            }
            className="text-sm font-medium text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {profile.hidden ? 'Publicar perfil' : 'Ocultar perfil'}
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  )
}
