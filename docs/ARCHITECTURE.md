# Architecture

## Overview

```
┌──────────────┐     ┌──────────────┐        ┌──────────────────────────┐
│  apps/web    │     │ apps/mobile  │        │        Supabase          │
│ React + Vite │     │  (future,    │        │  Postgres + Auth         │
│              │     │   Expo)      │        │  Row-Level Security      │
└──────┬───────┘     └──────┬───────┘        │  Realtime (WebSocket)    │
       │   imports          │   imports      └────────────┬─────────────┘
       └─────────┬──────────┘                             │
                 ▼                                         │
        ┌──────────────────┐   supabase-js (HTTPS + WS)    │
        │  packages/core   │ ◄─────────────────────────────┘
        │  client · types  │
        │  queries · format│
        └──────────────────┘
```

`@ginqs/core` holds **all** data access and domain logic with zero UI/framework
dependencies, so the web app and a future mobile app share one source of truth.
The only platform difference is the auth-session storage adapter passed to
`createSupabaseClient` (browser localStorage vs. React Native AsyncStorage).

## Data model

| Table                 | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `companies`           | Customer accounts (name, RFC, credit limit, currency)     |
| `profiles`            | Extends `auth.users`; `role` + `company_id`               |
| `account_assignments` | Which employee manages which customer                     |
| `trips`               | Shipments: route, status, cargo, departure/ETA            |
| `trip_locations`      | Time-series GPS points per trip (streamed via Realtime)   |
| `invoices`            | Billing: amount, status, issued/due/paid dates            |

Enums: `user_role` (customer/employee/admin), `trip_status`
(scheduled/loading/in_transit/delivered/cancelled), `invoice_status`
(draft/sent/paid/overdue).

## Security model (Row-Level Security)

RLS is enabled on every table. Policies use three `SECURITY DEFINER` helpers
that read the caller's own profile (so they don't recurse through RLS):

- `auth_user_role()` – the caller's role
- `auth_user_company()` – the caller's company (customers)
- `is_staff()` – true for employee/admin

Effective rules:

- **Customers** can read only rows belonging to their `company_id`
  (their companies, trips, trip locations, invoices).
- **Staff** (employee/admin) can read everything.
- Writes are intentionally not exposed to clients yet — operational data is
  managed server-side. Add `INSERT`/`UPDATE` policies when you build the
  back-office write flows.

A new `auth.users` row automatically gets a `profiles` row via the
`on_auth_user_created` trigger. `full_name` comes from user metadata, but
`role` / `company_id` are read **only from `raw_app_meta_data`** (which just
the service role can set). Client-supplied signup metadata can never grant
`employee`/`admin` — self-signups always land as a plain `customer`
(migration `0005_security_hardening.sql`).

Additional hardening:

- The RLS helper functions are not executable by `anon` (anonymous visitors
  only get the `track_shipment` RPC, which returns minimal data for an exact
  guía reference).
- `trip_latest_locations` is a `security_invoker` view (newest GPS point per
  trip) so clients and the Airtable sync fetch one row per trip instead of the
  whole breadcrumb history. RLS still applies through it.
- The web deploy sends a strict Content-Security-Policy and the usual
  hardening headers (see `vercel.json`); the theme bootstrap lives in
  `apps/web/public/theme-init.js` so no inline scripts are needed.
- Demo credentials only render on `/login` in dev builds (or when
  `VITE_DEMO_LOGIN=1`); production bundles contain no credentials.

Verified end-to-end: anonymous users see nothing; the Acme customer sees only
Acme's data; staff see all.

## Realtime tracking

The web client subscribes to `INSERT`s on `public.trip_locations`
(`packages/core/src/queries/locations.ts → subscribeToLocations`). Every new
point updates the marker on the live map without a page refresh. RLS applies to
realtime too, so customers only receive their own trips' points.

### Feeding real GPS data (replacing the simulator)

Today a `pg_cron` job (`ginqs-fleet-sim`, see
`supabase/migrations/0002_live_tracking_simulator.sql`) simulates movement. To
go live with real telemetry:

1. Unschedule the simulator: `select cron.unschedule('ginqs-fleet-sim');`
2. From your GPS source / telematics webhook, insert rows into
   `public.trip_locations` using the Supabase **service-role** key (server side
   only), e.g. one row per ping:

   ```sql
   insert into public.trip_locations (trip_id, lat, lon, speed_kph, heading)
   values ($1, $2, $3, $4, $5);
   ```

   A Supabase Edge Function is a good home for this webhook. No client or schema
   changes are needed — the map already reflects whatever lands in the table.

## Regenerating types

`packages/core/src/database.types.ts` is generated from the live schema. After a
schema change, regenerate it (Supabase MCP `generate_typescript_types`, or
`supabase gen types typescript --project-id kxxvqrkhiwowkxeszmsy`) and keep
`supabase/migrations/` in sync.

## Known follow-ups

- Enable Supabase **leaked-password protection** in Auth settings (dashboard
  toggle; can't be set via SQL).
- **Disable public email signups** in Auth settings if onboarding stays
  invite-only (today a self-signup only yields an unprivileged `customer`
  profile with no company, but there is no reason to leave the door open).
- Rotate/disable the seeded demo accounts before going live with real data.
- Add write policies + back-office screens for creating trips/invoices.
- Replace the mailto/WhatsApp quote form with a `leads` table or email
  function when a backend inbox exists.
- Optional: set a `SYNC_SECRET` on the `sync-airtable` Edge Function (and add
  the `x-sync-secret` header to the pg_cron job) so the public anon key alone
  can't trigger syncs.
- `pg_net` lives in the `public` schema (Supabase linter WARN). The extension
  doesn't support `SET SCHEMA`; accepted as-is — its callable surface is the
  `net` schema, not `public`.
