'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function HomeHeroSearch() {
  const [q, setQ] = useState('')
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    router.push(`/profesionales?${params.toString()}`)
  }

  function handleCercaDeMi() {
    setGeoError('')
    if (!('geolocation' in navigator)) {
      setGeoError('Tu navegador no soporta geolocalización.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        const params = new URLSearchParams()
        if (q.trim()) params.set('q', q.trim())
        params.set('lat', String(pos.coords.latitude))
        params.set('lng', String(pos.coords.longitude))
        router.push(`/profesionales?${params.toString()}`)
      },
      () => {
        setLocating(false)
        setGeoError('No pudimos acceder a tu ubicación.')
      },
      { timeout: 8000 }
    )
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="¿Qué necesitás? Ej: electricista"
          className="flex-1 rounded-full border border-zinc-300 px-5 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 sm:flex-none"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={handleCercaDeMi}
            disabled={locating}
            className="flex-1 rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900 sm:flex-none"
          >
            {locating ? 'Ubicando...' : 'Cerca de mí'}
          </button>
        </div>
      </form>
      {geoError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{geoError}</p>
      )}
    </div>
  )
}
