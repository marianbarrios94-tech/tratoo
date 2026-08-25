-- Guarda el nombre del cliente directo en la reseña (denormalizado, mismo
-- patrón que professional_id en 0004) porque la ficha pública de un
-- profesional no tiene forma de leer profiles/service_requests del cliente
-- bajo RLS (esas tablas solo son visibles para las partes involucradas).
alter table reviews add column client_name text;
