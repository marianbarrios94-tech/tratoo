import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceRequest } from './actions'
import { BackButton } from '@/components/BackButton'

export default async function SolicitarPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?message=${encodeURIComponent('Iniciá sesión para solicitar un servicio')}`)
  }

  if (user.id === id) {
    redirect(`/profesionales/${id}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'professional') {
    redirect(`/profesionales/${id}`)
  }

  const { data: professional } = await supabase
    .from('professional_profiles')
    .select('business_name, category_id')
    .eq('user_id', id)
    .not('business_name', 'is', null)
    .maybeSingle()

  if (!professional) {
    redirect('/profesionales')
  }

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <BackButton fallbackHref={`/profesionales/${id}`} />
      <h1 className="mt-4 text-2xl font-semibold">Solicitar a {professional.business_name}</h1>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form action={createServiceRequest} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="professional_id" value={id} />
        <input type="hidden" name="category_id" value={professional.category_id ?? ''} />

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

        <div>
          <label htmlFor="scheduled_at" className="block text-sm font-medium">
            Fecha y hora preferida (opcional)
          </label>
          <input
            id="scheduled_at"
            name="scheduled_at"
            type="datetime-local"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          className="mt-2 self-start rounded-full bg-zinc-950 px-5 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Enviar solicitud
        </button>
      </form>
    </div>
  )
}
