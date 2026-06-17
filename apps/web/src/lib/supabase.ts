import { createSupabaseClient } from '@ginqs/core'
import { supabaseConfig } from '../config'

// Single shared browser client for the whole web app.
export const supabase = createSupabaseClient(supabaseConfig)
