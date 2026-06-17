-- =====================================================================
-- Gin-Qs Logistics — core schema
-- Roles: customer, employee, admin
-- Domain: companies (customers), trips, live trip_locations, invoices
-- Applied to project kxxvqrkhiwowkxeszmsy. Kept here for reproducibility.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Enums ----------
create type public.user_role     as enum ('customer', 'employee', 'admin');
create type public.trip_status   as enum ('scheduled', 'loading', 'in_transit', 'delivered', 'cancelled');
create type public.invoice_status as enum ('draft', 'sent', 'paid', 'overdue');

-- ---------- Companies (customer accounts) ----------
create table public.companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  rfc           text,
  contact_email text,
  contact_phone text,
  address       text,
  credit_limit  numeric(14,2) not null default 0,
  currency      text not null default 'MXN',
  created_at    timestamptz not null default now()
);

-- ---------- Profiles (extends auth.users) ----------
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       public.user_role not null default 'customer',
  full_name  text,
  phone      text,
  company_id uuid references public.companies(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- Account assignments (employee <-> customer) ----------
create table public.account_assignments (
  employee_id uuid not null references public.profiles(id) on delete cascade,
  company_id  uuid not null references public.companies(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (employee_id, company_id)
);

-- ---------- Trips ----------
create table public.trips (
  id                   uuid primary key default gen_random_uuid(),
  reference            text unique not null,
  company_id           uuid not null references public.companies(id) on delete cascade,
  assigned_employee_id uuid references public.profiles(id) on delete set null,
  status               public.trip_status not null default 'scheduled',
  cargo_description    text,
  origin_label         text,
  origin_lat           double precision,
  origin_lon           double precision,
  destination_label    text,
  destination_lat      double precision,
  destination_lon      double precision,
  departure_at         timestamptz,
  eta                  timestamptz,
  delivered_at         timestamptz,
  created_at           timestamptz not null default now()
);

-- ---------- Live trip locations (realtime tracking points) ----------
create table public.trip_locations (
  id          bigint generated always as identity primary key,
  trip_id     uuid not null references public.trips(id) on delete cascade,
  lat         double precision not null,
  lon         double precision not null,
  speed_kph   double precision,
  heading     double precision,
  recorded_at timestamptz not null default now()
);

-- ---------- Invoices ----------
create table public.invoices (
  id         uuid primary key default gen_random_uuid(),
  number     text unique not null,
  company_id uuid not null references public.companies(id) on delete cascade,
  trip_id    uuid references public.trips(id) on delete set null,
  amount     numeric(14,2) not null default 0,
  currency   text not null default 'MXN',
  status     public.invoice_status not null default 'draft',
  issued_at  date,
  due_at     date,
  paid_at    date,
  created_at timestamptz not null default now()
);

-- ---------- Indexes ----------
create index idx_profiles_company    on public.profiles(company_id);
create index idx_trips_company       on public.trips(company_id);
create index idx_trips_employee      on public.trips(assigned_employee_id);
create index idx_trips_status        on public.trips(status);
create index idx_trip_locations_trip on public.trip_locations(trip_id, recorded_at desc);
create index idx_invoices_company    on public.invoices(company_id);
create index idx_invoices_status     on public.invoices(status);
create index idx_assignments_company on public.account_assignments(company_id);

-- =====================================================================
-- Helper functions (SECURITY DEFINER => bypass RLS, avoid recursion)
-- =====================================================================
create or replace function public.auth_user_role()
returns public.user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.auth_user_company()
returns uuid
language sql stable security definer set search_path = public as $$
  select company_id from public.profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role in ('employee','admin') from public.profiles where id = auth.uid()),
    false)
$$;

-- =====================================================================
-- Auto-create a profile row when an auth user is created
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role, company_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'customer'),
    nullif(new.raw_user_meta_data->>'company_id','')::uuid
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger function must not be callable through the REST RPC API.
revoke execute on function public.handle_new_user() from anon, authenticated, public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.companies           enable row level security;
alter table public.profiles            enable row level security;
alter table public.account_assignments enable row level security;
alter table public.trips               enable row level security;
alter table public.trip_locations      enable row level security;
alter table public.invoices            enable row level security;

create policy profiles_select_self_or_staff on public.profiles
  for select using (id = auth.uid() or public.is_staff());
create policy profiles_update_self on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy companies_select on public.companies
  for select using (public.is_staff() or id = public.auth_user_company());

create policy assignments_select on public.account_assignments
  for select using (public.is_staff());

create policy trips_select on public.trips
  for select using (public.is_staff() or company_id = public.auth_user_company());

create policy trip_locations_select on public.trip_locations
  for select using (
    public.is_staff() or exists (
      select 1 from public.trips t
      where t.id = trip_locations.trip_id
        and t.company_id = public.auth_user_company()
    )
  );

create policy invoices_select on public.invoices
  for select using (public.is_staff() or company_id = public.auth_user_company());

-- =====================================================================
-- Realtime
-- =====================================================================
alter publication supabase_realtime add table public.trip_locations;
alter publication supabase_realtime add table public.trips;
