'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(/session/i.test(error.message)
        ? 'Lien expiré ou invalide. Redemandez un email de réinitialisation.'
        : error.message)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/auth/login'), 2200)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-md rounded-3xl border p-10"
           style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: '0 8px 32px rgba(13,27,42,0.1)' }}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-brand)' }}>Nouveau mot de passe</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>Choisissez un nouveau mot de passe</p>
        </div>

        {done ? (
          <p className="text-center text-sm" style={{ color: '#16A34A' }}>
            Mot de passe mis à jour ✔ Redirection vers la connexion…
          </p>
        ) : (
          <>
            {error && (
              <div className="px-4 py-3 rounded-xl mb-5 text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}>⚠ {error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-ink-2)' }}>Nouveau mot de passe</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Minimum 8 caractères"
                       className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                       style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-ink-2)' }}>Confirmer</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Répétez le mot de passe"
                       className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                       style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
              </div>
              <button type="submit" disabled={loading}
                      className="w-full py-3.5 rounded-full font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ background: 'var(--color-brand)' }}>
                {loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
              </button>
            </form>
            <p className="text-center text-sm mt-6" style={{ color: 'var(--color-muted)' }}>
              <Link href="/auth/login" className="font-semibold" style={{ color: 'var(--color-brand)' }}>Retour à la connexion</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
