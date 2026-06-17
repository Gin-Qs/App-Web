import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export type AppSupabaseClient = SupabaseClient<Database>

export interface SupabaseConfig {
  url: string
  anonKey: string
  /**
   * Optional storage adapter for the auth session.
   * - Web: leave undefined (defaults to localStorage).
   * - React Native (future mobile app): pass AsyncStorage here.
   */
  storage?: {
    getItem: (key: string) => Promise<string | null> | string | null
    setItem: (key: string, value: string) => Promise<void> | void
    removeItem: (key: string) => Promise<void> | void
  }
}

/**
 * Creates a typed Supabase client. The exact same factory is used by the web
 * app today and will be reused by the future Expo (iOS/Android) app — only the
 * `storage` adapter differs between platforms.
 */
export function createSupabaseClient(config: SupabaseConfig): AppSupabaseClient {
  return createClient<Database>(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      ...(config.storage ? { storage: config.storage } : {}),
    },
  })
}
