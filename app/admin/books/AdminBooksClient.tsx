'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, type Book, type BookCategory } from '@/lib/types'

interface Props { initialBooks: Book[] }

const EMPTY_FORM = {
  title: '', author: '', category: 'spiritualite' as BookCategory, drive_file_id: '',
  cover_url: '', description: '', year: '', pages: '', is_featured: false,
}

export default function AdminBooksClient({ initialBooks }: Props) {
  const router   = useRouter()
  const supabase = createClient()

  const [books,      setBooks]      = useState<Book[]>(initialBooks)
  const [search,     setSearch]     = useState('')
  const [modal,      setModal]      = useState(false)
  const [editId,     setEditId]     = useState<string | null>(null)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [saving,     setSaving]     = useState(false)

  const filtered = books.filter(b =>
    !search || b.title.toLowerCase().includes(search.toLowerCase()) ||
    (b.author ?? '').toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() { setForm(EMPTY_FORM); setEditId(null); setModal(true) }
  function openEdit(b: Book) {
    setForm({
      title: b.title, author: b.author ?? '', category: (b.category as BookCategory) ?? 'spiritualite',
      drive_file_id: b.drive_file_id, cover_url: b.cover_url ?? '',
      description: b.description ?? '', year: b.year ? String(b.year) : '',
      pages: b.pages ? String(b.pages) : '', is_featured: b.is_featured,
    })
    setEditId(b.id); setModal(true)
  }

  async function save() {
    if (!form.title.trim() || !form.drive_file_id.trim()) return
    setSaving(true)
    const payload = {
      title: form.title.trim(), author: form.author.trim() || null,
      category: form.category, drive_file_id: form.drive_file_id.trim(),
      cover_url: form.cover_url.trim() || null, description: form.description.trim() || null,
      year: form.year ? parseInt(form.year) : null, pages: form.pages ? parseInt(form.pages) : null,
      is_featured: form.is_featured,
    }
    if (editId) {
      await supabase.from('books').update(payload).eq('id', editId)
    } else {
      await supabase.from('books').insert(payload)
    }
    setSaving(false); setModal(false)
    router.refresh()
    // Optimistic update
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false })
    if (data) setBooks(data as Book[])
  }

  async function deleteBook(id: string, title: string) {
    if (!confirm(`Supprimer "${title}" ?`)) return
    await supabase.from('books').delete().eq('id', id)
    setBooks(b => b.filter(x => x.id !== id))
  }

  return (
    <div>
      <div className="h-14 flex items-center justify-between px-6 border-b"
           style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h1 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
          Gestion des livres
        </h1>
        <button onClick={openAdd}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-white"
                style={{ background: 'var(--color-brand)' }}>
          + Ajouter un livre
        </button>
      </div>

      <div className="p-6">
        <div className="rounded-2xl border overflow-hidden"
             style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b gap-4"
               style={{ borderColor: 'var(--color-border)' }}>
            <div className="relative max-w-xs flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                   width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                   style={{ color: 'var(--color-muted-2)' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                     placeholder="Rechercher..."
                     className="w-full pl-9 pr-4 py-2 rounded-full border text-sm outline-none"
                     style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
            </div>
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>{filtered.length} livre{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--color-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                  {['Couverture','Titre','Auteur','Catégorie','Vedette','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                        style={{ color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
                    Aucun livre. Cliquez sur &quot;+ Ajouter un livre&quot;.
                  </td></tr>
                )}
                {filtered.map(b => (
                  <tr key={b.id} className="border-b hover:bg-[--color-subtle] transition-colors"
                      style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-4 py-3">
                      <div className="w-9 h-12 rounded flex items-center justify-center text-xl overflow-hidden"
                           style={{ background: 'var(--color-brand-soft)' }}>
                        {b.cover_url
                          ? <img src={b.cover_url} alt="" className="w-full h-full object-cover" />
                          : '📖'}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="font-semibold text-sm truncate" style={{ color: 'var(--color-ink)' }}>{b.title}</div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-muted)' }}>{b.author || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>
                        {CATEGORIES.find(c => c.value === b.category)?.emoji} {CATEGORIES.find(c => c.value === b.category)?.label ?? b.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {b.is_featured
                        ? <span className="text-xs font-semibold" style={{ color: '#16A34A' }}>★ Oui</span>
                        : <span style={{ color: 'var(--color-muted-2)' }}>—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(b)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                                style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>
                          Modifier
                        </button>
                        <button onClick={() => deleteBook(b.id, b.title)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                                style={{ background: '#FEF2F2', color: '#DC2626' }}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
             style={{ background: 'rgba(13,27,42,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden"
               style={{ background: 'var(--color-surface)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b"
                 style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
                {editId ? 'Modifier le livre' : 'Ajouter un livre'}
              </h3>
              <button onClick={() => setModal(false)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ background: 'var(--color-subtle)', color: 'var(--color-muted)' }}>✕</button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <Field label="Titre *">
                <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                       placeholder="Ex: La Bible de Jérusalem" className="input-base" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Auteur">
                  <input value={form.author} onChange={e => setForm(f => ({...f, author: e.target.value}))}
                         placeholder="Auteur" className="input-base" />
                </Field>
                <Field label="Catégorie *">
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value as BookCategory}))}
                          className="input-base">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="ID Google Drive *" hint="Lien Drive : drive.google.com/file/d/[ID ICI]/view">
                <input value={form.drive_file_id} onChange={e => setForm(f => ({...f, drive_file_id: e.target.value}))}
                       placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" className="input-base font-mono text-xs" />
              </Field>
              <Field label="URL de la couverture" hint="drive.google.com/thumbnail?id=ID&sz=w400">
                <input value={form.cover_url} onChange={e => setForm(f => ({...f, cover_url: e.target.value}))}
                       placeholder="https://..." className="input-base" />
              </Field>
              <Field label="Description">
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                          rows={3} placeholder="Résumé du livre..." className="input-base resize-none" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Année">
                  <input type="number" value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))}
                         placeholder="2024" className="input-base" />
                </Field>
                <Field label="Nombre de pages">
                  <input type="number" value={form.pages} onChange={e => setForm(f => ({...f, pages: e.target.value}))}
                         placeholder="300" className="input-base" />
                </Field>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_featured}
                       onChange={e => setForm(f => ({...f, is_featured: e.target.checked}))}
                       className="w-4 h-4" />
                <span className="text-sm font-medium" style={{ color: 'var(--color-ink-2)' }}>
                  Mettre en vedette (section &quot;Récemment ajoutés&quot;)
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t"
                 style={{ borderColor: 'var(--color-border)' }}>
              <button onClick={() => setModal(false)}
                      className="px-5 py-2.5 rounded-full text-sm font-semibold"
                      style={{ color: 'var(--color-muted)' }}>
                Annuler
              </button>
              <button onClick={save} disabled={saving || !form.title || !form.drive_file_id}
                      className="px-6 py-2.5 rounded-full text-sm font-bold text-white disabled:opacity-50"
                      style={{ background: 'var(--color-brand)' }}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global input styles */}
      <style jsx global>{`
        .input-base {
          width: 100%; padding: 10px 14px; border-radius: 10px;
          border: 1.5px solid var(--color-border);
          background: var(--color-subtle); color: var(--color-ink);
          font-size: .875rem; outline: none;
          font-family: inherit;
          transition: border-color .15s;
        }
        .input-base:focus { border-color: var(--color-brand); background: #fff; }
      `}</style>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-ink-2)' }}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs" style={{ color: 'var(--color-muted-2)' }}>💡 {hint}</p>}
    </div>
  )
}
