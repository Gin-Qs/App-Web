import type { AppSupabaseClient } from '../supabase'
import type { ProfileWithCompany } from '../types'

export async function signInWithPassword(
  client: AppSupabaseClient,
  email: string,
  password: string,
) {
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut(client: AppSupabaseClient) {
  const { error } = await client.auth.signOut()
  if (error) throw error
}

/**
 * Loads the signed-in user's profile together with their company (customers
 * only). Returns null when there is no authenticated session.
 */
export async function getCurrentProfile(
  client: AppSupabaseClient,
): Promise<ProfileWithCompany | null> {
  const {
    data: { user },
  } = await client.auth.getUser()
  if (!user) return null

  const { data, error } = await client
    .from('profiles')
    .select('*, company:companies(*)')
    .eq('id', user.id)
    .maybeSingle()

  if (error) throw error
  return (data as ProfileWithCompany) ?? null
}
