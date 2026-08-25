import Link from 'next/link'
import { VERTICALS, CATEGORIES_BY_VERTICAL } from '@/lib/constants/categories'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/(auth)/actions'
import { formatPrice } from '@/lib/currency'
import { LogoMark } from '@/components/Logo'
import { InstallPrompt } from '@/components/InstallPrompt'

const PLANS = [
  {
    slug: 'gratis',
    name: 'Gratis',
    price: 0,
    features: [
      'Visible en el directorio',
      'Contacto de hasta 5 clientes nuevos por mes',
      'Sin costo, para siempre',
    ],
    cta: 'Empezar gratis',
  },
  {
    slug: 'pro',
    name: 'Pro',
    price: 15000,
    features: ['Solicitudes ilimitadas', 'Insignia de verificado', 'Estadísticas básicas'],
    highlighted: true,
    cta: 'Suscribirme',
  },
  {
    slug: 'premium',
    name: 'Premium',
    price: 35000,
    features: [
      'Todo lo de Pro',
      'Prioridad en resultados de búsqueda',
      'Soporte prioritario',
    ],
    cta: 'Suscribirme',
  },
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: categories }] = await Promise.all([
    user
      ? supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from('categories').select('slug, name, vertical'),
  ])

  const categorySlugByName = new Map(
    (categories ?? []).map((c) => [`${c.vertical}:${c.name}`, c.slug])
  )

  const dashboardHref =
    profile?.role === 'professional' || profile?.role === 'admin' ? '/panel' : '/cuenta'

  const planHref = user ? '/panel/suscripcion' : '/registro?role=professional'

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <InstallPrompt />
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-y-2 px-6 py-6">
        <span className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <LogoMark />
          Tratoo
        </span>
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
            Tratoo conecta clientes con profesionales verificados de hogar, consultoría y salud,
            en un solo lugar.
          </p>
          <p className="max-w-xl text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Hecho para el NEA: Misiones, Corrientes, Chaco y Formosa.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="rounded-full bg-zinc-950 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Ir a mi cuenta
                </Link>
                {dashboardHref !== '/panel' && (
                  <Link
                    href="/panel"
                    className="rounded-full border border-zinc-300 px-6 py-3 font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                  >
                    Ofrecer mis servicios
                  </Link>
                )}
              </>
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
                {CATEGORIES_BY_VERTICAL[v.slug].map((c) => {
                  const categorySlug = categorySlugByName.get(`${v.slug}:${c}`)
                  return (
                    <li key={c}>
                      <Link
                        href={
                          categorySlug
                            ? `/profesionales?categoria=${categorySlug}`
                            : `/profesionales?vertical=${v.slug}`
                        }
                        className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        {c}
                      </Link>
                    </li>
                  )
                })}
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
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              No hace falta mudarte a Buenos Aires para crecer: sumate desde Posadas, Corrientes,
              Resistencia, Formosa o cualquier ciudad del NEA.
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <Link
                key={plan.slug}
                href={planHref}
                className={`rounded-2xl border p-6 transition-colors hover:border-zinc-400 dark:hover:border-zinc-600 ${
                  plan.highlighted
                    ? 'border-zinc-950 dark:border-white'
                    : 'border-zinc-200 dark:border-zinc-800'
                } bg-white dark:bg-zinc-950`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-2 text-3xl font-semibold">
                  {formatPrice(plan.price, 'ars')}
                  <span className="text-base font-normal text-zinc-500">/mes</span>
                </p>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {plan.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
                <span className="mt-4 inline-block text-sm font-medium underline">
                  {plan.cta}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
        <p>© {new Date().getFullYear()} Tratoo</p>
        <nav className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/terminos" className="hover:text-zinc-950 dark:hover:text-white">
            Términos y condiciones
          </Link>
          <Link href="/privacidad" className="hover:text-zinc-950 dark:hover:text-white">
            Privacidad
          </Link>
          <Link href="/reembolsos" className="hover:text-zinc-950 dark:hover:text-white">
            Reembolsos y cancelación
          </Link>
          <a
            href="mailto:tratoo.contacto@gmail.com"
            className="hover:text-zinc-950 dark:hover:text-white"
          >
            Contacto
          </a>
        </nav>
      </footer>
    </div>
  )
}
