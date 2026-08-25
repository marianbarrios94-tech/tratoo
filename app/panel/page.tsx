import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function PanelPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: professionalProfile }, { count: pendingCount }] =
    await Promise.all([
      user
        ? supabase.from('profiles').select('full_name').eq('id', user.id).single()
        : Promise.resolve({ data: null }),
      user
        ? supabase
            .from('professional_profiles')
            .select('business_name, subscription_status, subscription_plan_id')
            .eq('user_id', user.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      user
        ? supabase
            .from('service_requests')
            .select('id', { count: 'exact', head: true })
            .eq('professional_id', user.id)
            .eq('status', 'pending')
        : Promise.resolve({ count: 0 }),
    ])

  const profileComplete = Boolean(professionalProfile?.business_name)

  const { data: currentPlan } = professionalProfile?.subscription_plan_id
    ? await supabase
        .from('subscription_plans')
        .select('name')
        .eq('id', professionalProfile.subscription_plan_id)
        .maybeSingle()
    : { data: null }

  const STATUS_LABEL: Record<string, string> = {
    trialing: 'en prueba',
    active: 'activa',
    past_due: 'con pago pendiente',
    canceled: 'cancelada',
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Hola{profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
        <p className="mt-1 text-zinc-500">Este es tu espacio como profesional en Tratoo.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/panel/perfil"
          className="rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h2 className="font-medium">Tu perfil</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {profileComplete
              ? 'Tu perfil está publicado en el directorio. Editalo acá.'
              : 'Completá tu perfil para aparecer en el directorio.'}
          </p>
        </Link>
        <Link
          href="/panel/solicitudes"
          className={
            pendingCount
              ? 'rounded-2xl border border-amber-300 bg-amber-50 p-6 transition-colors hover:border-amber-500 dark:border-amber-800 dark:bg-amber-950'
              : 'rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
          }
        >
          <h2 className={pendingCount ? 'font-semibold text-amber-800 dark:text-amber-300' : 'font-medium'}>
            Tus solicitudes
          </h2>
          <p
            className={
              pendingCount
                ? 'mt-1 text-sm font-medium text-amber-700 dark:text-amber-400'
                : 'mt-1 text-sm text-zinc-500'
            }
          >
            {pendingCount
              ? `Tenés ${pendingCount} solicitud${pendingCount === 1 ? '' : 'es'} pendiente${pendingCount === 1 ? '' : 's'}.`
              : 'Todavía no recibiste solicitudes.'}
          </p>
        </Link>
        <Link
          href="/panel/suscripcion"
          className="rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h2 className="font-medium">Tu suscripción</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {currentPlan
              ? `Plan ${currentPlan.name}, ${STATUS_LABEL[professionalProfile!.subscription_status]}.`
              : 'Estás en el plan gratuito. Pasate a un plan pago para más visibilidad.'}
          </p>
        </Link>
        <Link
          href="/panel/estadisticas"
          className="rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h2 className="font-medium">Estadísticas</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Vistas, contactos de WhatsApp y solicitudes que generó tu perfil.
          </p>
        </Link>
        <Link
          href="/cuenta"
          className="rounded-2xl border border-blue-200 bg-blue-50 p-6 transition-colors hover:border-blue-400 dark:border-blue-900 dark:bg-blue-950 dark:hover:border-blue-700"
        >
          <h2 className="font-medium text-blue-700 dark:text-blue-300">Cambiar a cuenta cliente</h2>
          <p className="mt-1 text-sm text-blue-700/80 dark:text-blue-400">
            Buscá profesionales y seguí tus propias solicitudes.
          </p>
        </Link>
      </div>
    </div>
  )
}
