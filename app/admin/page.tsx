import { createClient } from '@/lib/supabase/server'
import { Icon as I } from '@/components/Icons'
import StatFilters from './StatFilters'
import { StatCard } from '@/components/ui/Card'
import type { ComponentType } from 'react'

export const dynamic = 'force-dynamic'

type Prof = { created_at: string; email: string | null; has_access: boolean | null; access_type: string | null; is_admin: boolean | null }
type Pay  = { amount: number | null; status: string | null; created_at: string }

const DAY = 86400000
const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
const fmtDay   = (d: Date) => d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
const fmtMonth = (d: Date) => d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })

function Ic({ icon, size = 18 }: { icon: ComponentType<{ width?: number; height?: number }>; size?: number }) {
  const C = icon
  return <span style={{ display: 'inline-flex', width: size, height: size }}><C width={size} height={size} /></span>
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: totalBooks }, { data: profilesRaw }, { data: paymentsRaw }, { data: ordersRaw }] = await Promise.all([
    supabase.from('books').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('created_at, email, has_access, access_type, is_admin').order('created_at', { ascending: false }),
    supabase.from('payments').select('amount, status, created_at'),
    supabase.from('orders').select('country, created_at'),
  ])

  const profiles = (profilesRaw ?? []) as Prof[]
  const payments = (paymentsRaw ?? []) as Pay[]
  const orders   = (ordersRaw ?? []) as { country: string | null; created_at: string }[]

  const totalUsers  = profiles.length
  const activeUsers = profiles.filter(p => p.has_access).length
  const revenue     = payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount ?? 0), 0)

  const paymentCounts = {
    completed: payments.filter(p => p.status === 'completed').length,
    pending:   payments.filter(p => p.status === 'pending').length,
    failed:    payments.filter(p => p.status === 'failed').length,
    total:     payments.length,
  }

  const now      = new Date()
  const today0   = startOfDay(now).getTime()
  const week0    = today0 - 6 * DAY
  const month0   = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

  const signupsToday = profiles.filter(p => new Date(p.created_at).getTime() >= today0).length
  const signupsWeek  = profiles.filter(p => new Date(p.created_at).getTime() >= week0).length
  const signupsMonth = profiles.filter(p => new Date(p.created_at).getTime() >= month0).length

  // Top pays (depuis les commandes / checkout)
  const countryMap: Record<string, number> = {}
  orders.forEach(o => { if (o.country) countryMap[o.country] = (countryMap[o.country] ?? 0) + 1 })
  const topCountries = Object.entries(countryMap).map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count).slice(0, 6)
  const topMax = Math.max(1, ...topCountries.map(c => c.count))

  const daily: { label: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d0 = today0 - i * DAY
    const count = profiles.filter(p => { const t = new Date(p.created_at).getTime(); return t >= d0 && t < d0 + DAY }).length
    daily.push({ label: fmtDay(new Date(d0)), count })
  }
  const dailyMax = Math.max(1, ...daily.map(d => d.count))

  const monthly: { label: string; count: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d  = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const d2 = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const count = profiles.filter(p => { const t = new Date(p.created_at).getTime(); return t >= d.getTime() && t < d2.getTime() }).length
    monthly.push({ label: fmtMonth(d), count })
  }
  const monthlyMax = Math.max(1, ...monthly.map(m => m.count))

  const recent = profiles.slice(0, 8)

  const kpis = [
    { icon: I.Book,  label: 'Livres',        value: (totalBooks ?? 0).toLocaleString('fr-FR'), bg: 'var(--color-brand-soft)', fg: 'var(--color-brand)' },
    { icon: I.Users, label: 'Utilisateurs',  value: totalUsers.toLocaleString('fr-FR'),        bg: '#EEF6FF', fg: '#2563EB' },
    { icon: I.Check, label: 'Accès actifs',   value: activeUsers.toLocaleString('fr-FR'),        bg: '#F0FDF4', fg: '#16A34A' },
    { icon: I.Money, label: 'Revenus (FCFA)', value: revenue.toLocaleString('fr-FR'),            bg: 'var(--color-gold-soft)', fg: 'var(--color-gold)' },
  ]

  const links: [string, ComponentType<{ width?: number; height?: number }>, string][] = [
    ['/admin/books',     I.Book,  'Gérer les livres'],
    ['/admin/users',     I.Users, 'Gérer les utilisateurs'],
    ['/admin/payments',  I.Card,  'Voir les paiements'],
    ['/admin/marketing', I.Mega,  'Marketing'],
    ['/library',         I.Home,  'Ma bibliothèque'],
  ]

  return (
    <div>
      <div className="h-14 flex items-center justify-between px-6 border-b"
           style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h1 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Tableau de bord</h1>
        <a href="/library" className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: 'var(--color-brand)', color: '#fff' }}>
          <Ic icon={I.Home} size={14} /> Ma bibliothèque
        </a>
      </div>

      <div className="p-6 space-y-6">

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(s => <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} bg={s.bg} fg={s.fg} />)}
        </div>

        {/* Filterable stats: signups + payments */}
        <StatFilters
          signups={{ today: signupsToday, week: signupsWeek, month: signupsMonth, total: totalUsers }}
          payments={paymentCounts}
        />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Inscriptions — 30 derniers jours</h3>
            <p className="text-xs mb-5" style={{ color: 'var(--color-muted)' }}>{signupsMonth} ce mois-ci</p>
            <div className="flex items-end gap-1" style={{ height: 140 }}>
              {daily.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end items-center" title={`${d.label} : ${d.count}`}>
                  <div style={{ width: '100%', height: `${(d.count / dailyMax) * 100}%`, minHeight: d.count > 0 ? 4 : 1,
                    background: d.count > 0 ? 'var(--color-brand)' : 'var(--color-border)', borderRadius: '3px 3px 0 0' }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px]" style={{ color: 'var(--color-muted-2)' }}>
              <span>{daily[0]?.label}</span><span>{daily[Math.floor(daily.length / 2)]?.label}</span><span>{daily[daily.length - 1]?.label}</span>
            </div>
          </div>

          <div className="rounded-2xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-bold mb-5" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Par mois</h3>
            <div className="space-y-3">
              {monthly.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs w-14 flex-shrink-0" style={{ color: 'var(--color-muted)' }}>{m.label}</span>
                  <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'var(--color-subtle)' }}>
                    <div style={{ width: `${(m.count / monthlyMax) * 100}%`, height: '100%', background: 'var(--color-gold)', borderRadius: 999, minWidth: m.count > 0 ? 8 : 0 }} />
                  </div>
                  <span className="text-xs font-bold w-6 text-right" style={{ color: 'var(--color-ink)' }}>{m.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent users + quick links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Derniers inscrits</h3>
              <a href="/admin/users" className="text-xs font-semibold" style={{ color: 'var(--color-brand)' }}>Tout voir →</a>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Aucun utilisateur pour le moment.</p>
            ) : (
              <div className="space-y-1">
                {recent.map((u, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl" style={{ borderBottom: i < recent.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>{u.email ?? '—'}</div>
                      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{new Date(u.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-3"
                          style={u.has_access ? { background: '#F0FDF4', color: '#16A34A' } : { background: 'var(--color-subtle)', color: 'var(--color-muted)' }}>
                      {u.has_access ? 'Accès' : 'Sans accès'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top pays */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Top pays</h3>
            {topCountries.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Aucune donnée pays pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {topCountries.map(c => (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-xs flex-shrink-0" style={{ width: 90, color: 'var(--color-ink)' }}>{c.country}</span>
                    <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'var(--color-subtle)' }}>
                      <div style={{ width: `${(c.count / topMax) * 100}%`, height: '100%', background: 'var(--color-brand)', borderRadius: 999 }} />
                    </div>
                    <span className="text-xs font-bold w-6 text-right" style={{ color: 'var(--color-ink)' }}>{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Accès rapides</h3>
            <div className="space-y-2">
              {links.map(([href, icon, title]) => (
                <a key={href} href={href} className="flex items-center gap-3 p-3 rounded-xl transition-all border" style={{ borderColor: 'var(--color-border)' }}>
                  <span style={{ color: 'var(--color-brand)' }}><Ic icon={icon} size={18} /></span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
