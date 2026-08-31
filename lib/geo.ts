import { NEA_CITIES } from '@/lib/constants/neaCities'
import { stripAccents } from '@/lib/text'

export function haversineDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function lookupCityCoordinates(city: string | null | undefined) {
  if (!city) return null
  const normalized = stripAccents(city).toLowerCase().trim()
  if (!normalized) return null
  const exact = NEA_CITIES.find((c) => c.key === normalized)
  if (exact) return { lat: exact.lat, lng: exact.lng }
  const partial = NEA_CITIES.find((c) => normalized.includes(c.key))
  return partial ? { lat: partial.lat, lng: partial.lng } : null
}
