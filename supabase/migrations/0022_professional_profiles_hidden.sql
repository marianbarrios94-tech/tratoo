-- Permite que un profesional oculte su perfil del directorio sin perder sus
-- datos cargados (a diferencia de vaciar business_name, que borraría todo
-- lo que escribió). Reversible desde /panel/perfil.

alter table professional_profiles add column hidden boolean not null default false;
