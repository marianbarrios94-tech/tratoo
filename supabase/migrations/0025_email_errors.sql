-- Registro de fallos al mandar emails desde lib/email/notify.ts, para poder
-- diagnosticar sin depender de los logs de Vercel (mismo motivo que
-- webhook_logs). El envío sigue siendo best-effort: un fallo acá nunca debe
-- romper el flujo principal, pero antes quedaba sin rastro alguno.

create table if not exists email_errors (
  id uuid primary key default gen_random_uuid(),
  context text not null,
  error_message text,
  created_at timestamptz not null default now()
);

alter table email_errors enable row level security;
