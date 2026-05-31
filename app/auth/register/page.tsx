'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLANS, type PlanKey } from '@/lib/types'
import { Suspense } from 'react'

function RegisterForm() {
  const searchParams = useSearchParams()
  const planKey      = (searchParams.get('plan') as PlanKey) || null
  const plan         = planKey ? PLANS[planKey] : null

  const supabase = createClient()

  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (password.length < 8)  { setError('Le mot de passe doit contenir au moins 8 caractères.'); return }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setError(error.message === 'User already registered'
        ? 'Un compte existe déjà avec cet email. Connectez-vous.'
        : error.message)
      setLoading(false)
      return
    }

    if (planKey) localStorage.setItem('selected_plan', planKey)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
          Compte créé avec succès !
        </h3>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-muted)' }}>
          Vérifiez votre email <strong>{email}</strong> pour confirmer votre inscription,
          puis revenez vous connecter pour procéder au paiement.
        </p>
        <Link href="/auth/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-white text-sm"
              style={{ background: 'var(--color-brand)' }}>
          Se connecter
        </Link>
      </div>
    )
  }

  return (
    <>
      {plan && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm"
             style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)', border: '1px solid rgba(26,86,219,0.2)' }}>
          📚 Plan sélectionné : <strong>{plan.label} — {plan.price.toLocaleString('fr-FR')} {plan.currency}</strong>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm"
             style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}>
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-ink-2)' }}>
            Nom complet
          </label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                 required placeholder="Jean-Baptiste Dupont"
                 className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                 style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-ink-2)' }}>
            Adresse email
          </label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                 required placeholder="vous@exemple.com"
                 className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                 style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-ink-2)' }}>
            Mot de passe
          </label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                 required placeholder="Minimum 8 caractères"
                 className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                 style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-ink-2)' }}>
            Confirmer le mot de passe
          </label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                 required placeholder="Répétez le mot de passe"
                 className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                 style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
        </div>
        <div className="px-4 py-3 rounded-xl text-xs leading-relaxed"
             style={{ background: 'var(--color-subtle)', color: 'var(--color-muted)' }}>
          🔒 En créant un compte, vous acceptez nos conditions d&apos;utilisation.
          Votre accès sera activé après confirmation de votre paiement.
        </div>
        <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-full font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: 'var(--color-brand)' }}>
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>
    </>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12"
         style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-md rounded-3xl border p-10"
           style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: '0 8px 32px rgba(13,27,42,0.1)' }}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✝</div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-brand)' }}>
            Catho Biblio
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>Créez votre compte gratuit</p>
        </div>
        <Suspense fallback={<div className="text-center py-8" style={{ color: 'var(--color-muted)' }}>Chargement...</div>}>
          <RegisterForm />
        </Suspense>
        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-muted)' }}>
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="font-semibold" style={{ color: 'var(--color-brand)' }}>Se connecter</Link>
        </p>
        <p className="text-center text-xs mt-4">
          <Link href="/" style={{ color: 'var(--color-muted-2)' }}>← Retour à l&apos;accueil</Link>
        </p>
      </div>
    </div>
  )
}
