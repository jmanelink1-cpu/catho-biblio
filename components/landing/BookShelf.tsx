import DesignedCover from '@/app/library/DesignedCover'
import { theme } from '@/lib/theme'

export interface ShelfData {
  label: string
  category: string
  books: { title: string; author: string }[]
}

/** A labelled, horizontally-scrolling shelf of designed book covers. */
export function BookShelf({ shelf }: { shelf: ShelfData }) {
  return (
    <div className="rv" style={{ marginBottom: 34 }}>
      <div className="pad" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ width: 22, height: 2, background: theme.gold }} />
        <h3 className="disp" style={{ fontWeight: 700, fontSize: '1.1rem', color: theme.ink }}>{shelf.label}</h3>
      </div>
      <div className="shelf pad" style={{ display: 'flex', gap: 18, overflowX: 'auto', justifyContent: 'safe center', padding: '8px 40px 18px', maxWidth: 1180, margin: '0 auto' }}>
        {shelf.books.map(b => (
          <div key={b.title} className="bk" style={{ flexShrink: 0, width: 138 }}>
            <div style={{ width: '100%', aspectRatio: '2/3', borderRadius: 13, overflow: 'hidden', boxShadow: '0 12px 30px rgba(25,10,46,.2)', border: '1px solid rgba(0,0,0,.06)' }}>
              <DesignedCover title={b.title} author={b.author} category={shelf.category} />
            </div>
            <div className="disp" style={{ marginTop: 10, fontSize: '.8rem', fontWeight: 700, color: theme.ink, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{b.title}</div>
            <div style={{ fontSize: '.72rem', color: theme.mute, marginTop: 2 }}>{b.author}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
