import { createClient } from '@/lib/supabase/server'
import AdminPaymentsClient from './AdminPaymentsClient'
import type { Payment } from '@/lib/types'

export default async function AdminPaymentsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('payments')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(200)
  return <AdminPaymentsClient initialPayments={(data ?? []) as Payment[]} />
}
