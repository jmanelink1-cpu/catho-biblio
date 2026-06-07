'use client'

import { useState } from 'react'
import { Icon as I } from '@/components/Icons'

interface Props {
  signups:  { today: number; week: number; month: number; total: number }
  payments: { completed: number; pending: number; failed: number; total: number }
}

const card = { background: 'var(--color-surface)', borderColor: 'var(--color-border)' } as const

function FilterCard({ title, icon, options }: {
  title: string
  icon: React.ReactNode
  options: { key: string; label: string; value: number }[]
}) {
  const [active, setActive] = useState(options[0].key)
  const current = options.find(o => o.key === active) ?? options[0]
  return (
    <div className="rounded-2xl border p-5" style={card}>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: 'var(--color-brand)' }}>{icon}</span>
        <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>{title}</h3>
      </div>
      <div className="text-3xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
        {current.value.toLocaleString('fr-FR')}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => {
          const on = o.key === active
          return (
            <button key={o.key} onClick={() => setActive(o.key)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all"
              style={on
                ? { background: 'var(--color-brand)', color: '#fff' }
                : { background: 'var(--color-subtle)', color: 'var(--color-muted)' }}>
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function StatFilters({ signups, payments }: Props) {
  const ic = (C: React.ComponentType<{ width?: number; height?: number }>) =>
    <span style={{ display: 'inline-flex', width: 18, height: 18 }}><C width={18} height={18} /></span>
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <FilterCard
        title="Inscriptions" icon={ic(I.Users)}
        options={[
          { key: 'today', label: "Aujourd'hui", value: signups.today },
          { key: 'week',  label: '7 jours',     value: signups.week },
          { key: 'month', label: '30 jours',    value: signups.month },
          { key: 'total', label: 'Total',       value: signups.total },
        ]}
      />
      <FilterCard
        title="Paiements" icon={ic(I.Card)}
        options={[
          { key: 'completed', label: 'Réussis',    value: payments.completed },
          { key: 'pending',   label: 'En attente', value: payments.pending },
          { key: 'failed',    label: 'Échoués',    value: payments.failed },
          { key: 'total',     label: 'Total',      value: payments.total },
        ]}
      />
    </div>
  )
}
