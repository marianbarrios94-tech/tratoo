import { createClient } from '@/lib/supabase/server'
import { VERTICALS } from '@/lib/constants/categories'
import { PROVINCES } from '@/lib/constants/provinces'
import { stripAccents } from '@/lib/text'
import { haversineDistanceKm } from '@/lib/geo'
import { BackButton } from '@/components/BackButton'
import { ProfessionalDirectoryGrid } from '@/components/ProfessionalDirectoryGrid'
import { ProfesionalesFilters } from '@/components/ProfesionalesFilters'

export default async function ProfesionalesPage({
  searchParams,
}: {
  searchParams: Promise<{
    vertical?: string
    categoria?: string
    ciudad?: string
    provincia?: string
    q?: string
    lat?: string
    lng?: string
  }>
}) {
  const { vertical, categoria, ciudad, provincia, q, lat, lng } = await searchParams
  const latNum = lat !== undefined && Number.isFinite(Number(lat)) ? Number(lat) : null
  const lngNum = lng !== undefined && Number.isFinite(Number(lng)) ? Number(lng) : null
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
    .eq('hidden', false)
    .order('verified', { ascending: false })
    .order('avg_rating', { ascending: false })

  if (categoryIds) {
    query = query.in('category_id', categoryIds)
  }
  if (q) {
    // Cubre a quienes cargaron su profesión como texto libre (no está en
    // la lista de categorías) y por eso no aparecían con los filtros de
    // rubro/categoría.
    const safeQ = q.replace(/[,()%]/g, ' ').trim()
    if (safeQ) {
      query = query.or(`business_name.ilike.%${safeQ}%,custom_profession.ilike.%${safeQ}%`)
    }
  }
  if (ciudad) {
    query = query.ilike('city_unaccent', `%${stripAccents(ciudad)}%`)
  }
  if (provincia) {
    query = query.eq('province', provincia)
  }

  const { data: professionals } = await query

  const withDistance = (professionals ?? []).map((p) => ({
    ...p,
    distanceKm:
      latNum != null && lngNum != null && p.lat != null && p.lng != null
        ? haversineDistanceKm(latNum, lngNum, p.lat, p.lng)
        : null,
  }))
  const sortedProfessionals =
    latNum != null && lngNum != null
      ? [...withDistance].sort((a, b) => {
          if (a.distanceKm == null && b.distanceKm == null) return 0
          if (a.distanceKm == null) return 1
          if (b.distanceKm == null) return -1
          return a.distanceKm - b.distanceKm
        })
      : withDistance

  const userIds = sortedProfessionals.map((p) => p.user_id)
  const { data: avatarRows } = userIds.length
    ? await supabase.from('profiles').select('id, avatar_url').in('id', userIds)
    : { data: [] }
  const avatarByUserId = new Map((avatarRows ?? []).map((a) => [a.id, a.avatar_url]))

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <BackButton fallbackHref="/" />
      <div className="mt-4">
        <h1 className="text-2xl font-semibold">Directorio de profesionales</h1>
        <p className="mt-1 text-zinc-500">Encontrá al profesional que resuelve.</p>
      </div>

      <ProfesionalesFilters
        verticals={VERTICALS}
        categories={categories ?? []}
        provinces={PROVINCES}
        defaultVertical={vertical ?? ''}
        defaultCategoria={categoria ?? ''}
        defaultCiudad={ciudad ?? ''}
        defaultProvincia={provincia ?? ''}
        defaultQ={q ?? ''}
        defaultLat={lat ?? ''}
        defaultLng={lng ?? ''}
      />

      <ProfessionalDirectoryGrid
        professionals={sortedProfessionals.map((p) => {
          const category = p.category_id ? categoryById.get(p.category_id) : null
          return {
            user_id: p.user_id,
            business_name: p.business_name,
            verified: p.verified,
            city: p.city,
            province: p.province,
            avg_rating: p.avg_rating,
            categoryLabel: category?.name ?? p.custom_profession ?? null,
            avatarUrl: avatarByUserId.get(p.user_id) ?? null,
            distanceKm: p.distanceKm,
          }
        })}
      />
    </div>
  )
}
