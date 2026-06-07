import type { ReactNode, CSSProperties, ComponentType } from 'react'

type IconC = ComponentType<{ width?: number; height?: number }>

/** Reusable surface panel used across the admin. */
export function Card({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-2xl border p-6 ${className}`}
         style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', ...style }}>
      {children}
    </div>
  )
}

/** Reusable KPI card: icon chip + value + label. */
export function StatCard({ icon, label, value, bg, fg }: {
  icon: IconC; label: string; value: string | number; bg: string; fg: string
}) {
  const C = icon
  return (
    <div className="rounded-2xl border p-5 flex items-start gap-4"
         style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg, color: fg }}>
        <span style={{ display: 'inline-flex', width: 20, height: 20 }}><C width={20} height={20} /></span>
      </div>
      <div>
        <div className="text-2xl font-extrabold leading-none mb-1" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>{value}</div>
        <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{label}</div>
      </div>
    </div>
  )
}
