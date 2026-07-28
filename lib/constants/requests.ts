import type { RequestStatus } from '@/lib/types/database'

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}
