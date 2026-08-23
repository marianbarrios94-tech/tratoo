'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { starString } from '@/lib/rating'

type ProfessionalCard = {
  user_id: string
  business_name: string | null
  verified: boolean
  city: string | null
  province: string | null
  avg_rating: number
  categoryLabel: string | null
  avatarUrl: string | null
}

export function ProfessionalDirectoryGrid({
  professionals,
}: {
  professionals: ProfessionalCard[]
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const router = useRouter()

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (professionals.length === 0) {
    return <p className="text-zinc-500">No encontramos profesionales con esos filtros.</p>
  }

  return (
    <>
      <div className="mt-8 grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {professionals.map((p) => (
          <div
            key={p.user_id}
            className={`relative rounded-2xl border p-6 transition-colors ${
              selected.has(p.user_id)
                ? 'border-zinc-950 dark:border-white'
                : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
            }`}
          >
            <label className="absolute right-4 top-4 z-10 flex items-center gap-1 text-xs text-zinc-500">
              <input
                type="checkbox"
                checked={selected.has(p.user_id)}
                onChange={() => toggle(p.user_id)}
              />
              Seleccionar para pedir a varios
            </label>
            <Link href={`/profesionales/${p.user_id}`} className="flex gap-3 pr-16">
              {p.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- URL externa de Supabase Storage
                <img
                  src={p.avatarUrl}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {(p.business_name ?? '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold">{p.business_name}</h2>
                  {p.verified && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      Verificado
                    </span>
                  )}
                </div>
                {p.categoryLabel && (
                  <p className="mt-1 text-sm text-zinc-500">{p.categoryLabel}</p>
                )}
                {(p.city || p.province) && (
                  <p className="text-sm text-zinc-500">
                    {[p.city, p.province].filter(Boolean).join(', ')}
                  </p>
                )}
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {starString(Number(p.avg_rating))} {Number(p.avg_rating).toFixed(1)}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {selected.size} profesional{selected.size === 1 ? '' : 'es'} seleccionado
              {selected.size === 1 ? '' : 's'}
            </p>
            <button
              type="button"
              onClick={() =>
                router.push(`/profesionales/solicitar-multiple?ids=${[...selected].join(',')}`)
              }
              className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Enviar solicitud a los seleccionados
            </button>
          </div>
        </div>
      )}
    </>
  )
}
