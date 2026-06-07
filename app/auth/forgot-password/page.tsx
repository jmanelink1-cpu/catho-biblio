'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback?next=/auth/reset`
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-md rounded-3xl border p-10"
           style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: '0 8px 32px rgba(13,27,42,0.1)' }}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-brand)' }}>Mot de passe oublié</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>Recevez un lien de réinitialisation par email</p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-muted)' }}>
              Si un compte existe pour <strong>{email}</strong>, un email de réinitialisation vient d&apos;être envoyé. Vérifiez votre boîte de réception.
            </p>
            <Link href="/auth/login" className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-white text-sm" style={{ background: 'var(--color-brand)' }}>
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="px-4 py-3 rounded-xl mb-5 text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}>⚠ {error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-ink-2)' }}>Adresse email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="vous@exemple.com"
                       className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                       style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
              </div>
              <button type="submit" disabled={loading}
                      className="w-full py-3.5 rounded-full font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ background: 'var(--color-brand)' }}>
                {loading ? 'Envoi…' : 'Envoyer le lien'}
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
