import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { starString } from '@/lib/rating'
import { hasActiveSubscription, FREE_TIER_MONTHLY_REQUEST_LIMIT } from '@/lib/constants/subscriptions'
import { BackButton } from '@/components/BackButton'

export default async function ProfesionalDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: professional } = await supabase
    .from('professional_profiles')
    .select('*')
    .eq('user_id', id)
    .not('business_name', 'is', null)
    .maybeSingle()

  if (!professional) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwnProfile = user?.id === id

  if (!isOwnProfile) {
    // Best-effort: no debe romper el render del perfil si falla.
    await supabase.from('profile_events').insert({ professional_id: id, event_type: 'view' })
  }

  const [{ data: category }, { data: profile }] = await Promise.all([
    professional.category_id
      ? supabase
          .from('categories')
          .select('name, vertical')
          .eq('id', professional.category_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from('profiles').select('full_name').eq('id', id).maybeSingle(),
  ])

  const canRequest = Boolean(user) && !isOwnProfile

  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating, comment, created_at')
    .eq('professional_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <BackButton label="← Volver al directorio" fallbackHref="/profesionales" />

      <div className="mt-4 flex items-start justify-between gap-2">
        <h1 className="text-2xl font-semibold">{professional.business_name}</h1>
        {professional.verified && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            Verificado
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-zinc-500">
        {(category || professional.custom_profession) && (
          <span>{category?.name ?? professional.custom_profession}</span>
        )}
        {(professional.city || professional.province) && (
          <span>{[professional.city, professional.province].filter(Boolean).join(', ')}</span>
        )}
        <span>
          {starString(Number(professional.avg_rating))} {Number(professional.avg_rating).toFixed(1)}
        </span>
        {professional.years_experience != null && (
          <span>{professional.years_experience} años de experiencia</span>
        )}
      </div>

      {profile?.full_name && (
        <p className="mt-1 text-sm text-zinc-500">Atendido por {profile.full_name}</p>
      )}

      {professional.license_number && (
        <p className="mt-1 text-sm text-zinc-500">
          Matrícula: {professional.license_number}
        </p>
      )}

      {professional.bio && (
        <p className="mt-6 whitespace-pre-line text-zinc-700 dark:text-zinc-300">
          {professional.bio}
        </p>
      )}

      {isOwnProfile ? (
        <div className="mt-8">
          <p className="text-sm text-zinc-500">Este es tu perfil público.</p>
          {!hasActiveSubscription(professional.subscription_status) && (
            <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              Estás en el plan gratuito: tu perfil es visible y podés recibir
              contacto de hasta {FREE_TIER_MONTHLY_REQUEST_LIMIT} clientes nuevos por mes
              (un mismo cliente que te escribe varias veces cuenta una sola vez).{' '}
              <Link href="/panel/suscripcion" className="underline">
                Pasate a un plan pago
              </Link>{' '}
              para solicitudes ilimitadas y prioridad en resultados.
            </p>
          )}
        </div>
      ) : (
        <Link
          href={
            canRequest
              ? `/profesionales/${id}/solicitar`
              : '/login?message=Iniciá sesión para solicitar un servicio'
          }
          className="mt-8 inline-block rounded-full bg-zinc-950 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Solicitar
        </Link>
      )}

      <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="font-semibold">Reseñas</h2>
        {(reviews ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">Todavía no tiene reseñas.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {(reviews ?? []).map((r, i) => (
              <li key={i} className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-sm">{starString(r.rating)}</p>
                {r.comment && (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{r.comment}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
