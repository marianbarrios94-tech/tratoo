-- La policy "profiles: select own" solo deja ver la propia fila. La ficha
-- pública de un profesional (`/profesionales/[id]` y el listado) lee
-- profiles.avatar_url y full_name del profesional, así que cualquier
-- visitante que no sea ese mismo profesional recibía null por RLS y no veía
-- la foto ni el nombre, aunque el profesional sí los tuviera cargados.

create policy "profiles: public read for listed professionals" on profiles
  for select using (
    exists (
      select 1 from professional_profiles pp
      where pp.user_id = profiles.id and pp.business_name is not null
    )
  );
