import { createClient } from '@/lib/supabase/server'
import { acceptRequest, rejectRequest, completeRequest } from '@/app/solicitudes/actions'
import { REQUEST_STATUS_LABEL } from '@/lib/constants/requests'

export default async function PanelSolicitudesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: requests } = user
    ? await supabase
        .from('service_requests')
        .select('*')
        .eq('professional_id', user.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const clientIds = [...new Set((requests ?? []).map((r) => r.client_id))]
  const categoryIds = [
    ...new Set((requests ?? []).map((r) => r.category_id).filter((v): v is string => Boolean(v))),
  ]

  const [{ data: clients }, { data: categories }] = await Promise.all([
    clientIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', clientIds)
      : Promise.resolve({ data: [] }),
    categoryIds.length
      ? supabase.from('categories').select('id, name').in('id', categoryIds)
      : Promise.resolve({ data: [] }),
  ])

  const clientById = new Map((clients ?? []).map((c) => [c.id, c]))
  const categoryById = new Map((categories ?? []).map((c) => [c.id, c]))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Tus solicitudes</h1>
        <p className="mt-1 text-zinc-500">Solicitudes de clientes recibidas en Tratoo.</p>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {(requests ?? []).length === 0 && (
        <p className="text-zinc-500">Todavía no recibiste solicitudes.</p>
      )}

      <div className="flex flex-col gap-4">
        {(requests ?? []).map((r) => {
          const client = clientById.get(r.client_id)
          const category = r.category_id ? categoryById.get(r.category_id) : null
          return (
            <div
              key={r.id}
              className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-medium">{client?.full_name ?? 'Cliente'}</h2>
                  {category && <p className="text-sm text-zinc-500">{category.name}</p>}
                </div>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                  {REQUEST_STATUS_LABEL[r.status]}
                </span>
              </div>
              {r.message && (
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{r.message}</p>
              )}
              {r.scheduled_at && (
                <p className="mt-1 text-sm text-zinc-500">
                  {new Date(r.scheduled_at).toLocaleString('es-AR')}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                {r.status === 'pending' && (
                  <>
                    <form action={acceptRequest} className="flex items-center gap-2">
                      <input type="hidden" name="request_id" value={r.id} />
                      <input type="hidden" name="redirect_to" value="/panel/solicitudes" />
                      <input
                        type="number"
                        name="quoted_price"
                        min={0}
                        step="0.01"
                        placeholder="Presupuesto (opcional)"
                        className="w-40 rounded-md border border-zinc-300 px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      />
                      <button
                        type="submit"
                        className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                      >
                        Aceptar
                      </button>
                    </form>
                    <form action={rejectRequest}>
                      <input type="hidden" name="request_id" value={r.id} />
                      <input type="hidden" name="redirect_to" value="/panel/solicitudes" />
                      <button
                        type="submit"
                        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                      >
                        Rechazar
                      </button>
                    </form>
                  </>
                )}
                {r.status === 'accepted' && (
                  <form action={completeRequest}>
                    <input type="hidden" name="request_id" value={r.id} />
                    <input type="hidden" name="redirect_to" value="/panel/solicitudes" />
                    <button
                      type="submit"
                      className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                      Marcar completada
                    </button>
                  </form>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
