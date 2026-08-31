-- Registro de hasta cuándo un profesional tiene el plan Pro gratis por haberse
-- sumado con el código de invitación de lanzamiento (ver signup() en
-- app/(auth)/actions.ts). No hay expiración automática todavía — es solo
-- para que Marian pueda revisar manualmente más adelante quién tiene el
-- beneficio y hasta cuándo.

alter table professional_profiles add column promo_pro_until timestamptz;
