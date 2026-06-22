-- Public shipment tracking by reference (guía), for one-time customers without a
-- portal account. SECURITY DEFINER returns ONLY minimal info for the exact
-- reference provided (like a DHL/FedEx lookup). No bulk listing. Callable by anon.
create or replace function public.track_shipment(p_ref text)
returns table (
  reference text,
  status public.trip_status,
  origin_label text,
  destination_label text,
  eta timestamptz,
  departure_at timestamptz,
  delivered_at timestamptz,
  last_lat double precision,
  last_lon double precision,
  last_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select t.reference, t.status, t.origin_label, t.destination_label,
         t.eta, t.departure_at, t.delivered_at,
         l.lat, l.lon, l.recorded_at
  from public.trips t
  left join lateral (
    select lat, lon, recorded_at
    from public.trip_locations
    where trip_id = t.id
    order by recorded_at desc
    limit 1
  ) l on true
  where upper(t.reference) = upper(trim(p_ref))
  limit 1
$$;

revoke all on function public.track_shipment(text) from public;
grant execute on function public.track_shipment(text) to anon, authenticated;
