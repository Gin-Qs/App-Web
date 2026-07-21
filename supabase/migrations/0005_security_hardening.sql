-- =====================================================================
-- Security hardening + tracking performance.
--
-- 1) handle_new_user (CRITICAL FIX): the signup trigger used to read
--    `role` and `company_id` from raw_user_meta_data, which the CLIENT
--    controls at /auth/v1/signup — anyone could self-register as
--    'admin' and, through is_staff(), read every company, trip and
--    invoice. Roles now come only from raw_app_meta_data (settable
--    only with the service role); self-signups always land as a plain
--    'customer' with no company.
--
-- 2) trip_latest_locations: security-invoker view returning only the
--    newest GPS point per trip, so clients stop downloading entire
--    location trails just to place one marker. RLS of trip_locations
--    still applies through the view.
--
-- 3) simulate_fleet_movement: now prunes old simulator breadcrumbs
--    (keeps the newest 500 per trip) so the demo table stops growing
--    forever at one row per trip per minute.
-- =====================================================================

-- ---------- 1) Signup trigger: never trust client metadata ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role, company_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    -- raw_app_meta_data can only be written with the service role key;
    -- raw_user_meta_data is client-supplied and must never grant roles.
    coalesce((new.raw_app_meta_data->>'role')::public.user_role, 'customer'),
    nullif(new.raw_app_meta_data->>'company_id', '')::uuid
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from anon, authenticated, public;

-- RLS helper functions are only needed by signed-in queries; anonymous
-- visitors use the track_shipment RPC exclusively. Fail closed for anon.
revoke execute on function public.auth_user_role() from anon, public;
revoke execute on function public.auth_user_company() from anon, public;
revoke execute on function public.is_staff() from anon, public;

-- ---------- 2) Latest position per trip, RLS-aware ----------
create or replace view public.trip_latest_locations
with (security_invoker = true) as
select distinct on (trip_id)
  id, trip_id, lat, lon, speed_kph, heading, recorded_at
from public.trip_locations
order by trip_id, recorded_at desc;

grant select on public.trip_latest_locations to authenticated;
revoke select on public.trip_latest_locations from anon;

-- ---------- 3) Simulator: bound the breadcrumb table ----------
create or replace function public.simulate_fleet_movement()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  t        record;
  last     public.trip_locations;
  next_lat double precision;
  next_lon double precision;
  remaining double precision;
  step     double precision := 0.12;  -- fraction of remaining distance per tick
begin
  for t in
    select * from public.trips where status = 'in_transit'
      and destination_lat is not null and destination_lon is not null
  loop
    select * into last from public.trip_locations
      where trip_id = t.id order by recorded_at desc limit 1;

    if last is null then
      next_lat := coalesce(t.origin_lat, t.destination_lat);
      next_lon := coalesce(t.origin_lon, t.destination_lon);
    else
      remaining := sqrt(power(t.destination_lat - last.lat, 2) + power(t.destination_lon - last.lon, 2));
      if remaining < 0.05 then
        -- Loop back to origin to keep the demo fleet perpetually in motion.
        next_lat := coalesce(t.origin_lat, t.destination_lat);
        next_lon := coalesce(t.origin_lon, t.destination_lon);
      else
        next_lat := last.lat + (t.destination_lat - last.lat) * step;
        next_lon := last.lon + (t.destination_lon - last.lon) * step;
      end if;
    end if;

    insert into public.trip_locations (trip_id, lat, lon, speed_kph, heading, recorded_at)
    values (
      t.id, next_lat, next_lon,
      80 + (random() * 25),
      degrees(atan2(t.destination_lon - next_lon, t.destination_lat - next_lat)),
      now()
    );
  end loop;

  -- Keep only the newest 500 breadcrumbs per trip (seeded history for
  -- delivered trips is far below this, so it is never touched).
  delete from public.trip_locations
  where id in (
    select id from (
      select id, row_number() over (partition by trip_id order by recorded_at desc) as rn
      from public.trip_locations
    ) ranked
    where ranked.rn > 500
  );
end;
$$;

revoke execute on function public.simulate_fleet_movement() from anon, authenticated, public;
