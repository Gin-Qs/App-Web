-- =====================================================================
-- DEMO live-tracking simulator.
-- Advances every 'in_transit' trip a step toward its destination once per
-- minute and inserts a new trip_locations row, so the realtime live map
-- visibly moves. Remove this migration (and unschedule the cron job) once
-- real GPS telemetry is feeding public.trip_locations:
--   select cron.unschedule('ginqs-fleet-sim');
-- =====================================================================
create extension if not exists pg_cron;

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
end;
$$;

revoke execute on function public.simulate_fleet_movement() from anon, authenticated, public;

select cron.schedule('ginqs-fleet-sim', '* * * * *', $$select public.simulate_fleet_movement();$$);
