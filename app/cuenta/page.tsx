import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function CuentaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const profile = user
    ? (await supabase.from('profiles').select('full_name').eq('id', user.id).single()).data
    : null

  let pendingReviewCount = 0
  if (user) {
    const { data: acceptedRequests } = await supabase
      .from('service_requests')
      .select('id')
      .eq('client_id', user.id)
      .eq('status', 'accepted')
    const acceptedIds = (acceptedRequests ?? []).map((r) => r.id)
    const { data: reviewedRows } = acceptedIds.length
      ? await supabase.from('reviews').select('request_id').in('request_id', acceptedIds)
      : { data: [] }
    const reviewedSet = new Set((reviewedRows ?? []).map((r) => r.request_id))
    pendingReviewCount = acceptedIds.filter((id) => !reviewedSet.has(id)).length
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Hola{profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
        <p className="mt-1 text-zinc-500">Este es tu espacio como cliente en Tratoo.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/cuenta/perfil"
          className="rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h2 className="font-medium">Tu perfil</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Editá tu nombre, teléfono y ciudad.
          </p>
        </Link>
        <Link
          href="/profesionales"
          className="rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h2 className="font-medium">Buscar profesionales</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Explorá el directorio por rubro, categoría y ciudad.
          </p>
        </Link>
        <Link
          href="/cuenta/solicitudes"
          className={
            pendingReviewCount
              ? 'rounded-2xl border border-amber-300 bg-amber-50 p-6 transition-colors hover:border-amber-500 dark:border-amber-800 dark:bg-amber-950'
              : 'rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
          }
        >
          <h2 className={pendingReviewCount ? 'font-semibold text-amber-800 dark:text-amber-300' : 'font-medium'}>
            Tus solicitudes
          </h2>
          <p
            className={
              pendingReviewCount
                ? 'mt-1 text-sm font-medium text-amber-700 dark:text-amber-400'
                : 'mt-1 text-sm text-zinc-500'
            }
          >
            {pendingReviewCount
              ? `Tenés ${pendingReviewCount} solicitud${pendingReviewCount === 1 ? '' : 'es'} para dejar reseña.`
              : 'Seguí el estado de tus pedidos de servicio.'}
          </p>
        </Link>
        <Link
          href="/panel"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 transition-colors hover:border-emerald-400 dark:border-emerald-900 dark:bg-emerald-950 dark:hover:border-emerald-700"
        >
          <h2 className="font-medium text-emerald-700 dark:text-emerald-300">
            Cambiar a cuenta profesional
          </h2>
          <p className="mt-1 text-sm text-emerald-700/80 dark:text-emerald-400">
            Completá tu perfil profesional y elegí un plan.
          </p>
        </Link>
      </div>
    </div>
  )
}
