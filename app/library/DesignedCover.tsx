'use client'

import type { BookCategory } from '@/lib/types'

/**
 * DesignedCover — generates an elegant, classic Catholic book cover
 * from a title + category, so the library always looks premium even
 * when a book has no uploaded cover image.
 */

type Theme = { from: string; to: string; ink: string; accent: string }

const THEMES: Record<string, Theme> = {
  bible:        { from: '#4C1D95', to: '#6D28D9', ink: '#fff',    accent: '#FCD34D' },
  catechisme:   { from: '#3B0764', to: '#7C3AED', ink: '#fff',    accent: '#FCD34D' },
  saints:       { from: '#78350F', to: '#B45309', ink: '#FFF7ED', accent: '#FDE68A' },
  spiritualite: { from: '#5B21B6', to: '#8B5CF6', ink: '#fff',    accent: '#FDE68A' },
  theologie:    { from: '#1E1B4B', to: '#4338CA', ink: '#fff',    accent: '#FCD34D' },
  liturgie:     { from: '#7F1D1D', to: '#B91C1C', ink: '#FEF2F2', accent: '#FDE68A' },
  priere:       { from: '#312E81', to: '#6366F1', ink: '#fff',    accent: '#FDE68A' },
  papes:        { from: '#713F12', to: '#A16207', ink: '#FFFBEB', accent: '#FEF08A' },
  jeunesse:     { from: '#065F46', to: '#10B981', ink: '#fff',    accent: '#FDE68A' },
  famille:      { from: '#9D174D', to: '#DB2777', ink: '#fff',    accent: '#FDE68A' },
}
const DEFAULT_THEME: Theme = { from: '#4C1D95', to: '#6D28D9', ink: '#fff', accent: '#FCD34D' }

// A small cross emblem drawn inline
function Emblem({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="21" stroke={color} strokeWidth="1.4" opacity=".55" />
      <path d="M24 11v26M14 21h20" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="24" cy="21" r="3.4" stroke={color} strokeWidth="1.6" fill="none" />
    </svg>
  )
}

export default function DesignedCover({
  title, author, category,
}: { title: string; author?: string | null; category?: BookCategory | string | null }) {
  const t = THEMES[(category as string) ?? ''] ?? DEFAULT_THEME

  return (
    <div
      style={{
        position: 'relative', width: '100%', height: '100%',
        background: `linear-gradient(150deg, ${t.from} 0%, ${t.to} 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between', padding: '16px 14px 14px',
        overflow: 'hidden',
      }}
    >
      {/* Spine highlight */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: 'linear-gradient(90deg, rgba(0,0,0,.28), transparent)' }} />
      {/* Subtle vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,.10), transparent 60%)', pointerEvents: 'none' }} />

      {/* Top emblem + decorative rule */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
        <Emblem color={t.accent} />
        <div style={{ width: 26, height: 2, background: t.accent, opacity: .8, borderRadius: 2 }} />
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <div style={{
          fontFamily: "'Sora', serif", fontWeight: 700, color: t.ink,
          fontSize: '.82rem', lineHeight: 1.25, letterSpacing: '.01em',
          display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          textShadow: '0 1px 4px rgba(0,0,0,.25)',
        }}>
          {title}
        </div>
      </div>

      {/* Author + bottom rule */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative', width: '100%' }}>
        <div style={{ width: '60%', height: 1, background: t.accent, opacity: .45 }} />
        <div style={{
          fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase',
          color: t.ink, opacity: .82, fontWeight: 600, textAlign: 'center',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
        }}>
          {author || 'Catho Biblio'}
        </div>
      </div>
    </div>
  )
}
