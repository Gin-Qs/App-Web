/**
 * Demo login helpers, shown on /login ONLY when demo mode is on:
 *  - always in `npm run dev`
 *  - in a deployed build only if it was built with VITE_DEMO_LOGIN=1
 *
 * In a regular production build both flags fold to `false` at compile time,
 * so the accounts below (and their password) are tree-shaken out of the
 * shipped bundle — no credentials reach visitors' browsers.
 *
 * The accounts themselves are created by supabase/seed.sql. Before going
 * live with real data, rotate their passwords or delete them outright.
 */
export const DEMO_LOGIN_ENABLED: boolean =
  import.meta.env.DEV || import.meta.env.VITE_DEMO_LOGIN === '1'

export const DEMO_ACCOUNTS = [
  { label: 'Cliente (Acme Foods)', email: 'cliente@acmefoods.mx', role: 'customer' },
  { label: 'Empleada (Ana)', email: 'ana@fleeter.mx', role: 'employee' },
  { label: 'Admin (Gabriel)', email: 'gabriel@fleeter.mx', role: 'admin' },
] as const

export const DEMO_PASSWORD = 'Demo1234!'
