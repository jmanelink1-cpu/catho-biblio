'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { usePrice } from '@/lib/usePrice'

type PayMethod = 'mobile' | 'card' | 'paypal' | 'cinetpay'

interface Props { userId: string; userEmail: string }

export default function PricingClient({ userId, userEmail }: Props) {
  const router   = useRouter()
  const supabase = createClient()

  const [payMethod, setPayMethod] = useState<PayMethod>('mobile')
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [phone,     setPhone]     = useState('')
  const [operator,  setOperator]  = useState('mtn')

  const { price: priceAmount, label: price, eurLabel } = usePrice()

  async function recordPayment(method: string) {
    const { data } = await (supabase as any).from('payments').insert({
      user_id: userId, amount: priceAmount, currency: 'XOF',
      payment_method: method, plan: 'lifetime', status: 'pending',
    }).select().single()
    return data
  }

  async function activateAccess() {
    await (supabase as any).from('profiles').update({
      has_access: true, access_type: 'lifetime', access_expires_at: null,
    }).eq('id', userId)
  }

  async function handlePay() {
    setLoading(true)
    const payment = await recordPayment(payMethod === 'mobile' ? operator : payMethod)

    /* ──────────────────────────────────────────────────────────────────
       TODO: Connectez votre API de paiement selon payMethod :
       'mobile'   → CinetPay, Notchpay, Flutterwave, Pawapay
       'card'     → Stripe PaymentIntent
       'paypal'   → PayPal Buttons SDK
       'cinetpay' → CinetPay checkout redirect
    ────────────────────────────────────────────────────────────────── */

    // DEMO — supprimer en production
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
           style={{ background: '#F5F0FF' }}>
        <div className="text-center max-w-md p-12 rounded-3xl bg-white shadow-xl">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
               style={{ background: 'var(--color-brand)', color: '#fff' }}>
            <span className="w-8 h-8"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M2 12h20"/></svg></span>
          </div>
          <h2 className="text-2xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Accès activé !
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            Bienvenue dans votre bibliothèque catholique. Vous avez maintenant accès à tous les livres pour toujours.
          </p>
          <Link href="/library"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white text-base w-full"
                style={{ background: 'var(--color-brand)' }}>
            Accéder à ma bibliothèque →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#F5F0FF' }}>
      {/* Navbar */}
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b"
              style={{ borderColor: 'rgba(109,40,217,0.12)' }}>
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg"
              style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-brand)' }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--color-brand)' }}>
            <span className="w-4 h-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M2 12h20"/></svg></span>
          </span>
          Catho Biblio
        </Link>
        <span className="text-sm" style={{ color: 'var(--color-muted)' }}>{userEmail}</span>
      </header>

      <div className="max-w-lg mx-auto px-5 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Finalisez votre accès à vie
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '.9rem' }}>
            Un seul paiement. Accès illimité et permanent.
          </p>
        </div>

        {/* Order summary */}
        <div className="rounded-2xl p-6 mb-6 text-white"
             style={{ background: 'linear-gradient(135deg, #3B0764, #6D28D9)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-bold text-sm opacity-70 uppercase tracking-wide">Accès à Vie</div>
              <div className="font-extrabold text-2xl mt-1" style={{ fontFamily: 'var(--font-sora)' }}>
                {price} FCFA <span className="text-sm font-semibold opacity-50">≈ {eurLabel} €</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="w-6 h-6 text-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M2 12h20"/></svg></span>
            </div>
          </div>
          <div className="space-y-2">
            {['500+ livres catholiques', 'Accès permanent et illimité', 'Tous vos appareils', 'Nouveautés incluses à vie'].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/75">
                <span className="w-4 h-4 text-green-400 flex-shrink-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Payment form */}
        <div className="bg-white rounded-2xl border overflow-hidden"
             style={{ borderColor: 'rgba(109,40,217,0.12)' }}>

          <div className="p-6 border-b" style={{ borderColor: 'rgba(109,40,217,0.08)' }}>
            <div className="text-sm font-bold mb-4" style={{ color: 'var(--color-ink)' }}>
              Choisissez votre moyen de paiement
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([
                ['mobile',   'Mobile Money',   'MTN · Orange · Wave · Moov'],
                ['card',     'Carte bancaire',  'Visa · Mastercard'],
                ['paypal',   'PayPal',          'International'],
                ['cinetpay', 'CinetPay',        'Afrique francophone'],
              ] as const).map(([m, name, sub]) => (
                <button key={m} onClick={() => setPayMethod(m)}
                        className="p-3.5 rounded-xl border-2 text-left transition-all"
                        style={{
                          borderColor: payMethod === m ? 'var(--color-brand)' : 'rgba(109,40,217,0.15)',
                          background:  payMethod === m ? 'var(--color-brand-soft)' : '#fff',
                        }}>
                  <div className="text-xs font-bold mb-0.5" style={{ color: 'var(--color-ink)' }}>{name}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Mobile Money fields */}
            {payMethod === 'mobile' && (
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--color-ink-2)' }}>Opérateur</label>
                  <select value={operator} onChange={e => setOperator(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                          style={{ borderColor: 'rgba(109,40,217,0.2)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }}>
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="orange">Orange Money</option>
                    <option value="wave">Wave</option>
                    <option value="moov">Moov Money</option>
                    <option value="airtel">Airtel Money</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--color-ink-2)' }}>Numéro de téléphone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                         placeholder="+225 07 00 00 00 00"
                         className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                         style={{ borderColor: 'rgba(109,40,217,0.2)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
                </div>
                <div className="px-4 py-3 rounded-xl text-xs leading-relaxed"
                     style={{ background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' }}>
                  Vous recevrez une demande de confirmation sur votre téléphone.
                  Approuvez le paiement de <strong>{price} FCFA</strong>.
                </div>
              </div>
            )}

            {/* PayPal / CinetPay info */}
            {(payMethod === 'paypal' || payMethod === 'cinetpay') && (
              <div className="text-center py-4 mb-4" style={{ color: 'var(--color-muted)' }}>
                <p className="text-sm leading-relaxed">
                  Vous serez redirigé vers <strong>{payMethod === 'paypal' ? 'PayPal' : 'CinetPay'}</strong> pour
                  compléter votre paiement de <strong>{price} FCFA</strong>.
                </p>
              </div>
            )}

            <button onClick={handlePay} disabled={loading}
                    className="w-full py-4 rounded-full font-extrabold text-white text-base transition-all disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #3B0764, #6D28D9)', fontFamily: 'var(--font-sora)' }}>
              {loading ? 'Traitement en cours...' : `Payer ${price} FCFA — Accès à Vie`}
            </button>

            <p className="text-center text-xs mt-3" style={{ color: 'var(--color-muted-2)' }}>
              Paiement sécurisé · Accès activé immédiatement
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
