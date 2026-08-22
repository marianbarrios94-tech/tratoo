import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createMultipleServiceRequests } from './actions'
import { BackButton } from '@/components/BackButton'

export default async function SolicitarMultiplePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string; error?: string }>
}) {
  const { ids: idsParam, error } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?message=${encodeURIComponent('Iniciá sesión para solicitar un servicio')}`)
  }

  const ids = [...new Set((idsParam ?? '').split(',').filter(Boolean))].filter(
    (id) => id !== user.id
  )

  if (ids.length === 0) {
    redirect('/profesionales')
  }

  const { data: professionals } = await supabase
    .from('professional_profiles')
    .select('user_id, business_name')
    .in('user_id', ids)
    .not('business_name', 'is', null)

  if (!professionals || professionals.length === 0) {
    redirect('/profesionales')
  }

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <BackButton fallbackHref="/profesionales" />
      <h1 className="mt-4 text-2xl font-semibold">Pedir presupuesto a varios profesionales</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Le mandamos el mismo pedido a cada uno. Vas a poder comparar sus respuestas en{' '}
        <Link href="/cuenta/solicitudes" className="underline">
          Tus solicitudes
        </Link>
        .
      </p>

      <ul className="mt-4 flex flex-col gap-1">
        {professionals.map((p) => (
          <li key={p.user_id} className="text-sm text-zinc-700 dark:text-zinc-300">
            · {p.business_name}
          </li>
        ))}
      </ul>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form action={createMultipleServiceRequests} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="professional_ids" value={professionals.map((p) => p.user_id).join(',')} />

        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Contanos qué necesitás
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          className="mt-2 self-start rounded-full bg-zinc-950 px-5 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Enviar a {professionals.length} profesional{professionals.length === 1 ? '' : 'es'}
        </button>
      </form>
    </div>
  )
}
