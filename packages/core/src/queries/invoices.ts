import type { AppSupabaseClient } from '../supabase'
import { OPEN_INVOICE_STATUSES, type Invoice, type InvoiceStatus } from '../types'

export interface ListInvoicesOptions {
  statuses?: InvoiceStatus[]
  companyId?: string
}

/**
 * Lists invoices visible to the signed-in user (RLS scopes customers to their
 * own company; staff see all).
 */
export async function listInvoices(
  client: AppSupabaseClient,
  options: ListInvoicesOptions = {},
): Promise<Invoice[]> {
  let query = client.from('invoices').select('*')
  if (options.statuses?.length) query = query.in('status', options.statuses)
  if (options.companyId) query = query.eq('company_id', options.companyId)

  const { data, error } = await query.order('issued_at', {
    ascending: false,
    nullsFirst: false,
  })
  if (error) throw error
  return data ?? []
}

/** Open balance (draft / sent / overdue) invoices. */
export function listOpenInvoices(client: AppSupabaseClient, companyId?: string) {
  return listInvoices(client, { statuses: OPEN_INVOICE_STATUSES, companyId })
}

export function listPaidInvoices(client: AppSupabaseClient, companyId?: string) {
  return listInvoices(client, { statuses: ['paid'], companyId })
}

/** Sum of outstanding (unpaid) invoice amounts for a set of invoices. */
export function outstandingBalance(invoices: Invoice[]): number {
  return invoices
    .filter((i) => i.status !== 'paid')
    .reduce((sum, i) => sum + Number(i.amount), 0)
}
