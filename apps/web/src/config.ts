import type { SupabaseConfig } from '@ginqs/core'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in apps/web/.env',
  )
}

export const supabaseConfig: SupabaseConfig = { url, anonKey }

// Demo accounts seeded in the database (password is the same for all three).
export const DEMO_ACCOUNTS = [
  { label: 'Cliente (Acme Foods)', email: 'cliente@acmefoods.mx', role: 'customer' },
  { label: 'Empleada (Ana)', email: 'ana@fleeter.mx', role: 'employee' },
  { label: 'Admin (Gabriel)', email: 'gabriel@fleeter.mx', role: 'admin' },
] as const

export const DEMO_PASSWORD = 'Demo1234!'
