'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, type Book, type Profile } from '@/lib/types'
import DesignedCover from './DesignedCover'

const Ico = {
  Cross:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M2 12h20"/></svg>,
  Book:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Arrow:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Search:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
}

interface Props {
  books:     Book[]
  profile:   Profile
  userEmail: string
  isDemo?:   boolean
}

export default function LibraryClient({ books, profile, userEmail, isDemo = false }: Props) {
  const router   = useRouter()
  const [search, setSearch]         = useState('')
  const [activeCategory, setCategory] = useState<string>('all')
  const [menuOpen, setMenuOpen]     = useState(false)
  const [toast, setToast]           = useState('')

  const firstName = (profile.full_name || userEmail).split(' ')[0]
  const initials  = (profile.full_name || userEmail).split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()

  const showcase = useMemo(() => {
    const f = books.filter(b => b.is_featured)
    return (f.length >= 4 ? f : books).slice(0, 12)
  }, [books])

  const categoriesPresent = useMemo(() => {
    const set = new Set(books.map(b => b.category))
    return CATEGORIES.filter(c => set.has(c.value))
  }, [books])

  const filtered = useMemo(() => {
    let list = activeCategory === 'all' ? books : books.filter(b => b.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        (b.author ?? '').toLowerCase().includes(q) ||
        (b.description ?? '').toLowerCase().includes(q)
      )
    }
    return list
  }, [books, activeCategory, search])

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  function openBook(book: Book) {
    if (!book.drive_file_id) {
      setToast(`« ${book.title} » sera bientôt disponible.`)
      setTimeout(() => setToast(''), 2600)
      return
    }
    router.push(`/reader?id=${book.id}&title=${encodeURIComponent(book.title)}&file=${book.drive_file_id}`)
  }

  const fmtCat = (v: string | null) => CATEGORIES.find(c => c.value === v)?.label

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <style>{`
        .lib-card { transition: transform .38s cubic-bezier(.22,.61,.36,1), box-shadow .38s ease; will-change: transform; }
        .lib-card:hover { transform: translateY(-7px); box-shadow: 0 22px 44px rgba(30,16,50,.20); }
        .lib-card:hover .lib-cover::after { opacity: 1; transform: translateX(120%); }
        .lib-cover { position: relative; overflow: hidden; }
        .lib-cover::after { content:''; position:absolute; inset:0; width:55%; background:linear-gradient(100deg,transparent,rgba(255,255,255,.32),transparent); transform:translateX(-160%); opacity:0; transition:transform .7s cubic-bezier(.22,.61,.36,1), opacity .3s; pointer-events:none; }
        .lib-pill { transition: all .22s ease; }
        .lib-shelf::-webkit-scrollbar { height: 0; }
        .lib-row::-webkit-scrollbar { display: none; }
        @keyframes libIn { from { opacity:0; transform: translateY(14px);} to {opacity:1; transform:none;} }
        .lib-in { animation: libIn .5s cubic-bezier(.22,.61,.36,1) both; }
      `}</style>

      {/* ─── Header ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40, height: 62,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
        padding: '0 16px', background: 'rgba(253,251,247,.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(109,40,217,.1)'
      }}>
        <Link href="/library" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <span style={{ width: 15, height: 15 }}><Ico.Cross /></span>
          </span>
          <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.04rem', color: 'var(--color-brand)' }} className="hidden sm:inline">Catho Biblio</span>
        </Link>

        <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--color-muted-2)', pointerEvents: 'none' }}><Ico.Search /></span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un livre, un auteur, un thème…"
            style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: 999, fontSize: '.88rem', outline: 'none',
              border: '1.5px solid var(--color-border)', background: 'rgba(255,255,255,.7)', color: 'var(--color-ink)' }} />
        </div>

        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ width: 38, height: 38, borderRadius: 999, background: 'linear-gradient(135deg,var(--color-brand),var(--color-brand-dark))', color: '#fff', fontWeight: 700, fontSize: '.8rem', cursor: 'pointer', border: 'none' }}>
            {initials}
          </button>
          {menuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={() => setMenuOpen(false)} />
              <div style={{ position: 'absolute', right: 0, top: 48, zIndex: 50, minWidth: 210, padding: 8, borderRadius: 14,
                background: '#fff', border: '1px solid var(--color-border)', boxShadow: '0 16px 40px rgba(30,16,50,.16)' }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: 6 }}>
                  <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--color-ink)' }}>{profile.full_name || '—'}</div>
                  <div style={{ fontSize: '.74rem', color: 'var(--color-muted)' }}>{userEmail}</div>
                </div>
                {profile.is_admin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 9, fontSize: '.86rem', color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 600 }}>
                    <span style={{ width: 16, height: 16 }}><Ico.Settings /></span> Administration
                  </Link>
                )}
                <button onClick={logout}
                  style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 9, fontSize: '.86rem', color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <span style={{ width: 16, height: 16 }}><Ico.Logout /></span> Se déconnecter
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 16px 80px' }}>

        {/* ─── Welcome band ─── */}
        <div className="lib-in" style={{
          margin: '20px 0 8px', borderRadius: 22, padding: '30px 26px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg,#3B0764 0%,#6D28D9 60%,#7C3AED 100%)'
        }}>
          <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', right: -60, top: -110,
            background: 'radial-gradient(circle, rgba(252,211,77,.22), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '.74rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)', marginBottom: 8 }}>
              Bienvenue, {firstName}
            </div>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.3rem,3.5vw,1.9rem)', color: '#fff', lineHeight: 1.2, marginBottom: 8, maxWidth: 520 }}>
              Votre bibliothèque catholique vous attend
            </h1>
            <p style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.78)', maxWidth: 440, lineHeight: 1.6 }}>
              {books.length} ouvrages de foi, de spiritualité et de théologie — à lire, méditer et télécharger.
            </p>
          </div>
        </div>

        {isDemo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderRadius: 12, marginBottom: 12,
            background: 'var(--color-gold-soft)', border: '1px solid #FDE68A', color: '#92400E', fontSize: '.82rem' }}>
            <span style={{ width: 16, height: 16, flexShrink: 0 }}><Ico.Book /></span>
            Aperçu de démonstration — ajoutez vos vrais livres depuis l’espace Administration.
          </div>
        )}

        {/* ─── Category pills ─── */}
        <div className="lib-row" style={{ display: 'flex', gap: 9, overflowX: 'auto', padding: '12px 0 4px' }}>
          {[{ value: 'all', label: 'Tous les livres' }, ...categoriesPresent].map(c => {
            const on = activeCategory === c.value
            return (
              <button key={c.value} onClick={() => setCategory(c.value)} className="lib-pill"
                style={{ flexShrink: 0, padding: '8px 18px', borderRadius: 999, fontSize: '.85rem', fontWeight: 600, cursor: 'pointer',
                  border: `1.5px solid ${on ? 'var(--color-brand)' : 'var(--color-border)'}`,
                  background: on ? 'var(--color-brand)' : '#fff',
                  color: on ? '#fff' : 'var(--color-muted)',
                  boxShadow: on ? '0 4px 14px rgba(109,40,217,.28)' : 'none' }}>
                {c.label}
              </button>
            )
          })}
        </div>

        {/* ─── Featured shelf ─── */}
        {activeCategory === 'all' && !search && showcase.length > 0 && (
          <section style={{ marginTop: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-gold-bright)' }} />
              <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-ink)' }}>À la une</h2>
            </div>
            <div className="lib-row" style={{ display: 'flex', gap: 18, overflowX: 'auto', padding: '6px 2px 18px' }}>
              {showcase.map(book => (
                <div key={book.id} className="lib-card" style={{ flexShrink: 0, width: 132, cursor: 'pointer' }} onClick={() => openBook(book)}>
                  <div className="lib-cover" style={{ width: '100%', aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 22px rgba(30,16,50,.16)', border: '1px solid rgba(0,0,0,.05)' }}>
                    {book.cover_url
                      ? <img src={book.cover_url} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <DesignedCover title={book.title} author={book.author} category={book.category} />}
                  </div>
                  <div style={{ marginTop: 9, fontSize: '.78rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--color-ink)',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.title}</div>
                  {book.author && <div style={{ fontSize: '.72rem', color: 'var(--color-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.author}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Grid ─── */}
        <section style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-gold-bright)' }} />
              <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-ink)' }}>
                {search ? `Résultats pour « ${search} »` : activeCategory === 'all' ? 'Toute la bibliothèque' : fmtCat(activeCategory)}
              </h2>
            </div>
            <span style={{ fontSize: '.82rem', color: 'var(--color-muted)' }}>{filtered.length} livre{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '70px 20px', color: 'var(--color-muted)' }}>
              <div style={{ width: 52, height: 52, margin: '0 auto 16px', color: 'var(--color-brand)', opacity: .45 }}><Ico.Book /></div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-ink)', marginBottom: 6 }}>Aucun livre trouvé</h3>
              <p style={{ fontSize: '.88rem' }}>Essayez une autre catégorie ou modifiez votre recherche.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 22 }}>
              {filtered.map(book => (
                <div key={book.id} className="lib-card" style={{ cursor: 'pointer' }} onClick={() => openBook(book)}>
                  <div className="lib-cover" style={{ width: '100%', aspectRatio: '2/3', borderRadius: 13, overflow: 'hidden', boxShadow: '0 8px 22px rgba(30,16,50,.15)', border: '1px solid rgba(0,0,0,.05)' }}>
                    {book.cover_url
                      ? <img src={book.cover_url} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <DesignedCover title={book.title} author={book.author} category={book.category} />}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: '.84rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--color-ink)',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.title}</div>
                    {book.author && <div style={{ fontSize: '.76rem', color: 'var(--color-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.author}</div>}
                    {book.category && (
                      <div style={{ display: 'inline-flex', marginTop: 8, padding: '3px 10px', borderRadius: 999, fontSize: '.7rem', fontWeight: 600,
                        background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>{fmtCat(book.category)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', left: '50%', bottom: 26, transform: 'translateX(-50%)', zIndex: 70,
          background: 'var(--color-ink)', color: '#fff', padding: '12px 20px', borderRadius: 999, fontSize: '.85rem',
          boxShadow: '0 10px 30px rgba(0,0,0,.25)', animation: 'libIn .25s ease both', maxWidth: '90vw', textAlign: 'center' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
