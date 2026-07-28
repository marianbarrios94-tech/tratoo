-- Zolvi — Fase 5
-- Guarda professional_id directo en reviews (denormalizado) para poder
-- mostrar las reseñas de un profesional en su perfil público sin tener que
-- leer service_requests, que tiene RLS restringido al cliente/profesional
-- involucrados (revelaría el mensaje del cliente a cualquier visitante).
-- También mantiene professional_profiles.avg_rating sincronizado con las
-- reviews reales vía trigger, en vez de que la aplicación lo recalcule a mano.

alter table reviews add column professional_id uuid references professional_profiles (user_id);

create function update_professional_avg_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  target_professional_id uuid;
  new_avg numeric(3, 2);
begin
  target_professional_id := coalesce(new.professional_id, old.professional_id);

  if target_professional_id is not null then
    select coalesce(avg(rating), 0) into new_avg
    from reviews
    where professional_id = target_professional_id;

    update professional_profiles
    set avg_rating = new_avg
    where user_id = target_professional_id;
  end if;

  return coalesce(new, old);
end;
$$;

create trigger on_review_change
  after insert or update or delete on reviews
  for each row execute procedure update_professional_avg_rating();
