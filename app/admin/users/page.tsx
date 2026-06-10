import { createClient } from '@/lib/supabase/server'
import AdminUsersClient, { type UserRow } from './AdminUsersClient'

export const dynamic = 'force-dynamic'

type Order = { email: string | null; first_name: string | null; last_name: string | null; country: string | null; created_at: string }

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const [{ data: usersData }, { data: ordersData }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('orders').select('email, first_name, last_name, country, created_at').order('created_at', { ascending: false }),
  ])

  const profiles = usersData ?? []
  const orders   = (ordersData ?? []) as Order[]

  // Latest country per email (orders already sorted desc)
  const countryByEmail: Record<string, string> = {}
  for (const o of orders) {
    const e = (o.email ?? '').toLowerCase()
    if (e && o.country && !countryByEmail[e]) countryByEmail[e] = o.country
  }

  const profileEmails = new Set(profiles.map(p => (p.email ?? '').toLowerCase()))

  // Registered users
  const rows: UserRow[] = profiles.map(p => ({
    id: p.id,
    full_name: p.full_name,
    email: p.email,
    country: countryByEmail[(p.email ?? '').toLowerCase()] ?? null,
    has_access: !!p.has_access,
    banned: !!p.banned,
    created_at: p.created_at,
    isLead: false,
  }))

  // Checkout leads without an account yet (dedup by email)
  const seenLead = new Set<string>()
  for (const o of orders) {
    const e = (o.email ?? '').toLowerCase()
    if (!e || profileEmails.has(e) || seenLead.has(e)) continue
    seenLead.add(e)
    rows.push({
      id: null,
      full_name: [o.first_name, o.last_name].filter(Boolean).join(' ') || null,
      email: o.email,
      country: o.country,
      has_access: false,
      banned: false,
      created_at: o.created_at,
      isLead: true,
    })
  }

  // Top countries (from all orders)
  const cmap: Record<string, number> = {}
  orders.forEach(o => { if (o.country) cmap[o.country] = (cmap[o.country] ?? 0) + 1 })
  const topCountries = Object.entries(cmap).map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count).slice(0, 8)

  return <AdminUsersClient initialUsers={rows} topCountries={topCountries} />
}
