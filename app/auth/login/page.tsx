'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : error.message)
      setLoading(false)
      return
    }

    // Check access level
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_access, access_type, access_expires_at, is_admin')
      .eq('id', data.user.id)
      .single()

    if (profile?.is_admin) { router.push('/admin'); return }

    const hasAccess = profile?.has_access &&
      (profile.access_type === 'lifetime' || !profile.access_expires_at ||
       new Date(profile.access_expires_at) > new Date())

    router.push(hasAccess ? '/library' : '/pricing')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12"
         style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-md rounded-3xl border p-10"
           style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: '0 8px 32px rgba(13,27,42,0.1)' }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✝</div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-brand)' }}>
            Catho Biblio
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>Connectez-vous à votre bibliothèque</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm"
               style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-ink-2)' }}>
              Adresse email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                   required placeholder="vous@exemple.com"
                   className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                   style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold" style={{ color: 'var(--color-ink-2)' }}>Mot de passe</label>
              <Link href="/auth/forgot-password" className="text-xs" style={{ color: 'var(--color-brand)' }}>
                Mot de passe oublié ?
              </Link>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                   required placeholder="••••••••"
                   className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                   style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
          </div>
          <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-full font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'var(--color-brand)' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-muted)' }}>
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="font-semibold" style={{ color: 'var(--color-brand)' }}>
            Créer un compte
          </Link>
        </p>
        <p className="text-center text-xs mt-4">
          <Link href="/" style={{ color: 'var(--color-muted-2)' }}>← Retour à l&apos;accueil</Link>
        </p>
      </div>
    </div>
  )
}
