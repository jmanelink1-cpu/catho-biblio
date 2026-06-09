'use client'

import { useState } from 'react'
import { paymentsService } from '@/lib/services/payments'
import { usersService } from '@/lib/services/users'
import { type Payment } from '@/lib/types'

interface Props { initialPayments: Payment[] }

export default function AdminPaymentsClient({ initialPayments }: Props) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments)

  const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })

  async function markCompleted(p: Payment) {
    await paymentsService.complete(p.id)
    if (p.user_id) await usersService.grantLifetime(p.user_id)
    setPayments(prev => prev.map(x => x.id === p.id ? { ...x, status: 'completed' } : x))
  }

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount ?? 0), 0)

  const statusStyle = (s: string) => {
    if (s === 'completed') return { background: '#F0FDF4', color: '#16A34A' }
    if (s === 'failed')    return { background: '#FEF2F2', color: '#DC2626' }
    return { background: '#FFFBEB', color: '#D97706' }
  }

  return (
    <div>
      <div className="h-14 flex items-center justify-between px-6 border-b"
           style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h1 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Paiements</h1>
        <div className="text-sm font-semibold" style={{ color: 'var(--color-brand)' }}>
          Revenus totaux : {totalRevenue.toLocaleString('fr-FR')} FCFA
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-2xl border overflow-hidden"
             style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--color-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                  {['Date','Utilisateur','Plan','Montant','Méthode','Statut','Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                        style={{ color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
                    Aucun paiement enregistré.
                  </td></tr>
                )}
                {payments.map(p => (
                  <tr key={p.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>{fmt(p.created_at)}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>
                      {p.profiles?.email || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {p.plan && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>
                          {p.plan}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-ink)' }}>
                      {(p.amount ?? 0).toLocaleString('fr-FR')} {p.currency}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>{p.payment_method || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={statusStyle(p.status)}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.status === 'pending' && (
                        <button onClick={() => markCompleted(p)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold"
                                style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>
                          ✓ Valider
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
