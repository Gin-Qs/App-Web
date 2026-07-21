import type { SupabaseConfig } from '@ginqs/core'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in apps/web/.env',
  )
}

export const supabaseConfig: SupabaseConfig = { url, anonKey }
