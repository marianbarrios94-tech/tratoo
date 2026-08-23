-- Registro de cada llamada entrante a los webhooks (Mercado Pago por ahora),
-- para poder diagnosticar problemas de integración sin depender de los logs
-- de Vercel. Solo accesible con la service role key.

create table if not exists webhook_logs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  headers jsonb,
  query jsonb,
  body jsonb,
  note text,
  created_at timestamptz not null default now()
);

alter table webhook_logs enable row level security;
