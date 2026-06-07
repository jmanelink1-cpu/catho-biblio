'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, type Book, type Profile } from '@/lib/types'
import { Icon as Ico } from '@/components/Icons'
import BookCover from './BookCover'

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
  const [selected, setSelected]     = useState<Book | null>(null)

  const firstName = (profile.full_name || userEmail).split(' ')[0]
  const initials  = (profile.full_name || userEmail).split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()

  // ─── Progression de lecture (barre sous la couverture) ───
  const [progress, setProgress] = useState<Record<string, number>>({})
  useEffect(() => {
    if (isDemo || !profile?.id) return
    const db = createClient() as any
    db.from('reading_progress').select('book_id, progress').eq('user_id', profile.id)
      .then(({ data }: { data: { book_id: string; progress: number }[] | null }) => {
        if (data) { const m: Record<string, number> = {}; data.forEach(r => { m[r.book_id] = r.progress }); setProgress(m) }
      }).catch(() => {})
  }, [isDemo, profile?.id])

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

  // ─── Infinite scroll : ne rend qu'un lot à la fois (perf avec 500+ livres) ───
  const PAGE = 24
  const [visible, setVisible] = useState(PAGE)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => { setVisible(PAGE) }, [activeCategory, search])
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setVisible(v => Math.min(v + PAGE, filtered.length)) },
      { rootMargin: '800px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [filtered.length, visible])
  const shown = useMemo(() => filtered.slice(0, visible), [filtered, visible])

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }

  // Open the book detail sheet
  function openBook(book: Book) {
    setSelected(book)
  }

  // Read online — Google Drive preview inside our reader
  function readBook(book: Book) {
    if (!book.drive_file_id) { notify(`« ${book.title} » sera bientôt disponible.`); return }
    // Marque le livre comme "commencé" (si pas déjà suivi)
    if (!isDemo && profile?.id && !progress[book.id]) {
      const db = createClient() as any
      db.from('reading_progress').upsert({ user_id: profile.id, book_id: book.id, progress: 10 }, { onConflict: 'user_id,book_id' }).then(() => {}).catch(() => {})
      setProgress(p => ({ ...p, [book.id]: 10 }))
    }
    router.push(`/reader?id=${book.id}`)
  }

  // Download the PDF (Google Drive direct download)
  function downloadBook(book: Book) {
    if (!book.drive_file_id) { notify(`« ${book.title} » sera bientôt disponible.`); return }
    window.open(`https://drive.google.com/uc?export=download&id=${book.drive_file_id}`, '_blank', 'noopener')
  }

  const fmtCat = (v: string | null) => CATEGORIES.find(c => c.value === v)?.label

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <style>{`
        .lib-cover { position: relative; overflow: hidden; }
        .lib-pill { transition: all .22s ease; }
        .lib-shelf::-webkit-scrollbar { height: 0; }
        .lib-row::-webkit-scrollbar { display: none; }
        @keyframes libIn { from { opacity:0; transform: translateY(14px);} to {opacity:1; transform:none;} }
        .lib-in { animation: libIn .5s cubic-bezier(.22,.61,.36,1) both; }
        @media (max-width: 640px) {
          .lib-sheet { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 20px !important; padding: 24px 20px !important; }
          .lib-sheet > div:first-child { width: 150px !important; }
          .lib-sheet [data-actions] { justify-content: center !important; }
        }
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
                <Link href="/" onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 9, fontSize: '.86rem', color: 'var(--color-ink)', textDecoration: 'none', fontWeight: 600 }}>
                  <span style={{ width: 16, height: 16 }}><Ico.Home /></span> Accueil
                </Link>
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
                    <BookCover book={book} />
                  </div>
                  <ReadBar p={progress[book.id] ?? 0} />
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
              {shown.map(book => (
                <div key={book.id} className="lib-card" style={{ cursor: 'pointer' }} onClick={() => openBook(book)}>
                  <div className="lib-cover" style={{ width: '100%', aspectRatio: '2/3', borderRadius: 13, overflow: 'hidden', boxShadow: '0 8px 22px rgba(30,16,50,.15)', border: '1px solid rgba(0,0,0,.05)' }}>
                    <BookCover book={book} />
                  </div>
                  <ReadBar p={progress[book.id] ?? 0} />
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
          {visible < filtered.length && (
            <div ref={sentinelRef} style={{ display: 'flex', justifyContent: 'center', padding: '28px 0' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', border: '3px solid rgba(109,40,217,.18)', borderTopColor: 'var(--color-brand)', animation: 'spin .7s linear infinite' }} />
            </div>
          )}
        </section>
      </div>

      {/* ─── Book detail sheet ─── */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(13,8,20,.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} className="lib-in"
            style={{ width: '100%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto', background: '#fff', borderRadius: 22, boxShadow: '0 30px 80px rgba(13,8,20,.4)', position: 'relative' }}>
            <button onClick={() => setSelected(null)} aria-label="Fermer"
              style={{ position: 'absolute', top: 14, right: 14, zIndex: 2, width: 36, height: 36, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.9)', color: 'var(--color-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,.12)' }}>
              <span style={{ width: 17, height: 17 }}><Ico.X /></span>
            </button>

            <div className="lib-sheet" style={{ display: 'flex', gap: 26, padding: 28 }}>
              {/* Cover */}
              <div style={{ flexShrink: 0, width: 180 }}>
                <div style={{ width: '100%', aspectRatio: '2/3', borderRadius: 14, overflow: 'hidden', boxShadow: '0 16px 36px rgba(30,16,50,.24)', border: '1px solid rgba(0,0,0,.06)' }}>
                  <BookCover book={selected} />
                </div>
              </div>

              {/* Info + actions */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {selected.category && (
                  <div style={{ display: 'inline-flex', padding: '3px 11px', borderRadius: 999, fontSize: '.7rem', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', background: 'var(--color-brand-soft)', color: 'var(--color-brand)', marginBottom: 12 }}>{fmtCat(selected.category)}</div>
                )}
                <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-ink)', lineHeight: 1.2, marginBottom: 6 }}>{selected.title}</h2>
                {selected.author && <div style={{ fontSize: '.95rem', color: 'var(--color-muted)', marginBottom: 18 }}>{selected.author}</div>}
                {selected.description && <p style={{ fontSize: '.92rem', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: 26 }}>{selected.description}</p>}

                <div data-actions style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button onClick={() => readBook(selected)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 26px', borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,var(--color-brand),var(--color-brand-dark))', color: '#fff', fontWeight: 700, fontSize: '.92rem', fontFamily: 'var(--font-sora)', boxShadow: '0 8px 22px rgba(109,40,217,.32)' }}>
                    <span style={{ width: 18, height: 18 }}><Ico.Open /></span> Lire en ligne
                  </button>
                  <button onClick={() => downloadBook(selected)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 24px', borderRadius: 999, cursor: 'pointer', background: '#fff', color: 'var(--color-brand)', fontWeight: 700, fontSize: '.92rem', fontFamily: 'var(--font-sora)', border: '1.5px solid var(--color-brand)' }}>
                    <span style={{ width: 18, height: 18 }}><Ico.DL /></span> Télécharger
                  </button>
                </div>

                {!selected.drive_file_id && (
                  <p style={{ marginTop: 16, fontSize: '.8rem', color: 'var(--color-muted-2)' }}>
                    Ce livre de démonstration sera disponible une fois le catalogue complet en ligne.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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

/** Barre de progression de lecture (affichée seulement si le livre est commencé). */
function ReadBar({ p }: { p: number }) {
  if (!p) return null
  const done = p >= 100
  return (
    <div title={done ? 'Terminé' : 'En cours de lecture'} style={{ height: 4, borderRadius: 999, background: 'rgba(0,0,0,.09)', margin: '8px 0 0', overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, Math.max(0, p))}%`, height: '100%', borderRadius: 999, background: done ? '#16A34A' : 'var(--color-gold-bright)' }} />
    </div>
  )
}
