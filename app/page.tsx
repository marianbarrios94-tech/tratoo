import Link from 'next/link'
import { VERTICALS, CATEGORIES_BY_VERTICAL } from '@/lib/constants/categories'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/(auth)/actions'

const PLANS = [
  {
    slug: 'basico',
    name: 'Básico',
    price: 9.99,
    features: ['Perfil en el directorio', 'Hasta 5 solicitudes por mes'],
  },
  {
    slug: 'pro',
    name: 'Pro',
    price: 19.99,
    features: ['Solicitudes ilimitadas', 'Insignia de verificado', 'Estadísticas básicas'],
    highlighted: true,
  },
  {
    slug: 'premium',
    name: 'Premium',
    price: 34.99,
    features: [
      'Todo lo de Pro',
      'Prioridad en resultados de búsqueda',
      'Soporte prioritario',
    ],
  },
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    : { data: null }

  const dashboardHref =
    profile?.role === 'professional' || profile?.role === 'admin' ? '/panel' : '/cuenta'

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-xl font-semibold tracking-tight">Zolvi</span>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/profesionales"
            className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          >
            Ver profesionales
          </Link>
          {user ? (
            <>
              <Link
                href={dashboardHref}
                className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                Mi cuenta
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full bg-zinc-950 px-4 py-2 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-zinc-950 px-4 py-2 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Registrarme
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <section className="flex flex-col items-center gap-6 py-20 text-center">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Encontrá al profesional que resuelve
          </h1>
          <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            Zolvi conecta clientes con profesionales verificados de hogar, consultoría y salud,
            en un solo lugar.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {user ? (
              <Link
                href={dashboardHref}
                className="rounded-full bg-zinc-950 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Ir a mi cuenta
              </Link>
            ) : (
              <>
                <Link
                  href="/registro?role=client"
                  className="rounded-full bg-zinc-950 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Buscar un profesional
                </Link>
                <Link
                  href="/registro?role=professional"
                  className="rounded-full border border-zinc-300 px-6 py-3 font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  Ofrecer mis servicios
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="grid gap-6 pb-20 sm:grid-cols-3">
          {VERTICALS.map((v) => (
            <div
              key={v.slug}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h2 className="text-lg font-semibold">{v.label}</h2>
              <p className="mt-1 text-sm text-zinc-500">{v.tagline}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {CATEGORIES_BY_VERTICAL[v.slug].map((c) => (
                  <li
                    key={c}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="pb-24">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold">Planes para profesionales</h2>
            <p className="mt-1 text-zinc-500">
              Suscribite para aparecer en el directorio y recibir solicitudes de clientes.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.slug}
                className={`rounded-2xl border p-6 ${
                  plan.highlighted
                    ? 'border-zinc-950 dark:border-white'
                    : 'border-zinc-200 dark:border-zinc-800'
                } bg-white dark:bg-zinc-950`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-2 text-3xl font-semibold">
                  ${plan.price}
                  <span className="text-base font-normal text-zinc-500">/mes</span>
                </p>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {plan.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
        © {new Date().getFullYear()} Zolvi
      </footer>
    </div>
  )
}
