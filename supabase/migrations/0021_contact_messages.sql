-- Mensajes del formulario de contacto (/contacto). Reemplaza el link
-- "mailto:" del footer, que en mobile abría la app de Gmail en vez de dejar
-- escribir la consulta ahí mismo. Se inserta con la service role key desde
-- el Server Action, no hay policy pública de insert.

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;
