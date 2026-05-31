'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Book } from '@/lib/types'

export default function ReaderClient() {
  const searchParams = useSearchParams()
  const bookId    = searchParams.get('id')
  const title     = searchParams.get('title') || 'Lecture'
  const fileId    = searchParams.get('file')

  const [book,       setBook]       = useState<Book | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [panelOpen,  setPanelOpen]  = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (bookId) {
      supabase.from('books').select('*').eq('id', bookId).single()
        .then(({ data }) => { if (data) setBook(data as Book) })
    }
    const timer = setTimeout(() => setLoading(false), 4000)
    return () => clearTimeout(timer)
  }, [bookId]) // eslint-disable-line

  const embedUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null

  return (
    <div className="flex flex-col h-screen" style={{ background: '#1A1A2E' }}>

      {/* ─── Topbar ─── */}
      <div className="flex items-center justify-between px-4 h-14 flex-shrink-0 gap-3"
           style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/library"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
              style={{ color: 'rgba(255,255,255,0.7)' }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Bibliothèque
        </Link>

        <div className="flex-1 text-center text-sm font-semibold text-white truncate px-2">{title}</div>

        <div className="flex items-center gap-1">
          <button onClick={() => setPanelOpen(!panelOpen)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{ color: 'rgba(255,255,255,0.6)', background: panelOpen ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                  title="Informations">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
          </button>
          <button onClick={() => document.getElementById('reader-iframe')?.requestFullscreen?.()}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  title="Plein écran">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
               style={{ background: '#1A1A2E', color: 'rgba(255,255,255,0.6)' }}>
            <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-blue-400 animate-spin" />
            <span className="text-sm">Ouverture du livre...</span>
          </div>
        )}

        {/* PDF iframe */}
        {embedUrl ? (
          <div className="flex-1" id="reader-iframe">
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="fullscreen"
              title={title}
              onLoad={() => setLoading(false)}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6"
               style={{ color: 'rgba(255,255,255,0.7)' }}>
            <div className="text-5xl">📵</div>
            <h3 className="text-white font-bold text-lg">Impossible d&apos;ouvrir ce livre</h3>
            <p className="text-sm max-w-sm">Le fichier Google Drive n&apos;est pas configuré. Vérifiez l&apos;ID du fichier dans le panel admin.</p>
            <Link href="/library" className="px-6 py-2.5 rounded-full font-bold text-sm border text-white border-white/30 mt-2">
              ← Retour à la bibliothèque
            </Link>
          </div>
        )}

        {/* Info panel */}
        {panelOpen && book && (
          <div className="w-72 flex-shrink-0 overflow-y-auto p-5 border-l"
               style={{ background: '#0D1B2A', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex justify-end mb-4">
              <button onClick={() => setPanelOpen(false)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                      style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                ✕
              </button>
            </div>
            {book.cover_url
              ? <img src={book.cover_url} alt={book.title} className="w-full rounded-xl mb-4 object-cover" style={{ maxHeight: 200 }} />
              : <div className="w-full h-36 rounded-xl mb-4 flex items-center justify-center text-4xl"
                     style={{ background: 'rgba(26,86,219,0.2)' }}>📖</div>}
            <Field label="Titre"      value={book.title} />
            <Field label="Auteur"     value={book.author} />
            <Field label="Catégorie"  value={book.category} />
            {book.year  && <Field label="Année"   value={String(book.year)} />}
            {book.pages && <Field label="Pages"   value={String(book.pages)} />}
            <Field label="Description" value={book.description} small />
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, small }: { label: string; value: string | null | undefined; small?: boolean }) {
  if (!value) return null
  return (
    <div className="mb-4">
      <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
      <div className={`${small ? 'text-xs opacity-70' : 'text-sm'} leading-relaxed`} style={{ color: 'rgba(255,255,255,0.85)' }}>{value}</div>
    </div>
  )
}
