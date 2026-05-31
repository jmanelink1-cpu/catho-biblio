'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, type Book, type Profile } from '@/lib/types'

// ── SVG Icons ──
const Ico = {
  Cross:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M2 12h20"/></svg>,
  Book:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Arrow:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Sparkle: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z"/></svg>,
}

// Placeholder violet pour livres sans couverture
const BookPlaceholder = () => (
  <svg viewBox="0 0 60 90" fill="none" className="w-full h-full">
    <rect width="60" height="90" fill="#F5F3FF"/>
    <path d="M30 24v42M16 38h28" stroke="#6D28D9" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="30" cy="38" r="8" stroke="#B45309" strokeWidth="2" fill="none"/>
  </svg>
)

interface Props {
  books:     Book[]
  profile:   Profile
  userEmail: string
}

export default function LibraryClient({ books, profile, userEmail }: Props) {
  const router   = useRouter()
  const supabase = createClient()

  const [search,      setSearch]      = useState('')
  const [activeCategory, setCategory] = useState<string>('all')
  const [menuOpen,    setMenuOpen]    = useState(false)

  const initials = (profile.full_name || userEmail)
    .split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()

  const featured = useMemo(() => books.filter(b => b.is_featured).slice(0, 10), [books])
  const recent   = useMemo(() => books.slice(0, 10), [books])
  const showcase = featured.length >= 4 ? featured : recent

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
    await supabase.auth.signOut()
    router.push('/')
  }

  function openBook(book: Book) {
    if (!book.drive_file_id) return
    router.push(`/reader?id=${book.id}&title=${encodeURIComponent(book.title)}&file=${book.drive_file_id}`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 md:px-6 gap-4"
              style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-border)' }}>
        <Link href="/library" className="flex items-center gap-2 font-extrabold text-lg flex-shrink-0"
              style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-brand)' }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                style={{ background: 'var(--color-brand)' }}>
            <span className="w-4 h-4"><Ico.Cross /></span>
          </span>
          <span className="hidden sm:inline">Catho Biblio</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
               width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
               style={{ color: 'var(--color-muted-2)' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Rechercher un livre, un auteur..."
                 className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none transition-all"
                 style={{ border: '1.5px solid var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
        </div>

        {/* User avatar */}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: 'var(--color-brand)' }}>
            {initials}
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-12 rounded-xl border p-2 z-50 min-w-48"
                 style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <div className="px-3 py-2 border-b mb-1" style={{ borderColor: 'var(--color-border)' }}>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{profile.full_name || '—'}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{userEmail}</div>
              </div>
              {profile.is_admin && (
                <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[--color-subtle]"
                      style={{ color: 'var(--color-brand)' }} onClick={() => setMenuOpen(false)}>
                  <span className="w-4 h-4"><Ico.Settings /></span> Administration
                </Link>
              )}
              <button onClick={logout}
                      className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[--color-subtle]"
                      style={{ color: 'var(--color-muted)' }}>
                <span className="w-4 h-4"><Ico.Logout /></span> Se déconnecter
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-16">

        {/* ─── Hero banner ─── */}
        <div className="my-5 rounded-2xl p-6 md:p-8 relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg,var(--color-brand-dark),var(--color-brand) 70%,#7C3AED)' }}>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none w-28 h-28 text-white">
            <Ico.Cross />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 text-white"
               style={{ background: 'rgba(255,255,255,0.15)' }}>
            <span className="w-3.5 h-3.5" style={{ color: 'var(--color-gold-bright)' }}><Ico.Sparkle /></span>
            Bibliothèque complète
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2"
              style={{ fontFamily: 'var(--font-sora)' }}>
            Votre bibliothèque catholique
          </h2>
          <p className="text-sm text-white/75 max-w-sm mb-5">
            {books.length}+ livres de foi, de spiritualité et de théologie. Lisez, méditez, grandissez.
          </p>
          <button onClick={() => document.getElementById('all-books')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: '#fff', color: 'var(--color-brand)' }}>
            <span className="w-4 h-4"><Ico.Book /></span> Voir tous les livres
            <span className="w-4 h-4"><Ico.Arrow /></span>
          </button>
        </div>

        {/* ─── Category pills ─── */}
        <div className="flex gap-2 overflow-x-auto py-3 mb-2" style={{ scrollbarWidth: 'none' }}>
          <button onClick={() => setCategory('all')}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
                  style={activeCategory === 'all'
                    ? { background: 'var(--color-brand)', color: '#fff', borderColor: 'var(--color-brand)' }
                    : { background: 'var(--color-surface)', color: 'var(--color-muted)', borderColor: 'var(--color-border)' }}>
            Tous les livres
          </button>
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
                    className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
                    style={activeCategory === c.value
                      ? { background: 'var(--color-brand)', color: '#fff', borderColor: 'var(--color-brand)' }
                      : { background: 'var(--color-surface)', color: 'var(--color-muted)', borderColor: 'var(--color-border)' }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* ─── Featured scroll (only when showing all) ─── */}
        {activeCategory === 'all' && !search && showcase.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base flex items-center gap-2" style={{ color: 'var(--color-ink)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-gold)' }}></span>
                Récemment ajoutés
              </h3>
              <button onClick={() => setCategory('all')} className="text-sm font-semibold" style={{ color: 'var(--color-brand)' }}>
                Voir tout →
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {showcase.map(book => (
                <div key={book.id}
                     className="flex-shrink-0 w-32 rounded-xl overflow-hidden border cursor-pointer transition-all hover:-translate-y-1"
                     style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                     onClick={() => openBook(book)}>
                  <div className="h-44 flex items-center justify-center overflow-hidden"
                       style={{ background: 'var(--color-brand-soft)' }}>
                    {book.cover_url
                      ? <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                      : <BookPlaceholder />}
                  </div>
                  <div className="px-2 py-2 text-xs font-semibold leading-snug line-clamp-2"
                       style={{ color: 'var(--color-ink-2)' }}>
                    {book.title}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── All Books Grid ─── */}
        <section id="all-books">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base flex items-center gap-2" style={{ color: 'var(--color-ink)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-gold)' }}></span>
              {search ? `Résultats pour "${search}"` : activeCategory === 'all' ? 'Tous les livres' : CATEGORIES.find(c => c.value === activeCategory)?.label}
            </h3>
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
              {filtered.length} livre{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: 'var(--color-muted)' }}>
              <div className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--color-brand)', opacity: 0.5 }}><Ico.Book /></div>
              <h4 className="font-bold text-base mb-2" style={{ color: 'var(--color-ink)' }}>Aucun livre trouvé</h4>
              <p className="text-sm">Essayez une autre catégorie ou modifiez votre recherche.</p>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))' }}>
              {filtered.map(book => (
                <div key={book.id}
                     className="rounded-xl overflow-hidden border cursor-pointer transition-all hover:-translate-y-1"
                     style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                     onClick={() => openBook(book)}>
                  <div className="aspect-[2/3] flex items-center justify-center overflow-hidden"
                       style={{ background: 'var(--color-brand-soft)' }}>
                    {book.cover_url
                      ? <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                      : <BookPlaceholder />}
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-bold leading-snug line-clamp-2 mb-1"
                         style={{ color: 'var(--color-ink)' }}>{book.title}</div>
                    {book.author && (
                      <div className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>{book.author}</div>
                    )}
                    {book.category && (
                      <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                           style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>
                        {CATEGORIES.find(c => c.value === book.category)?.label}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Close menu on outside click */}
      {menuOpen && <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />}
    </div>
  )
}
