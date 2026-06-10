'use client'

import type { ReactNode } from 'react'

/** Fenêtre modale réutilisable (overlay + carte + en-tête + pied optionnel). */
export default function Modal({ open, onClose, title, children, footer, maxWidth = 480 }: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  maxWidth?: number
}) {
  if (!open) return null
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-5"
         style={{ background: 'rgba(13,27,42,0.6)', backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} className="w-full rounded-2xl overflow-hidden"
           style={{ maxWidth, background: 'var(--color-surface)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>{title}</h3>
          <button onClick={onClose} aria-label="Fermer" className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ background: 'var(--color-subtle)', color: 'var(--color-muted)' }}>✕</button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex gap-3 justify-end px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>{footer}</div>
        )}
      </div>
    </div>
  )
}
