import { createAdminClient } from '@/lib/supabase/admin'
import { startOfCurrentMonthISO } from '@/lib/date'

// Un mismo cliente escribiendo varias veces en el mes no debe comerse el
// cupo gratuito del profesional — el tope cuenta clientes distintos, no
// mensajes. Devuelve el client_id de cada solicitud recibida este mes
// (con repetidos) para que el llamador derive tanto el total como el
// conteo de clientes únicos según lo que necesite.
//
// Usa el cliente admin (bypass RLS) a propósito: la política de
// service_requests solo deja ver a cada usuario sus propias solicitudes, así
// que un cliente nuevo que todavía no le escribió a este profesional vería 0
// filas con el cliente de sesión y el cupo nunca se aplicaría. Acá solo se
// usa el resultado para calcular un booleano (cupo alcanzado o no); nunca se
// expone la lista de clientes.
export async function getMonthlyClientIds(professionalId: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('service_requests')
    .select('client_id')
    .eq('professional_id', professionalId)
    .gte('created_at', startOfCurrentMonthISO())
  return (data ?? []).map((r) => r.client_id)
}
