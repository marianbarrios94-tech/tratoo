-- Zolvi — notificaciones por email
-- Guarda el email en profiles para poder avisarle a alguien sin tener que
-- pegarle a la Supabase Auth Admin API en cada envío. Se lee únicamente
-- desde el cliente admin (service_role) en lib/email/notify.ts, nunca vía
-- RLS de un usuario común.

alter table profiles add column email text;

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'client')::user_role,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  return new;
end;
$$;

-- Backfill de una sola vez para los usuarios ya creados antes de esta migración.
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null;
