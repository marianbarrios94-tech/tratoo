-- Zolvi — teléfono de contacto para WhatsApp
-- El teléfono del profesional se muestra al cliente recién cuando acepta su
-- solicitud (botón "Contactar por WhatsApp" en /cuenta/solicitudes). Va en
-- una tabla separada de professional_profiles porque esa tabla es pública
-- por diseño (para el directorio) y el teléfono no debe serlo.

create table professional_contacts (
  user_id uuid primary key references professional_profiles (user_id) on delete cascade,
  phone text
);

alter table professional_contacts enable row level security;

create policy "professional_contacts: select own or accepted client" on professional_contacts
  for select using (
    auth.uid() = user_id
    or exists (
      select 1 from service_requests sr
      where sr.professional_id = professional_contacts.user_id
        and sr.client_id = auth.uid()
        and sr.status in ('accepted', 'completed')
    )
  );

create policy "professional_contacts: insert own" on professional_contacts
  for insert with check (auth.uid() = user_id);

create policy "professional_contacts: update own" on professional_contacts
  for update using (auth.uid() = user_id);
