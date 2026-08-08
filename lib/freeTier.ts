import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'
import { startOfCurrentMonthISO } from '@/lib/date'

// Un mismo cliente escribiendo varias veces en el mes no debe comerse el
// cupo gratuito del profesional — el tope cuenta clientes distintos, no
// mensajes. Devuelve el client_id de cada solicitud recibida este mes
// (con repetidos) para que el llamador derive tanto el total como el
// conteo de clientes únicos según lo que necesite.
export async function getMonthlyClientIds(
  supabase: SupabaseClient<Database>,
  professionalId: string
) {
  const { data } = await supabase
    .from('service_requests')
    .select('client_id')
    .eq('professional_id', professionalId)
    .gte('created_at', startOfCurrentMonthISO())
  return (data ?? []).map((r) => r.client_id)
}
