'use client'

/** Champ de recherche réutilisable (admin). */
export default function SearchInput({ value, onChange, placeholder = 'Rechercher…', className = '' }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" fill="none"
           stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--color-muted-2)' }}>
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
             className="w-full pl-9 pr-4 py-2 rounded-full border text-sm outline-none"
             style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
    </div>
  )
}
