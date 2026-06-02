import { theme } from '@/lib/theme'

/** Reusable centered section heading: eyebrow label + title + optional subtitle. */
export function SectionHeading({
  eyebrow, title, subtitle, light = false, eyebrowColor,
}: {
  eyebrow: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  light?: boolean
  eyebrowColor?: string
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p className="rv" style={{ fontSize: '.76rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: eyebrowColor ?? theme.gold, marginBottom: 16 }}>
        {eyebrow}
      </p>
      <h2 className="rv d1 disp" style={{ fontSize: 'clamp(1.7rem,4vw,2.7rem)', fontWeight: 800, letterSpacing: '-.02em', color: light ? '#fff' : theme.ink, lineHeight: 1.12, marginBottom: subtitle ? 16 : 0 }}>
        {title}
      </h2>
      {subtitle && (
        <p className="rv d1" style={{ fontSize: '1.05rem', color: light ? 'rgba(255,255,255,.7)' : theme.mute, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
