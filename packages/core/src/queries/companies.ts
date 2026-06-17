import type { AppSupabaseClient } from '../supabase'
import type { Company } from '../types'

/** Staff-only: every company the signed-in employee/admin can see (via RLS). */
export async function listCompanies(client: AppSupabaseClient): Promise<Company[]> {
  const { data, error } = await client
    .from('companies')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getCompany(
  client: AppSupabaseClient,
  companyId: string,
): Promise<Company | null> {
  const { data, error } = await client
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .maybeSingle()
  if (error) throw error
  return data ?? null
}
