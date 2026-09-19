-- Vencimiento automático de la promo de los primeros profesionales (ver
-- 0023 y lib/foundingPromo.ts): cuando promo_pro_until ya pasó, el profesional
-- vuelve al plan gratuito. Corre todos los días desde pg_cron.
--
-- Solo toca a quien sigue con el Pro "regalado": si el profesional se suscribió
-- de verdad (mp_preapproval_id cargado por el webhook de Mercado Pago), su
-- suscripción no se toca. promo_pro_until se conserva a propósito: el cupo de
-- 100 se cuenta con ese campo, así que borrarlo liberaría lugares.

create extension if not exists pg_cron with schema pg_catalog;

create or replace function expire_founding_promos()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  expired_count integer;
begin
  update professional_profiles
     set subscription_status = 'trialing',
         subscription_plan_id = null
   where promo_pro_until is not null
     and promo_pro_until < now()
     and subscription_status = 'active'
     and mp_preapproval_id is null;

  get diagnostics expired_count = row_count;
  return expired_count;
end;
$$;

-- 06:00 UTC = 03:00 en Argentina.
select cron.schedule(
  'expire-founding-promos',
  '0 6 * * *',
  $$select expire_founding_promos()$$
);
