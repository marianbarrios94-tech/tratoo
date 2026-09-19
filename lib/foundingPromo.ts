import { createAdminClient } from '@/lib/supabase/admin'

// Código de invitación para el lanzamiento en Posadas: quien se registra como
// profesional con ?promo=fundador en el link recibe el plan Pro gratis por
// FOUNDING_PRO_MONTHS meses, sin pasar por Mercado Pago, hasta un máximo de
// FOUNDING_PROMO_CAP profesionales en total. El vencimiento lo hace un job
// diario en la base (expire_founding_promos, migración 0026) que devuelve al
// plan gratuito a quien ya pasó promo_pro_until; ese campo se conserva porque
// también sirve para contar el cupo.
export const FOUNDING_PROMO_CODE = 'fundador'
export const FOUNDING_PRO_MONTHS = 3
export const FOUNDING_PROMO_CAP = 100
const PRO_PLAN_ID = '492798df-d5c2-4634-bdaa-9c5cc9df396f'

export async function getFoundingPromoGrantedCount() {
  const admin = createAdminClient()
  const { count } = await admin
    .from('professional_profiles')
    .select('user_id', { count: 'exact', head: true })
    .not('promo_pro_until', 'is', null)
  return count ?? 0
}

// Devuelve true si se otorgó el beneficio, false si ya se llegó al cupo.
export async function grantFoundingPromo(userId: string) {
  const alreadyGranted = await getFoundingPromoGrantedCount()
  if (alreadyGranted >= FOUNDING_PROMO_CAP) {
    return false
  }

  const until = new Date()
  until.setMonth(until.getMonth() + FOUNDING_PRO_MONTHS)

  // No incluye `verified`: eso ahora se decide solo por tener teléfono
  // cargado (ver saveProfessionalProfile), nunca por haber usado este link.
  const admin = createAdminClient()
  await admin.from('professional_profiles').upsert({
    user_id: userId,
    subscription_status: 'active',
    subscription_plan_id: PRO_PLAN_ID,
    promo_pro_until: until.toISOString(),
  })
  return true
}
