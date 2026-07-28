import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

// Bypassa RLS con la service_role key. Usar solo en código de servidor de
// confianza (webhooks) que no corre en el contexto de un usuario autenticado.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
