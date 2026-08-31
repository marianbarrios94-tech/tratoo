'use client'

import { useRef, useState } from 'react'

type Category = { id: string; slug: string; name: string; vertical: string }
type Vertical = { slug: string; label: string }

export function ProfesionalesFilters({
  verticals,
  categories,
  provinces,
  defaultVertical,
  defaultCategoria,
  defaultCiudad,
  defaultProvincia,
  defaultQ,
  defaultLat,
  defaultLng,
}: {
  verticals: readonly Vertical[]
  categories: Category[]
  provinces: readonly string[]
  defaultVertical: string
  defaultCategoria: string
  defaultCiudad: string
  defaultProvincia: string
  defaultQ: string
  defaultLat?: string
  defaultLng?: string
}) {
  const [vertical, setVertical] = useState(defaultVertical)
  const [categoria, setCategoria] = useState(defaultCategoria)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const latRef = useRef<HTMLInputElement>(null)
  const lngRef = useRef<HTMLInputElement>(null)
  const hasLocation = Boolean(defaultLat && defaultLng)

  function handleCercaDeMi() {
    setGeoError('')
    if (!('geolocation' in navigator)) {
      setGeoError('Tu navegador no soporta geolocalización.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (latRef.current) latRef.current.value = String(pos.coords.latitude)
        if (lngRef.current) lngRef.current.value = String(pos.coords.longitude)
        setLocating(false)
        formRef.current?.requestSubmit()
      },
      () => {
        setLocating(false)
        setGeoError('No pudimos acceder a tu ubicación.')
      },
      { timeout: 8000 }
    )
  }

  function handleQuitarUbicacion() {
    if (latRef.current) latRef.current.value = ''
    if (lngRef.current) lngRef.current.value = ''
    formRef.current?.requestSubmit()
  }

  function handleVerticalChange(next: string) {
    setVertical(next)
    if (next && !categories.some((c) => c.slug === categoria && c.vertical === next)) {
      setCategoria('')
    }
  }

  const visibleCategories = vertical ? categories.filter((c) => c.vertical === vertical) : null

  return (
    <form ref={formRef} method="get" className="mt-6 flex flex-wrap items-center gap-3">
      <input type="hidden" name="lat" ref={latRef} defaultValue={defaultLat ?? ''} />
      <input type="hidden" name="lng" ref={lngRef} defaultValue={defaultLng ?? ''} />
      <input
        name="q"
        type="text"
        placeholder="Buscar por nombre o profesión"
        defaultValue={defaultQ}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />

      <select
        name="vertical"
        value={vertical}
        onChange={(e) => handleVerticalChange(e.target.value)}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        <option value="">Todos los rubros</option>
        {verticals.map((v) => (
          <option key={v.slug} value={v.slug}>
            {v.label}
          </option>
        ))}
      </select>

      <select
        name="categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        <option value="">Todas las categorías</option>
        {visibleCategories
          ? visibleCategories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))
          : verticals.map((v) => (
              <optgroup key={v.slug} label={v.label}>
                {categories
                  .filter((c) => c.vertical === v.slug)
                  .map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
              </optgroup>
            ))}
      </select>

      <input
        name="ciudad"
        type="text"
        placeholder="Ciudad"
        defaultValue={defaultCiudad}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />

      <select
        name="provincia"
        defaultValue={defaultProvincia}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        <option value="">Todas las provincias</option>
        {provinces.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Buscar
      </button>

      <button
        type="button"
        onClick={handleCercaDeMi}
        disabled={locating}
        className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        {locating ? 'Ubicando...' : 'Cerca de mí'}
      </button>

      {hasLocation && (
        <span className="flex items-center gap-2 text-sm text-zinc-500">
          Ordenando por cercanía
          <button
            type="button"
            onClick={handleQuitarUbicacion}
            className="underline hover:text-zinc-950 dark:hover:text-white"
          >
            Quitar
          </button>
        </span>
      )}

      {geoError && <span className="text-sm text-red-600 dark:text-red-400">{geoError}</span>}
    </form>
  )
}
