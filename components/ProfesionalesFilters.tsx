'use client'

import { useState } from 'react'

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
}: {
  verticals: readonly Vertical[]
  categories: Category[]
  provinces: readonly string[]
  defaultVertical: string
  defaultCategoria: string
  defaultCiudad: string
  defaultProvincia: string
}) {
  const [vertical, setVertical] = useState(defaultVertical)
  const [categoria, setCategoria] = useState(defaultCategoria)

  function handleVerticalChange(next: string) {
    setVertical(next)
    if (next && !categories.some((c) => c.slug === categoria && c.vertical === next)) {
      setCategoria('')
    }
  }

  const visibleCategories = vertical ? categories.filter((c) => c.vertical === vertical) : null

  return (
    <form method="get" className="mt-6 flex flex-wrap gap-3">
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
    </form>
  )
}
