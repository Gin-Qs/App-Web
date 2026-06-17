# Fleeter — Soluciones Logísticas

B2B logistics platform for Fleeter: a public marketing site plus a secure,
role-aware customer/employee portal with **real-time cargo tracking**, invoicing
and credit-line visibility. Built as a monorepo so a future **iOS/Android app**
reuses the same backend and shared business logic.

```
App-Web/
├── apps/
│   └── web/            # React + Vite web app (public site + portal)
├── packages/
│   └── core/           # Shared, framework-agnostic TS: Supabase client,
│                       # types, data access, realtime tracking, formatting.
│                       # Reused by web today and the future Expo app.
├── supabase/
│   ├── migrations/     # SQL schema (source of truth, reproducible)
│   └── seed.sql        # Demo data + demo accounts
└── docs/               # Architecture & mobile roadmap
```

## Tech stack

| Layer            | Choice                                                        |
| ---------------- | ------------------------------------------------------------ |
| Web UI           | React 18 + Vite + TypeScript, React Router                   |
| Maps             | Leaflet + OpenStreetMap (no API key, free)                   |
| Backend          | Supabase — Postgres, Auth, Row-Level Security, Realtime      |
| Shared logic     | `@ginqs/core` workspace package (TS, no framework deps)      |
| Live tracking    | `trip_locations` table streamed over Supabase Realtime       |

The backend lives in the Supabase project **`ginqs-logistics`**
(`kxxvqrkhiwowkxeszmsy`, region `us-east-1`).

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev        # starts the web app at http://localhost:5173
```

The web app reads its Supabase connection from `apps/web/.env` (already filled
with the **public** anon key — safe to commit; all access is enforced by
Row-Level Security). For production overrides create `apps/web/.env.local`.

Other scripts:

```bash
npm run build      # typecheck + production build of the web app
npm run typecheck  # type-check only
```

## Demo accounts

Sign in at `/login` (the login page has one-click buttons for each).
Password for all three: **`Demo1234!`**

| Role     | Email                  | Sees                                             |
| -------- | ---------------------- | ------------------------------------------------ |
| Customer | `cliente@acmefoods.mx` | Only Acme Foods' cargo, trips, invoices, credit  |
| Employee | `ana@fleeter.mx`         | All customers, trips (live), invoices            |
| Admin    | `gabriel@fleeter.mx`     | Everything                                        |

## What's implemented

- **Public site** (`/`): hero, about, services, request-info form, with top-bar
  **Iniciar sesión** / **Solicitar información** actions.
- **Login** (`/login`): email + password via Supabase Auth, role detected from
  the user's profile.
- **Customer dashboard**: KPIs (active shipments, balance due, available
  credit), **live map** of their shipments, active shipments, past trips,
  current invoice, paid invoices.
- **Employee/admin dashboard**: KPIs (active trips, customers, receivables),
  **live map of the whole active fleet**, customers, in-progress trips with live
  location, invoices.
- **Trip detail** (`/app/trips/:id`): full-screen live map with breadcrumb
  trail, trip facts, and position history — updates in real time.
- **Security**: Postgres Row-Level Security scopes every query. Customers can
  only ever read their own company's rows; staff read all. Verified end-to-end.
- **Live movement**: a `pg_cron` job (`ginqs-fleet-sim`) advances in-transit
  trucks once a minute so the map moves. Replace it with real GPS telemetry by
  inserting into `public.trip_locations` (see `docs/ARCHITECTURE.md`).

## Future mobile app (iOS + Android)

Everything needed is already in place — see **[docs/MOBILE.md](docs/MOBILE.md)**.
In short: add `apps/mobile` (Expo / React Native), reuse `@ginqs/core` as-is, and
point it at the same Supabase project. No backend changes required.

See also **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for data model, RLS
design, and how to feed real tracking data.
