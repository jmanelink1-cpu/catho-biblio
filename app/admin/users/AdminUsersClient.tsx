'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PLANS, type Profile, type PlanKey } from '@/lib/types'

interface Props { initialUsers: Profile[] }

export default function AdminUsersClient({ initialUsers }: Props) {
  const supabase = createClient()
  const [users,  setUsers]  = useState<Profile[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [modal,  setModal]  = useState(false)
  const [gEmail, setGEmail] = useState('')
  const [gPlan,  setGPlan]  = useState<PlanKey>('monthly')

  const filtered = users.filter(u =>
    !search || (u.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  async function toggleAccess(u: Profile) {
    const newVal = !u.has_access
    await supabase.from('profiles').update({ has_access: newVal }).eq('id', u.id)
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, has_access: newVal } : x))
  }

  async function grantAccess() {
    const user = users.find(u => u.email === gEmail.trim())
    if (!user) { alert('Utilisateur introuvable'); return }
    const plan    = PLANS[gPlan]
    const expires = plan.duration_days
      ? new Date(Date.now() + plan.duration_days * 86400000).toISOString()
      : null
    await supabase.from('profiles').update({
      has_access: true, access_type: gPlan, access_expires_at: expires,
    }).eq('id', user.id)
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, has_access: true, access_type: gPlan, access_expires_at: expires } : u))
    setModal(false)
  }

  const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'

  return (
    <div>
      <div className="h-14 flex items-center justify-between px-6 border-b"
           style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h1 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Utilisateurs</h1>
        <button onClick={() => setModal(true)}
                className="px-4 py-2 rounded-full font-semibold text-sm text-white"
                style={{ background: 'var(--color-brand)' }}>
          + Accès manuel
        </button>
      </div>

      <div className="p-6">
        <div className="rounded-2xl border overflow-hidden"
             style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="relative max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                   width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                   style={{ color: 'var(--color-muted-2)' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
                     className="w-full pl-9 pr-4 py-2 rounded-full border text-sm outline-none"
                     style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--color-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                  {['Nom','Email','Plan','Expire le','Accès','Inscrit le'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                        style={{ color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-ink)' }}>{u.full_name || '—'}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>{u.email || '—'}</td>
                    <td className="px-4 py-3">
                      {u.access_type
                        ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>
                            {u.access_type}
                          </span>
                        : <span style={{ color: 'var(--color-muted-2)' }}>—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>
                      {u.access_type === 'lifetime' ? '♾️ À vie' : fmt(u.access_expires_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleAccess(u)}
                              className="px-3 py-1 rounded-full text-xs font-bold transition-all"
                              style={u.has_access
                                ? { background: '#F0FDF4', color: '#16A34A' }
                                : { background: '#FEF2F2', color: '#DC2626' }}>
                        {u.has_access ? '✓ Actif' : '✗ Inactif'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>{fmt(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
             style={{ background: 'rgba(13,27,42,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden"
               style={{ background: 'var(--color-surface)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Accès manuel</h3>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ background: 'var(--color-subtle)', color: 'var(--color-muted)' }}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--color-ink-2)' }}>Email de l&apos;utilisateur</label>
                <input type="email" value={gEmail} onChange={e => setGEmail(e.target.value)} placeholder="utilisateur@exemple.com"
                       className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                       style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--color-ink-2)' }}>Plan</label>
                <select value={gPlan} onChange={e => setGPlan(e.target.value as PlanKey)}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                        style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }}>
                  <option value="monthly">Mensuel (30 jours)</option>
                  <option value="yearly">Annuel (365 jours)</option>
                  <option value="lifetime">À vie</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button onClick={() => setModal(false)} className="px-5 py-2.5 rounded-full text-sm font-semibold"
                      style={{ color: 'var(--color-muted)' }}>Annuler</button>
              <button onClick={grantAccess} className="px-6 py-2.5 rounded-full text-sm font-bold text-white"
                      style={{ background: 'var(--color-brand)' }}>Activer l&apos;accès</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
