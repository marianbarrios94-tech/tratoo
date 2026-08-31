alter table professional_profiles
  add column lat double precision,
  add column lng double precision;

-- One-time backfill for profiles that already existed before this migration.
-- This VALUES list is a point-in-time snapshot of lib/constants/neaCities.ts —
-- going forward, lat/lng are set by the app at profile-save time
-- (see app/panel/perfil/actions.ts), this UPDATE never runs again.
update professional_profiles pp
set lat = c.lat, lng = c.lng
from (values
  ('posadas', -27.3671::double precision, -55.8961::double precision),
  ('obera', -27.4870, -55.1199),
  ('eldorado', -26.4008, -54.6420),
  ('puerto iguazu', -25.5952, -54.5734),
  ('apostoles', -27.9167, -55.7500),
  ('jardin america', -27.0333, -55.2000),
  ('leandro n alem', -27.6000, -55.3167),
  ('montecarlo', -26.5667, -54.7667),
  ('san ignacio', -27.2500, -55.5333),
  ('puerto rico', -26.7833, -54.9000),
  ('corrientes', -27.4692, -58.8306),
  ('goya', -29.1401, -59.2660),
  ('mercedes', -29.1833, -58.0833),
  ('paso de los libres', -29.7000, -57.0833),
  ('curuzu cuatia', -29.7833, -58.0500),
  ('santo tome', -28.5528, -56.0472),
  ('bella vista', -28.5000, -59.0333),
  ('ituzaingo', -27.5833, -56.6833),
  ('monte caseros', -30.2667, -57.6333),
  ('esquina', -30.0000, -59.5333),
  ('resistencia', -27.4512, -58.9867),
  ('barranqueras', -27.4833, -58.9333),
  ('fontana', -27.4667, -58.9667),
  ('saenz pena', -26.7852, -60.4388),
  ('villa angela', -27.5833, -60.7167),
  ('charata', -27.2167, -61.2000),
  ('las brenas', -27.0833, -61.0500),
  ('quitilipi', -27.0167, -60.2167),
  ('machagai', -26.9333, -60.0500),
  ('formosa', -26.1775, -58.1781),
  ('clorinda', -25.2861, -57.7139),
  ('pirane', -25.7333, -59.1167),
  ('el colorado', -26.3000, -59.3500),
  ('las lomitas', -24.7000, -60.5833),
  ('ingeniero juarez', -23.9000, -61.8500)
) as c(city_key, lat, lng)
where pp.city is not null
  and pp.lat is null
  and pp.city_unaccent ilike '%' || c.city_key || '%';
