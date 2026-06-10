'use client'

import { useState } from 'react'
import { usersService } from '@/lib/services/users'
import { Icon as Ico } from '@/components/Icons'
import SearchInput from '@/components/ui/SearchInput'

export type UserRow = {
  id: string | null
  full_name: string | null
  email: string | null
  country: string | null
  has_access: boolean
  banned: boolean
  created_at: string
  isLead: boolean
}

interface Props {
  initialUsers: UserRow[]
  topCountries: { country: string; count: number }[]
}

export default function AdminUsersClient({ initialUsers, topCountries }: Props) {
  const [users,  setUsers]  = useState<UserRow[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [modal,  setModal]  = useState(false)
  const [gEmail, setGEmail] = useState('')
  const [menuFor, setMenuFor] = useState<string | null>(null)

  const filtered = users.filter(u =>
    !search ||
    (u.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (u.country ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const topMax = Math.max(1, ...topCountries.map(c => c.count))

  async function toggleAccess(u: UserRow) {
    if (!u.id) return
    const newVal = !u.has_access
    await usersService.setAccess(u.id, newVal)
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, has_access: newVal } : x))
  }

  async function grantAccess() {
    const user = users.find(u => u.email === gEmail.trim() && u.id)
    if (!user || !user.id) { alert('Utilisateur introuvable (le compte doit exister).'); return }
    await usersService.grantLifetime(user.id)
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, has_access: true } : u))
    setModal(false)
  }

  // Bloquer / débloquer : bannir coupe aussi l'accès immédiatement
  async function toggleBan(u: UserRow) {
    if (!u.id) return
    const newBan = !u.banned
    await usersService.setBanned(u.id, newBan)
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, banned: newBan, has_access: newBan ? false : x.has_access } : x))
  }

  async function deleteUser(u: UserRow) {
    if (!u.id) return
    if (!confirm(`Supprimer définitivement le compte de ${u.email} ? Cette action est irréversible.`)) return
    const { error } = await usersService.remove(u.id)
    if (error) { alert('Erreur : ' + error.message); return }
    setUsers(prev => prev.filter(x => x.id !== u.id))
  }

  const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <div>
      <div className="h-14 flex items-center justify-between px-6 border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h1 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Utilisateurs</h1>
        <button onClick={() => setModal(true)} className="px-4 py-2 rounded-full font-semibold text-sm text-white" style={{ background: 'var(--color-brand)' }}>
          + Accès manuel
        </button>
      </div>

      <div className="p-6 space-y-6">

        {/* Top pays */}
        <div className="rounded-2xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Pays d&apos;origine des utilisateurs</h3>
          {topCountries.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Aucune donnée pays pour le moment (collectée au moment du checkout).</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {topCountries.map(c => (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-xs flex-shrink-0" style={{ width: 110, color: 'var(--color-ink)' }}>{c.country}</span>
                  <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'var(--color-subtle)' }}>
                    <div style={{ width: `${(c.count / topMax) * 100}%`, height: '100%', background: 'var(--color-brand)', borderRadius: 999 }} />
                  </div>
                  <span className="text-xs font-bold w-6 text-right" style={{ color: 'var(--color-ink)' }}>{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <SearchInput value={search} onChange={setSearch} placeholder="Rechercher (nom, email, pays)…" className="max-w-xs" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--color-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                  {['Nom', 'Email', 'Pays', 'Statut', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={(u.id ?? 'lead') + i} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-ink)' }}>{u.full_name || '—'}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>{u.email || '—'}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-ink)' }}>{u.country || '—'}</td>
                    <td className="px-4 py-3">
                      {u.isLead ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--color-gold-soft)', color: 'var(--color-gold)' }}>Prospect</span>
                      ) : u.banned ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#FEF2F2', color: '#DC2626' }}>Bloqué</span>
                      ) : (
                        <button onClick={() => toggleAccess(u)} className="px-3 py-1 rounded-full text-xs font-bold transition-all"
                                style={u.has_access ? { background: '#F0FDF4', color: '#16A34A' } : { background: 'var(--color-subtle)', color: 'var(--color-muted)' }}>
                          {u.has_access ? '✓ Accès' : '✗ Sans accès'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>{fmt(u.created_at)}</td>
                    <td className="px-4 py-3" style={{ position: 'relative' }}>
                      {!u.isLead && (
                        <>
                          <button onClick={() => setMenuFor(menuFor === u.id ? null : u.id)} aria-label="Actions"
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ color: 'var(--color-muted)', background: menuFor === u.id ? 'var(--color-subtle)' : 'transparent' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>
                          </button>
                          {menuFor === u.id && (
                            <>
                              <div onClick={() => setMenuFor(null)} style={{ position: 'fixed', inset: 0, zIndex: 20 }} />
                              <div style={{ position: 'absolute', right: 12, top: '100%', zIndex: 30, minWidth: 170, padding: 6, borderRadius: 12, background: '#fff', border: '1px solid var(--color-border)', boxShadow: '0 14px 36px rgba(0,0,0,.16)' }}>
                                <button onClick={() => { toggleBan(u); setMenuFor(null) }}
                                        className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-left"
                                        style={{ color: u.banned ? '#16A34A' : '#B45309' }}>
                                  {u.banned ? 'Débloquer le compte' : 'Bloquer le compte'}
                                </button>
                                <button onClick={() => { deleteUser(u); setMenuFor(null) }}
                                        className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-left"
                                        style={{ color: '#DC2626' }}>
                                  <span style={{ display: 'inline-flex', width: 15, height: 15 }}><Ico.Trash width={15} height={15} /></span> Supprimer le compte
                                </button>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--color-muted)' }}>Aucun utilisateur.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background: 'rgba(13,27,42,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: 'var(--color-surface)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Accès manuel</h3>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'var(--color-subtle)', color: 'var(--color-muted)' }}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Accordez l&apos;accès à vie à un compte existant (par son email).</p>
              <div>
                <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--color-ink-2)' }}>Email de l&apos;utilisateur</label>
                <input type="email" value={gEmail} onChange={e => setGEmail(e.target.value)} placeholder="utilisateur@exemple.com"
                       className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                       style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
              </div>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button onClick={() => setModal(false)} className="px-5 py-2.5 rounded-full text-sm font-semibold" style={{ color: 'var(--color-muted)' }}>Annuler</button>
              <button onClick={grantAccess} className="px-6 py-2.5 rounded-full text-sm font-bold text-white" style={{ background: 'var(--color-brand)' }}>Activer l&apos;accès</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
