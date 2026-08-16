import { createClient } from '@/lib/supabase/server'
import { hasActiveSubscription, FREE_TIER_MONTHLY_REQUEST_LIMIT } from '@/lib/constants/subscriptions'
import { formatPrice } from '@/lib/currency'
import { startCheckout, cancelSubscription } from './actions'

const STATUS_LABEL: Record<string, string> = {
  trialing: 'En prueba',
  active: 'Activa',
  past_due: 'Pago pendiente',
  canceled: 'Cancelada',
}

export default async function SuscripcionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; checkout?: string; message?: string }>
}) {
  const { error, checkout, message } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: professional }, { data: plans }] = await Promise.all([
    user
      ? supabase
          .from('professional_profiles')
          .select('subscription_plan_id, subscription_status, mp_preapproval_id')
          .eq('user_id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from('subscription_plans').select('*').order('price_monthly'),
  ])

  const isSubscribed = hasActiveSubscription(professional?.subscription_status)

  // El plan Básico se retiró de la oferta a nuevos suscriptores: queda
  // redundante frente al tier gratuito. Se sigue mostrando solo si es el
  // plan que ya tiene contratado un profesional existente.
  const visiblePlans = (plans ?? []).filter(
    (plan) => plan.slug !== 'basico' || plan.id === professional?.subscription_plan_id
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Tu suscripción</h1>
        <p className="mt-1 text-zinc-500">
          Tu perfil ya es visible en el directorio gratis, con contacto de hasta{' '}
          {FREE_TIER_MONTHLY_REQUEST_LIMIT} clientes nuevos por mes. Pasate a un plan
          pago para clientes ilimitados, insignia de verificado y prioridad en
          resultados.
        </p>
      </div>

      {checkout === 'success' && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          ¡Listo! Puede tardar unos segundos en reflejarse el pago.
        </p>
      )}
      {message && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
      )}
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {professional?.subscription_status && (
        <p className="text-sm text-zinc-500">
          Estado actual: <span className="font-medium">{STATUS_LABEL[professional.subscription_status]}</span>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {visiblePlans.map((plan) => {
          const isCurrent = plan.id === professional?.subscription_plan_id && isSubscribed
          return (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 ${
                isCurrent
                  ? 'border-zinc-950 dark:border-white'
                  : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <h2 className="font-semibold">{plan.name}</h2>
              <p className="mt-2 text-2xl font-semibold">
                {formatPrice(plan.price_monthly, plan.currency)}
                <span className="text-sm font-normal text-zinc-500">/mes</span>
              </p>
              <ul className="mt-4 flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                {plan.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>

              {isCurrent ? (
                <span className="mt-4 inline-block rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                  Tu plan actual
                </span>
              ) : (
                <form action={startCheckout} className="mt-4">
                  <input type="hidden" name="plan_id" value={plan.id} />
                  <button
                    type="submit"
                    className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                    Suscribirme
                  </button>
                </form>
              )}
            </div>
          )
        })}
      </div>

      {professional?.mp_preapproval_id && isSubscribed && (
        <form action={cancelSubscription}>
          <button
            type="submit"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Cancelar suscripción
          </button>
        </form>
      )}
    </div>
  )
}
