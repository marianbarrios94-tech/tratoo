import { createClient } from '@/lib/supabase/server'
import { VERTICALS } from '@/lib/constants/categories'
import { stripAccents } from '@/lib/text'
import { BackButton } from '@/components/BackButton'
import { ProfessionalDirectoryGrid } from '@/components/ProfessionalDirectoryGrid'

export default async function ProfesionalesPage({
  searchParams,
}: {
  searchParams: Promise<{ vertical?: string; categoria?: string; ciudad?: string }>
}) {
  const { vertical, categoria, ciudad } = await searchParams
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, name, vertical')
    .order('name')

  const categoryById = new Map((categories ?? []).map((c) => [c.id, c]))

  let categoryIds: string[] | null = null
  if (categoria) {
    const match = categories?.find((c) => c.slug === categoria)
    categoryIds = match ? [match.id] : []
  } else if (vertical) {
    categoryIds = (categories ?? []).filter((c) => c.vertical === vertical).map((c) => c.id)
  }

  let query = supabase
    .from('professional_profiles')
    .select('*')
    .not('business_name', 'is', null)
    .order('verified', { ascending: false })
    .order('avg_rating', { ascending: false })

  if (categoryIds) {
    query = query.in('category_id', categoryIds)
  }
  if (ciudad) {
    query = query.ilike('city_unaccent', `%${stripAccents(ciudad)}%`)
  }

  const { data: professionals } = await query

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <BackButton />
      <div className="mt-4">
        <h1 className="text-2xl font-semibold">Directorio de profesionales</h1>
        <p className="mt-1 text-zinc-500">Encontrá al profesional que resuelve.</p>
      </div>

      <form method="get" className="mt-6 flex flex-wrap gap-3">
        <select
          name="vertical"
          defaultValue={vertical ?? ''}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">Todos los rubros</option>
          {VERTICALS.map((v) => (
            <option key={v.slug} value={v.slug}>
              {v.label}
            </option>
          ))}
        </select>

        <select
          name="categoria"
          defaultValue={categoria ?? ''}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">Todas las categorías</option>
          {VERTICALS.map((v) => (
            <optgroup key={v.slug} label={v.label}>
              {(categories ?? [])
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
          defaultValue={ciudad ?? ''}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />

        <button
          type="submit"
          className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Buscar
        </button>
      </form>

      <ProfessionalDirectoryGrid
        professionals={(professionals ?? []).map((p) => {
          const category = p.category_id ? categoryById.get(p.category_id) : null
          return {
            user_id: p.user_id,
            business_name: p.business_name,
            verified: p.verified,
            city: p.city,
            avg_rating: p.avg_rating,
            categoryLabel: category?.name ?? p.custom_profession ?? null,
          }
        })}
      />
    </div>
  )
}
