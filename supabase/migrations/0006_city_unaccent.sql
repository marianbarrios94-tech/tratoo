-- Zolvi — búsqueda de ciudad sin distinción de acentos
-- unaccent() es STABLE (depende del search_path), por lo que no se puede usar
-- directo en una columna generada; se envuelve nombrando el diccionario
-- explícitamente para poder marcarla IMMUTABLE.

create extension if not exists unaccent;

create or replace function public.immutable_unaccent(text)
returns text
language sql
immutable
parallel safe
as $$
  select unaccent('unaccent', $1)
$$;

alter table professional_profiles
  add column city_unaccent text
  generated always as (public.immutable_unaccent(coalesce(city, ''))) stored;
