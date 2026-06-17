# Mobile roadmap (iOS + Android)

The project is structured so the mobile app is **additive** — no backend or
schema changes are required. You reuse the same Supabase project and the same
`@ginqs/core` package the web app already uses.

## Why it's easy from here

- **Backend is shared and platform-neutral.** Supabase (Postgres + Auth +
  Realtime) is consumed over HTTPS/WebSocket, identically from web and native.
- **Business logic already lives in `@ginqs/core`.** Auth, queries, realtime
  subscriptions, types and formatting are framework-agnostic — they import only
  `@supabase/supabase-js`, which runs fine in React Native.
- **The client factory already accepts a storage adapter.**
  `createSupabaseClient({ url, anonKey, storage })` — pass `AsyncStorage` on
  React Native; that's the only platform-specific wiring for auth.

## Recommended approach: Expo (React Native)

1. **Scaffold** a new workspace app:

   ```bash
   npx create-expo-app apps/mobile
   ```

   Add it to the root `package.json` `workspaces` (already `apps/*`).

2. **Reuse the core package.** In `apps/mobile/package.json` add
   `"@ginqs/core": "*"` and configure Metro to resolve the workspace + its TS
   source (mirror what `apps/web/vite.config.ts` does with the alias).

3. **Create the client** with React Native storage:

   ```ts
   import AsyncStorage from '@react-native-async-storage/async-storage'
   import { createSupabaseClient } from '@ginqs/core'

   export const supabase = createSupabaseClient({
     url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
     anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
     storage: AsyncStorage,
   })
   ```

4. **Build screens** that call the same functions the web app uses
   (`signInWithPassword`, `listActiveTripsWithPositions`, `listInvoices`,
   `subscribeToLocations`, …). Only the presentation layer is new.

5. **Maps:** use `react-native-maps` (Google/Apple native maps) or
   `@maplibre/maplibre-react-native` with OpenStreetMap tiles to match the web's
   free, key-less setup.

6. **Native device GPS (optional):** if drivers use the app, stream their
   position with `expo-location` to a server endpoint that writes to
   `public.trip_locations` (service-role key, server side) — see
   `docs/ARCHITECTURE.md`.

## What stays the same

- Database schema, RLS policies, demo accounts.
- `@ginqs/core` — imported as-is.
- Supabase project, URL, and anon key.

## Suggested end-state layout

```
apps/
├── web/        # React + Vite (this repo)
└── mobile/     # Expo / React Native (future)
packages/
└── core/       # shared — imported by BOTH apps
```
