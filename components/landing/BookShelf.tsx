import Link from 'next/link'
import DesignedCover from '@/app/library/DesignedCover'
import { theme } from '@/lib/theme'
import { Icon } from '@/components/Icons'

export interface ShelfBook {
  title: string
  author: string
  /** Optional real cover image URL; falls back to a DesignedCover when absent. */
  cover?: string
}

export interface ShelfData {
  label: string
  category: string
  books: ShelfBook[]
}

const COVER_W = 138
const COVER_H = COVER_W * 1.5 // 2:3 aspect

/** A labelled, horizontally-scrolling shelf of designed book covers. */
export function BookShelf({ shelf }: { shelf: ShelfData }) {
  return (
    <div className="rv" style={{ marginBottom: 34 }}>
      <div className="pad" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ width: 22, height: 2, background: theme.gold }} />
        <h3 className="disp" style={{ fontWeight: 700, fontSize: '1.1rem', color: theme.ink }}>{shelf.label}</h3>
      </div>
      <div className="shelf pad" style={{ display: 'flex', alignItems: 'flex-start', gap: 18, overflowX: 'auto', justifyContent: 'safe center', padding: '8px 40px 18px', maxWidth: 1180, margin: '0 auto' }}>
        {shelf.books.map(b => (
          <div key={b.title} className="bk" style={{ flexShrink: 0, width: COVER_W }}>
            <div style={{ width: '100%', aspectRatio: '2/3', borderRadius: 13, overflow: 'hidden', boxShadow: '0 12px 30px rgba(25,10,46,.2)', border: '1px solid rgba(0,0,0,.06)', background: '#fff' }}>
              {b.cover
                ? <img src={b.cover} alt={`Couverture : ${b.title}`} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <DesignedCover title={b.title} author={b.author} category={shelf.category} />}
            </div>
            <div className="disp" style={{ marginTop: 10, fontSize: '.8rem', fontWeight: 700, color: theme.ink, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{b.title}</div>
            <div style={{ fontSize: '.72rem', color: theme.mute, marginTop: 2 }}>{b.author}</div>
          </div>
        ))}

        {/* "More books" indicator — aligned to the cover's vertical centre */}
        <Link href="#tarif" aria-label="Voir tous les livres" title="Et bien d'autres…" className="shelf-more"
          style={{ flexShrink: 0, width: 58, height: COVER_H, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          <span style={{
            width: 48, height: 48, borderRadius: '50%',
            border: `1.5px solid ${theme.gold}`, background: 'rgba(201,154,59,.1)',
            color: theme.gold, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .25s ease, transform .25s ease',
          }}>
            <span style={{ width: 20, height: 20, display: 'inline-flex' }}><Icon.Chev /></span>
          </span>
        </Link>
      </div>
    </div>
  )
}
