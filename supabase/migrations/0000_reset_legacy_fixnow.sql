-- Limpieza del esquema viejo de "FixNow" (solo hogar) antes de correr
-- 0001_init.sql en este mismo proyecto de Supabase. Todas las tablas de abajo
-- están vacías salvo `categories` (3 filas de ejemplo: Plomero, Electricista,
-- Cerrajero), así que no hay pérdida real de datos.
--
-- Correr esto PRIMERO, y 0001_init.sql inmediatamente después, en el SQL
-- Editor del dashboard de Supabase.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists handle_new_user() cascade;

drop table if exists public.professional_details cascade;
drop table if exists public.requests cascade;
drop table if exists public.reviews cascade;
drop table if exists public.profiles cascade;
drop table if exists public.categories cascade;
