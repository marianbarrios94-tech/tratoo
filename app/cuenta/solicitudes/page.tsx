import { createClient } from '@/lib/supabase/server'
import { cancelRequest, leaveReview } from '@/app/solicitudes/actions'
import { REQUEST_STATUS_LABEL } from '@/lib/constants/requests'
import { starString } from '@/lib/rating'
import { whatsAppLink } from '@/lib/whatsapp'
import { WhatsAppContactLink } from '@/components/WhatsAppContactLink'

export default async function CuentaSolicitudesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: requests } = user
    ? await supabase
        .from('service_requests')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const professionalIds = [...new Set((requests ?? []).map((r) => r.professional_id))]
  const categoryIds = [
    ...new Set((requests ?? []).map((r) => r.category_id).filter((v): v is string => Boolean(v))),
  ]

  const [{ data: professionals }, { data: categories }, { data: contacts }] = await Promise.all([
    professionalIds.length
      ? supabase
          .from('professional_profiles')
          .select('user_id, business_name')
          .in('user_id', professionalIds)
      : Promise.resolve({ data: [] }),
    categoryIds.length
      ? supabase.from('categories').select('id, name').in('id', categoryIds)
      : Promise.resolve({ data: [] }),
    professionalIds.length
      ? supabase.from('professional_contacts').select('user_id, phone').in('user_id', professionalIds)
      : Promise.resolve({ data: [] }),
  ])

  const professionalById = new Map((professionals ?? []).map((p) => [p.user_id, p]))
  const categoryById = new Map((categories ?? []).map((c) => [c.id, c]))
  const phoneByProfessionalId = new Map((contacts ?? []).map((c) => [c.user_id, c.phone]))

  const completedIds = (requests ?? [])
    .filter((r) => r.status === 'completed')
    .map((r) => r.id)

  const { data: reviews } = completedIds.length
    ? await supabase.from('reviews').select('*').in('request_id', completedIds)
    : { data: [] }

  const reviewByRequestId = new Map((reviews ?? []).map((rv) => [rv.request_id, rv]))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Tus solicitudes</h1>
        <p className="mt-1 text-zinc-500">Seguimiento de los servicios que solicitaste.</p>
      </div>

      {message && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
      )}
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {(requests ?? []).length === 0 && (
        <p className="text-zinc-500">Todavía no hiciste ninguna solicitud.</p>
      )}

      <div className="flex flex-col gap-4">
        {(requests ?? []).map((r) => {
          const professional = professionalById.get(r.professional_id)
          const category = r.category_id ? categoryById.get(r.category_id) : null
          return (
            <div
              key={r.id}
              className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-medium">{professional?.business_name ?? 'Profesional'}</h2>
                  {category && <p className="text-sm text-zinc-500">{category.name}</p>}
                </div>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                  {REQUEST_STATUS_LABEL[r.status]}
                </span>
              </div>
              {r.message && (
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{r.message}</p>
              )}
              {(r.status === 'accepted' || r.status === 'completed') &&
                (() => {
                  const phone = phoneByProfessionalId.get(r.professional_id)
                  if (!phone) return null
                  const context = category ? ` (${category.name})` : ''
                  return (
                    <WhatsAppContactLink
                      professionalId={r.professional_id}
                      href={whatsAppLink(
                        phone,
                        `Hola! Te escribo por mi solicitud en Tratoo${context}.`
                      )}
                    />
                  )
                })()}

              {r.status === 'pending' && (
                <form action={cancelRequest} className="mt-4">
                  <input type="hidden" name="request_id" value={r.id} />
                  <input type="hidden" name="redirect_to" value="/cuenta/solicitudes" />
                  <button
                    type="submit"
                    className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                  >
                    Cancelar
                  </button>
                </form>
              )}

              {r.status === 'completed' &&
                (() => {
                  const review = reviewByRequestId.get(r.id)
                  if (review) {
                    return (
                      <div className="mt-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                        <p className="text-sm">{starString(review.rating)}</p>
                        {review.comment && (
                          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    )
                  }
                  return (
                    <form action={leaveReview} className="mt-4 flex flex-col gap-2">
                      <input type="hidden" name="request_id" value={r.id} />
                      <fieldset className="flex gap-3">
                        <legend className="mb-1 text-sm font-medium">Calificá el servicio</legend>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <label key={n} className="flex items-center gap-1 text-sm">
                            <input type="radio" name="rating" value={n} defaultChecked={n === 5} />
                            {n}
                          </label>
                        ))}
                      </fieldset>
                      <textarea
                        name="comment"
                        rows={2}
                        placeholder="Comentario (opcional)"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      />
                      <button
                        type="submit"
                        className="self-start rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                      >
                        Dejar reseña
                      </button>
                    </form>
                  )
                })()}
            </div>
          )
        })}
      </div>
    </div>
  )
}
