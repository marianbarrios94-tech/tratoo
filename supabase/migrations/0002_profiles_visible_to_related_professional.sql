-- Zolvi — Fase 3
-- Permite que un profesional vea el nombre del cliente en las solicitudes que
-- le llegaron. La policy original de `profiles` solo permitía "select own",
-- por eso `/panel/solicitudes` mostraba "Cliente" en vez del nombre real.

create policy "profiles: select for related professional" on profiles
  for select using (
    exists (
      select 1 from service_requests sr
      where sr.client_id = profiles.id
        and sr.professional_id = auth.uid()
    )
  );
