import type { Vertical } from '@/lib/types/database'

export const VERTICALS: { slug: Vertical; label: string; tagline: string }[] = [
  { slug: 'hogar', label: 'Hogar', tagline: 'Plomería, electricidad, gas y limpieza' },
  { slug: 'consultoria', label: 'Consultoría', tagline: 'Abogacía, contabilidad, diseño y marketing' },
  { slug: 'salud', label: 'Salud y bienestar', tagline: 'Psicología, nutrición y entrenamiento personal' },
]

export const CATEGORIES_BY_VERTICAL: Record<Vertical, string[]> = {
  hogar: ['Plomería', 'Electricidad', 'Gas', 'Limpieza'],
  consultoria: ['Abogacía', 'Contabilidad', 'Diseño', 'Marketing'],
  salud: ['Psicología', 'Nutrición', 'Entrenamiento personal', 'Medicina general'],
}
