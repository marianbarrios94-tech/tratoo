import type { RequestStatus } from '@/lib/types/database'

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export const REQUEST_STATUS_BADGE_CLASS: Record<RequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  accepted: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  cancelled: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400',
}
