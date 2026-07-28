import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { starString } from '@/lib/rating'

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

  const [{ data: category }, { data: profile }, { data: viewerProfile }] = await Promise.all([
    professional.category_id
      ? supabase
          .from('categories')
          .select('name, vertical')
          .eq('id', professional.category_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from('profiles').select('full_name').eq('id', id).maybeSingle(),
    user
      ? supabase.from('profiles').select('role').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
  ])

  const isOwnProfile = user?.id === id
  const canRequest = Boolean(user) && !isOwnProfile && viewerProfile?.role !== 'professional'

  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating, comment, created_at')
    .eq('professional_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <Link href="/profesionales" className="text-sm text-zinc-500 hover:underline">
        ← Volver al directorio
      </Link>

      <div className="mt-4 flex items-start justify-between gap-2">
        <h1 className="text-2xl font-semibold">{professional.business_name}</h1>
        {professional.verified && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            Verificado
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-zinc-500">
        {category && <span>{category.name}</span>}
        {professional.city && <span>{professional.city}</span>}
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

      {professional.bio && (
        <p className="mt-6 whitespace-pre-line text-zinc-700 dark:text-zinc-300">
          {professional.bio}
        </p>
      )}

      {isOwnProfile ? (
        <p className="mt-8 text-sm text-zinc-500">Este es tu perfil público.</p>
      ) : viewerProfile?.role === 'professional' ? (
        <p className="mt-8 text-sm text-zinc-500">
          Los profesionales no pueden solicitar servicios a otros profesionales.
        </p>
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
