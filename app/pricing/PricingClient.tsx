'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLANS, type PlanKey } from '@/lib/types'

type PayMethod = 'mobile' | 'card' | 'paypal' | 'cinetpay'

interface Props { userId: string; userEmail: string }

export default function PricingClient({ userId, userEmail }: Props) {
  const router   = useRouter()
  const supabase = createClient()

  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null)
  const [payMethod,    setPayMethod]    = useState<PayMethod>('mobile')
  const [loading,      setLoading]      = useState(false)
  const [success,      setSuccess]      = useState(false)
  const [phone,        setPhone]        = useState('')
  const [operator,     setOperator]     = useState('mtn')

  const plan = selectedPlan ? PLANS[selectedPlan] : null

  async function recordPayment(method: string) {
    const { data } = await (supabase as any).from('payments').insert({
      user_id: userId, amount: plan!.price, currency: 'XOF',
      payment_method: method, plan: selectedPlan, status: 'pending',
    }).select().single()
    return data
  }

  async function activateAccess() {
    const expires = plan!.duration_days
      ? new Date(Date.now() + plan!.duration_days * 86400000).toISOString()
      : null
    await (supabase as any).from('profiles').update({
      has_access: true, access_type: selectedPlan, access_expires_at: expires,
    }).eq('id', userId)
  }

  async function handlePay() {
    if (!selectedPlan) return
    setLoading(true)

    const payment = await recordPayment(payMethod === 'mobile' ? operator : payMethod)

    /* ──────────────────────────────────────────────────────────────────
       TODO: Connectez votre API de paiement ici selon payMethod :

       'mobile'   → CinetPay, Notchpay, Flutterwave, Pawapay, FedaPay
       'card'     → Stripe (créer un PaymentIntent côté serveur)
       'paypal'   → PayPal Buttons SDK ou redirection
       'cinetpay' → CinetPay checkout URL (redirect)

       Exemple CinetPay :
         const res = await fetch('/api/payments/cinetpay', {
           method: 'POST',
           body: JSON.stringify({ plan: selectedPlan, paymentId: payment.id, phone })
         })
         const { payment_url } = await res.json()
         window.location.href = payment_url
    ────────────────────────────────────────────────────────────────── */

    // DEMO simulation — supprimer en production
    await new Promise(r => setTimeout(r, 1500))
    if (payment) {
      await (supabase as any).from('payments').update({ status: 'completed' }).eq('id', payment.id)
    }
    await activateAccess()
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5"
           style={{ background: 'var(--color-bg)' }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-5">🎉</div>
          <h2 className="text-2xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Accès activé !
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            Bienvenue dans votre bibliothèque catholique. Vous avez maintenant accès à tous les livres.
          </p>
          <Link href="/library"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-base"
                style={{ background: 'var(--color-brand)' }}>
            📚 Accéder à la bibliothèque →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <header className="h-16 flex items-center justify-between px-6 border-b"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg"
              style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-brand)' }}>
          <span style={{ color: 'var(--color-gold)' }}>✝</span> Catho Biblio
        </Link>
        <span className="text-sm" style={{ color: 'var(--color-muted)' }}>{userEmail}</span>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="text-center mb-12">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-3xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Activez votre accès
          </h1>
          <p style={{ color: 'var(--color-muted)' }}>
            Choisissez un plan et procédez au paiement pour accéder à 500+ livres catholiques.
          </p>
        </div>

        {/* Plans */}
        {!selectedPlan ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, p]) => {
              const isFeatured = key === 'yearly'
              return (
                <div key={key} className="relative p-8 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-1"
                     style={{
                       background: 'var(--color-surface)',
                       borderColor: isFeatured ? 'var(--color-brand)' : 'var(--color-border)',
                       boxShadow: isFeatured ? '0 8px 24px rgba(26,86,219,0.15)' : 'none',
                     }}
                     onClick={() => setSelectedPlan(key)}>
                  {isFeatured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                         style={{ background: 'var(--color-brand)' }}>⭐ Plus populaire</div>
                  )}
                  <div className="font-bold mb-1" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>{p.label}</div>
                  <div className="text-3xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
                    {p.price.toLocaleString('fr-FR')}
                    <span className="text-base font-medium ml-1" style={{ color: 'var(--color-muted)' }}>
                      {p.currency}{key !== 'lifetime' ? ` / ${key === 'yearly' ? 'an' : 'mois'}` : ' une fois'}
                    </span>
                  </div>
                  <button className="w-full py-3 rounded-full font-bold text-sm transition-all"
                          style={isFeatured
                            ? { background: 'var(--color-brand)', color: '#fff' }
                            : key === 'lifetime'
                            ? { background: 'linear-gradient(135deg,var(--color-gold),var(--color-gold-light))', color: '#fff' }
                            : { border: '2px solid var(--color-brand)', color: 'var(--color-brand)' }
                          }>
                    Choisir — {p.label}
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          /* Payment form */
          <div className="max-w-lg mx-auto">
            <button onClick={() => setSelectedPlan(null)}
                    className="flex items-center gap-2 text-sm mb-6 transition-colors"
                    style={{ color: 'var(--color-muted)' }}>
              ← Changer de plan
            </button>

            <div className="rounded-2xl border overflow-hidden"
                 style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

              {/* Summary */}
              <div className="flex items-center justify-between px-6 py-5 border-b"
                   style={{ background: 'var(--color-subtle)', borderColor: 'var(--color-border)' }}>
                <div>
                  <div className="font-bold" style={{ color: 'var(--color-ink)' }}>{plan?.label}</div>
                  <div className="text-sm" style={{ color: 'var(--color-muted)' }}>
                    {selectedPlan === 'lifetime' ? 'Accès à vie' : selectedPlan === 'yearly' ? 'Accès 12 mois' : 'Accès 1 mois'}
                  </div>
                </div>
                <div className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-brand)' }}>
                  {plan?.price.toLocaleString('fr-FR')} {plan?.currency}
                </div>
              </div>

              <div className="p-6">
                {/* Method selector */}
                <div className="text-sm font-bold mb-3" style={{ color: 'var(--color-ink)' }}>
                  Moyen de paiement
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {([
                    ['mobile',   '📱', 'Mobile Money',  'MTN · Orange · Wave · Moov'],
                    ['card',     '💳', 'Carte bancaire', 'Visa · Mastercard'],
                    ['paypal',   '🅿️', 'PayPal',         'Paiement international'],
                    ['cinetpay', '🌍', 'CinetPay',       'Afrique francophone'],
                  ] as const).map(([m, icon, name, sub]) => (
                    <button key={m} onClick={() => setPayMethod(m)}
                            className="p-3 rounded-xl border-2 text-left transition-all"
                            style={{
                              borderColor: payMethod === m ? 'var(--color-brand)' : 'var(--color-border)',
                              background:  payMethod === m ? 'var(--color-brand-soft)' : 'var(--color-surface)',
                            }}>
                      <div className="text-xl mb-1">{icon}</div>
                      <div className="text-xs font-bold" style={{ color: 'var(--color-ink)' }}>{name}</div>
                      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{sub}</div>
                    </button>
                  ))}
                </div>

                {/* Mobile Money fields */}
                {payMethod === 'mobile' && (
                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--color-ink-2)' }}>Opérateur</label>
                      <select value={operator} onChange={e => setOperator(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                              style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }}>
                        <option value="mtn">MTN Mobile Money</option>
                        <option value="orange">Orange Money</option>
                        <option value="wave">Wave</option>
                        <option value="moov">Moov Money</option>
                        <option value="airtel">Airtel Money</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--color-ink-2)' }}>Numéro de téléphone</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                             placeholder="Ex: +225 07 00 00 00 00"
                             className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                             style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
                    </div>
                    <div className="px-4 py-3 rounded-xl text-xs leading-relaxed"
                         style={{ background: '#FFF8E1', color: '#92400E', border: '1px solid #FDE68A' }}>
                      📲 Vous recevrez une demande de confirmation sur votre téléphone.
                      Approuvez le paiement de {plan?.price.toLocaleString('fr-FR')} {plan?.currency}.
                    </div>
                  </div>
                )}

                {/* PayPal / CinetPay info */}
                {(payMethod === 'paypal' || payMethod === 'cinetpay') && (
                  <div className="text-center py-4 mb-4" style={{ color: 'var(--color-muted)' }}>
                    <div className="text-4xl mb-3">{payMethod === 'paypal' ? '🅿️' : '🌍'}</div>
                    <p className="text-sm leading-relaxed">
                      Vous serez redirigé vers {payMethod === 'paypal' ? 'PayPal' : 'CinetPay'} pour compléter
                      votre paiement de <strong>{plan?.price.toLocaleString('fr-FR')} {plan?.currency}</strong>.
                    </p>
                  </div>
                )}

                <button onClick={handlePay} disabled={loading}
                        className="w-full py-4 rounded-full font-bold text-white text-base transition-all hover:-translate-y-0.5 disabled:opacity-60"
                        style={{ background: payMethod === 'mobile' ? 'linear-gradient(135deg,#F59E0B,#D97706)' : 'var(--color-brand)' }}>
                  {loading ? 'Traitement...' : `Payer ${plan?.price.toLocaleString('fr-FR')} ${plan?.currency}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
