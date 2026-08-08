-- Zolvi — tier gratuito para profesionales + tracking de eventos
-- El directorio deja de exigir suscripción activa para mostrar un perfil (ver
-- app/profesionales/page.tsx); los profesionales sin plan activo quedan
-- limitados a FREE_TIER_MONTHLY_REQUEST_LIMIT solicitudes por mes
-- (lib/constants/subscriptions.ts). profile_events registra vistas de perfil
-- y clicks de WhatsApp para poder mostrarle al profesional cuánto valor le
-- genera la plataforma, sea o no plan pago.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'profile_event_type') then
    create type profile_event_type as enum ('view', 'whatsapp_click');
  end if;
end $$;

create table if not exists profile_events (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professional_profiles (user_id) on delete cascade,
  event_type profile_event_type not null,
  created_at timestamptz not null default now()
);

create index if not exists profile_events_professional_id_created_at_idx
  on profile_events (professional_id, created_at);

alter table profile_events enable row level security;

drop policy if exists "profile_events: select own" on profile_events;
create policy "profile_events: select own" on profile_events
  for select using (auth.uid() = professional_id);

drop policy if exists "profile_events: insert any" on profile_events;
create policy "profile_events: insert any" on profile_events
  for insert with check (true);

-- Conteo mensual de solicitudes por profesional (tope del tier gratuito),
-- consultado en cada carga/envío del formulario de "Solicitar".
create index if not exists service_requests_professional_id_created_at_idx
  on service_requests (professional_id, created_at);
