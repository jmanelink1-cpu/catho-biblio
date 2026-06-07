import { createClient } from '@/lib/supabase/server'
import AdminPaymentsClient from './AdminPaymentsClient'
import type { Payment } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminPaymentsPage() {
  const supabase = await createClient()

  // Avoid the embedded FK join (which fails if no relationship is defined) —
  // fetch payments, then enrich with profile info separately.
  const { data: paymentsData } = await (supabase as any)
    .from('payments').select('*').order('created_at', { ascending: false }).limit(200)
  const payments = (paymentsData ?? []) as Payment[]

  const ids = [...new Set(payments.map(p => p.user_id).filter(Boolean))] as string[]
  let profMap: Record<string, { full_name: string | null; email: string | null }> = {}
  if (ids.length) {
    const { data: profs } = await (supabase as any).from('profiles').select('id, full_name, email').in('id', ids)
    profMap = Object.fromEntries((profs ?? []).map((p: any) => [p.id, { full_name: p.full_name, email: p.email }]))
  }

  const enriched = payments.map(p => ({ ...p, profiles: p.user_id ? profMap[p.user_id] : undefined }))

  return <AdminPaymentsClient initialPayments={enriched as Payment[]} />
}
