'use server'

import { createClient } from '@/lib/supabase/server'

export async function logWhatsAppClick(professionalId: string) {
  const supabase = await createClient()
  // Best-effort: es solo telemetría para las estadísticas del profesional.
  await supabase.from('profile_events').insert({
    professional_id: professionalId,
    event_type: 'whatsapp_click',
  })
}
