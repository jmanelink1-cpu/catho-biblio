import { createClient } from '@/lib/supabase/server'
import { SINGLE_PLAN } from '@/lib/types'
import MarketingClient from './MarketingClient'

export const dynamic = 'force-dynamic'

type Pay = { amount: number | null; status: string | null; created_at: string }
type Code = { id: string; code: string; discount_percent: number; max_uses: number | null; uses: number; active: boolean; created_at: string }

const fmtMonth = (d: Date) => d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })

export default async function MarketingPage() {
  const supabase = await createClient()

  const [{ count: totalUsers }, { count: paidUsers }, { data: paymentsRaw }, codesRes] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('has_access', true),
    supabase.from('payments').select('amount, status, created_at'),
    supabase.from('promo_codes').select('*').order('created_at', { ascending: false }),
  ])

  const payments = (paymentsRaw ?? []) as Pay[]
  const completed = payments.filter(p => p.status === 'completed')
  const revenue = completed.reduce((s, p) => s + (p.amount ?? 0), 0)

  const users = totalUsers ?? 0
  const paid  = paidUsers ?? 0
  const conversion = users > 0 ? (paid / users) * 100 : 0

  // Monthly revenue — last 6 months
  const now = new Date()
  const monthlyRevenue: { label: string; amount: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d  = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const d2 = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const amount = completed.filter(p => { const t = new Date(p.created_at).getTime(); return t >= d.getTime() && t < d2.getTime() }).reduce((s, p) => s + (p.amount ?? 0), 0)
    monthlyRevenue.push({ label: fmtMonth(d), amount })
  }

  // promo_codes table may not exist yet — detect gracefully
  const codesMissing = !!codesRes.error
  const codes = (codesRes.data ?? []) as Code[]

  return (
    <MarketingClient
      stats={{ users, paid, conversion, revenue, price: SINGLE_PLAN.price }}
      monthlyRevenue={monthlyRevenue}
      codes={codes}
      codesMissing={codesMissing}
    />
  )
}
