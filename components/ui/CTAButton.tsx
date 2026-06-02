import Link from 'next/link'
import { theme } from '@/lib/theme'
import { Icon } from '@/components/Icons'

type Variant = 'gold' | 'violet'
type Size = 'sm' | 'md' | 'lg'

const SIZES: Record<Size, { pad: string; font: string; icon: number }> = {
  sm: { pad: '11px 22px', font: '.85rem', icon: 15 },
  md: { pad: '15px 36px', font: '.95rem', icon: 17 },
  lg: { pad: '17px 38px', font: '1rem',   icon: 18 },
}

/** Reusable call-to-action button with liturgical variants + shimmer (.btn). */
export function CTAButton({
  href, children, variant = 'gold', size = 'md', arrow = true, style,
}: {
  href: string
  children: React.ReactNode
  variant?: Variant
  size?: Size
  arrow?: boolean
  style?: React.CSSProperties
}) {
  const s = SIZES[size]
  const isGold = variant === 'gold'
  return (
    <Link
      href={href}
      className="btn disp"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: s.pad, borderRadius: 999, fontWeight: 800, fontSize: s.font,
        textDecoration: 'none', whiteSpace: 'nowrap',
        background: isGold ? `linear-gradient(135deg,${theme.gold},${theme.goldL})` : `linear-gradient(135deg,${theme.vio},${theme.vioDk})`,
        color: isGold ? theme.plum : '#fff',
        boxShadow: isGold ? '0 12px 34px rgba(201,154,59,.36)' : '0 12px 34px rgba(124,58,237,.34)',
        ...style,
      }}
    >
      {children}
      {arrow && <span style={{ width: s.icon, height: s.icon, flexShrink: 0, display: 'inline-flex' }}><Icon.Arrow /></span>}
    </Link>
  )
}
