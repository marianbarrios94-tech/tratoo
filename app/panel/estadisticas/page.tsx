import { createClient } from '@/lib/supabase/server'
import { hasActiveSubscription, FREE_TIER_MONTHLY_REQUEST_LIMIT } from '@/lib/constants/subscriptions'
import { startOfCurrentMonthISO } from '@/lib/date'
import { getMonthlyClientIds } from '@/lib/freeTier'
import Link from 'next/link'

async function countEvents(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  eventType: 'view' | 'whatsapp_click'
) {
  const { count } = await supabase
    .from('profile_events')
    .select('id', { count: 'exact', head: true })
    .eq('professional_id', userId)
    .eq('event_type', eventType)
    .gte('created_at', startOfCurrentMonthISO())
  return count ?? 0
}

export default async function EstadisticasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const [{ data: professional }, views, whatsappClicks, clientIds] = await Promise.all([
    supabase
      .from('professional_profiles')
      .select('subscription_status')
      .eq('user_id', user.id)
      .maybeSingle(),
    countEvents(supabase, user.id, 'view'),
    countEvents(supabase, user.id, 'whatsapp_click'),
    getMonthlyClientIds(supabase, user.id),
  ])

  const requests = clientIds.length
  const distinctClients = new Set(clientIds).size
  const isSubscribed = hasActiveSubscription(professional?.subscription_status)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Estadísticas</h1>
        <p className="mt-1 text-zinc-500">Lo que generó tu perfil este mes.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <p className="text-3xl font-semibold">{views}</p>
          <p className="mt-1 text-sm text-zinc-500">Vistas de tu perfil</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <p className="text-3xl font-semibold">{whatsappClicks}</p>
          <p className="mt-1 text-sm text-zinc-500">Contactos por WhatsApp</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <p className="text-3xl font-semibold">{requests}</p>
          <p className="mt-1 text-sm text-zinc-500">Solicitudes recibidas</p>
        </div>
      </div>

      {!isSubscribed && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Estás en el plan gratuito: usaste{' '}
            {Math.min(distinctClients, FREE_TIER_MONTHLY_REQUEST_LIMIT)} de{' '}
            {FREE_TIER_MONTHLY_REQUEST_LIMIT} cupos de clientes gratis este mes. Si un mismo
            cliente te escribe varias veces, solo cuenta una vez.
          </p>
          {distinctClients >= FREE_TIER_MONTHLY_REQUEST_LIMIT && (
            <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-400">
              Llegaste al límite — los clientes nuevos no van a poder contactarte hasta
              el mes que viene, salvo que pases a un plan pago.
            </p>
          )}
          <Link
            href="/panel/suscripcion"
            className="mt-4 inline-block rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Ver planes pagos
          </Link>
        </div>
      )}
    </div>
  )
}
