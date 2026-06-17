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
`on_auth_user_created` trigger, reading `full_name` / `role` / `company_id`
from the user's metadata.

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

- Code-split the web bundle (currently a single ~550 kB chunk).
- Enable Supabase **leaked-password protection** in Auth settings.
- Add write policies + back-office screens for creating trips/invoices.
- Wire the landing "request info" form to a `leads` table or email function.
