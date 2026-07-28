-- Zolvi — esquema inicial (Fase 1)
-- Correr este archivo completo en el SQL Editor del dashboard de Supabase,
-- en un proyecto nuevo (antes de generar tipos con `supabase gen types`).

-- ===== Tipos =====

create type user_role as enum ('client', 'professional', 'admin');
create type vertical as enum ('hogar', 'consultoria', 'salud');
create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled');
create type request_status as enum ('pending', 'accepted', 'completed', 'cancelled');

-- ===== Tablas =====

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'client',
  full_name text,
  avatar_url text,
  phone text,
  city text,
  created_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  vertical vertical not null,
  icon text
);

create table subscription_plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price_monthly numeric(10, 2) not null,
  features jsonb not null default '[]',
  stripe_price_id text
);

create table professional_profiles (
  user_id uuid primary key references profiles (id) on delete cascade,
  category_id uuid references categories (id),
  business_name text,
  bio text,
  city text,
  years_experience int,
  verified boolean not null default false,
  subscription_plan_id uuid references subscription_plans (id),
  subscription_status subscription_status not null default 'trialing',
  stripe_customer_id text,
  stripe_subscription_id text,
  avg_rating numeric(3, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table service_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles (id) on delete cascade,
  professional_id uuid not null references professional_profiles (user_id) on delete cascade,
  category_id uuid references categories (id),
  status request_status not null default 'pending',
  message text,
  scheduled_at timestamptz,
  created_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references service_requests (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- ===== Trigger: crear profiles al registrarse =====
-- El rol y el nombre viajan en options.data al llamar supabase.auth.signUp
-- desde app/(auth)/actions.ts.

create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'client')::user_role,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ===== RLS =====

alter table profiles enable row level security;
alter table categories enable row level security;
alter table subscription_plans enable row level security;
alter table professional_profiles enable row level security;
alter table service_requests enable row level security;
alter table reviews enable row level security;

create policy "profiles: select own" on profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on profiles
  for update using (auth.uid() = id);

create policy "categories: public read" on categories
  for select using (true);

create policy "subscription_plans: public read" on subscription_plans
  for select using (true);

create policy "professional_profiles: public read" on professional_profiles
  for select using (true);

create policy "professional_profiles: insert own" on professional_profiles
  for insert with check (auth.uid() = user_id);

create policy "professional_profiles: update own" on professional_profiles
  for update using (auth.uid() = user_id);

create policy "service_requests: select involved" on service_requests
  for select using (auth.uid() = client_id or auth.uid() = professional_id);

create policy "service_requests: insert as client" on service_requests
  for insert with check (auth.uid() = client_id);

create policy "service_requests: update involved" on service_requests
  for update using (auth.uid() = client_id or auth.uid() = professional_id);

create policy "reviews: public read" on reviews
  for select using (true);

create policy "reviews: insert by request client" on reviews
  for insert with check (
    exists (
      select 1 from service_requests sr
      where sr.id = request_id
        and sr.client_id = auth.uid()
        and sr.status = 'completed'
    )
  );

-- ===== Seed: categorías =====

insert into categories (slug, name, vertical, icon) values
  ('plomeria', 'Plomería', 'hogar', 'wrench'),
  ('electricidad', 'Electricidad', 'hogar', 'zap'),
  ('gas', 'Gas', 'hogar', 'flame'),
  ('limpieza', 'Limpieza', 'hogar', 'sparkles'),
  ('abogacia', 'Abogacía', 'consultoria', 'scale'),
  ('contabilidad', 'Contabilidad', 'consultoria', 'calculator'),
  ('diseno', 'Diseño', 'consultoria', 'palette'),
  ('marketing', 'Marketing', 'consultoria', 'megaphone'),
  ('psicologia', 'Psicología', 'salud', 'brain'),
  ('nutricion', 'Nutrición', 'salud', 'apple'),
  ('entrenamiento-personal', 'Entrenamiento personal', 'salud', 'dumbbell'),
  ('medicina-general', 'Medicina general', 'salud', 'stethoscope');

-- ===== Seed: planes de suscripción =====
-- stripe_price_id se completa en Fase 4 cuando exista el producto en Stripe.

insert into subscription_plans (slug, name, price_monthly, features) values
  ('basico', 'Básico', 9.99, '["Perfil en el directorio", "Hasta 5 solicitudes por mes"]'),
  ('pro', 'Pro', 19.99, '["Solicitudes ilimitadas", "Insignia de verificado", "Estadísticas básicas"]'),
  ('premium', 'Premium', 34.99, '["Todo lo de Pro", "Prioridad en resultados de búsqueda", "Soporte prioritario"]');
