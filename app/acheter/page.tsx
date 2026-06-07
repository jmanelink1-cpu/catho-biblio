'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SINGLE_PLAN, PAYMENT_PAGE_URL } from '@/lib/types'
import { Icon as I } from '@/components/Icons'

const PLUM = '#190A2E', GOLD = '#C99A3B', GOLD_L = '#E3BE6E', IVORY = '#FBF8F3'

// Pays prioritaires (cœur de marché) affichés en premier
const PRIORITY_COUNTRIES = [
  'Sénégal', "Côte d'Ivoire", 'Bénin', 'Burkina Faso', 'Mali', 'Togo', 'Cameroun', 'Congo (RDC)',
]
const OTHER_COUNTRIES = [
  'Algérie', 'Afrique du Sud', 'Allemagne', 'Belgique', 'Burundi', 'Canada', 'Centrafrique',
  'Comores', 'Congo-Brazzaville', 'Djibouti', 'Espagne', 'États-Unis', 'France', 'Gabon',
  'Ghana', 'Guinée', 'Guinée équatoriale', 'Haïti', 'Italie', 'Kenya', 'Luxembourg',
  'Madagascar', 'Maroc', 'Maurice', 'Mauritanie', 'Niger', 'Nigéria', 'Portugal',
  'Royaume-Uni', 'Rwanda', 'Seychelles', 'Suisse', 'Tchad', 'Tunisie',
]

export default function CheckoutPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [country, setCountry]     = useState('')
  const [promo, setPromo]         = useState('')
  const [discount, setDiscount]   = useState(0)
  const [promoMsg, setPromoMsg]   = useState('')
  const [busy, setBusy]           = useState(false)
  const [err, setErr]             = useState('')
  const [done, setDone]           = useState(false)

  const price = SINGLE_PLAN.price
  const final = Math.round(price * (1 - discount / 100))

  async function applyPromo() {
    setPromoMsg('')
    const code = promo.trim().toUpperCase()
    if (!code) return
    const db = createClient() as any
    const { data } = await db.from('promo_codes').select('*').eq('code', code).eq('active', true).maybeSingle()
    if (!data) { setDiscount(0); setPromoMsg('Code invalide ou expiré.'); return }
    if (data.max_uses && data.uses >= data.max_uses) { setDiscount(0); setPromoMsg('Ce code a atteint sa limite.'); return }
    setDiscount(data.discount_percent)
    setPromoMsg(`Code appliqué : -${data.discount_percent}%`)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !country) {
      setErr('Merci de remplir tous les champs.')
      return
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setErr('Adresse email invalide.'); return }
    setBusy(true)

    // Enregistrer la commande (best effort — n'empêche pas le paiement si la table manque)
    try {
      const db = createClient() as any
      await db.from('orders').insert({
        first_name: firstName.trim(), last_name: lastName.trim(),
        email: email.trim().toLowerCase(), country,
        amount: final, promo_code: discount > 0 ? promo.trim().toUpperCase() : null, status: 'pending',
      })
    } catch {}

    if (PAYMENT_PAGE_URL) {
      const sep = PAYMENT_PAGE_URL.includes('?') ? '&' : '?'
      const params = new URLSearchParams({
        prenom: firstName.trim(), nom: lastName.trim(), email: email.trim().toLowerCase(),
        pays: country, montant: String(final),
      }).toString()
      window.location.href = `${PAYMENT_PAGE_URL}${sep}${params}`
      return
    }

    setBusy(false)
    setDone(true)
  }

  const input = {
    width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: '.95rem', outline: 'none',
    border: '1.5px solid rgba(25,10,46,.14)', background: '#fff', color: PLUM,
  } as const
  const label = { display: 'block', fontSize: '.82rem', fontWeight: 700, color: PLUM, marginBottom: 6 } as const

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg,${PLUM},#2A1248)`, padding: '32px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginBottom: 24 }}>
        <span style={{ width: 32, height: 32, borderRadius: 9, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PLUM }}>
          <span style={{ width: 17, height: 17 }}><I.Cross /></span>
        </span>
        <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.1rem', color: IVORY }}>Catho Biblio</span>
      </Link>

      <div style={{ width: '100%', maxWidth: 480, background: IVORY, borderRadius: 22, padding: 30, boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span style={{ width: 28, height: 28 }}><I.Check /></span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.3rem', color: PLUM, marginBottom: 8 }}>Informations enregistrées</h2>
            <p style={{ fontSize: '.92rem', color: '#6B6478', lineHeight: 1.5 }}>
              Merci {firstName} ! Vos informations ont bien été reçues. Le système de paiement sera disponible très bientôt, et vous recevrez l&apos;accès à votre bibliothèque par email.
            </p>
            <Link href="/apercu" style={{ display: 'inline-block', marginTop: 20, color: GOLD, fontWeight: 700, textDecoration: 'none' }}>Voir un aperçu de la bibliothèque →</Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.45rem', color: PLUM, marginBottom: 4 }}>Finaliser votre accès</h1>
            <p style={{ fontSize: '.9rem', color: '#6B6478', marginBottom: 22 }}>Un seul paiement, accès à vie à plus de 500 ouvrages.</p>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={label}>Prénom</label>
                  <input style={input} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jean" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={label}>Nom</label>
                  <input style={input} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Dupont" />
                </div>
              </div>
              <div>
                <label style={label}>Adresse email</label>
                <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com" />
              </div>
              <div>
                <label style={label}>Pays</label>
                <select style={{ ...input, appearance: 'auto' }} value={country} onChange={e => setCountry(e.target.value)}>
                  <option value="">Sélectionnez votre pays</option>
                  <optgroup label="Pays principaux">
                    {PRIORITY_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="Autres pays">
                    {OTHER_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="Autre">Autre</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label style={label}>Code promo (facultatif)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input style={{ ...input, textTransform: 'uppercase' }} value={promo} onChange={e => setPromo(e.target.value)} placeholder="Ex. NOEL2026" />
                  <button type="button" onClick={applyPromo} style={{ flexShrink: 0, padding: '0 18px', borderRadius: 12, border: `1.5px solid ${PLUM}`, background: '#fff', color: PLUM, fontWeight: 700, cursor: 'pointer' }}>Appliquer</button>
                </div>
                {promoMsg && <p style={{ fontSize: '.8rem', marginTop: 6, color: discount > 0 ? '#16A34A' : '#DC2626' }}>{promoMsg}</p>}
              </div>

              {/* Total */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: 'rgba(25,10,46,.05)', marginTop: 4 }}>
                <span style={{ fontWeight: 700, color: PLUM }}>Total à payer</span>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  {discount > 0 && <span style={{ textDecoration: 'line-through', color: '#9A92A8', fontSize: '.9rem' }}>{price.toLocaleString('fr-FR')}</span>}
                  <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '1.3rem', color: PLUM }}>{final.toLocaleString('fr-FR')} <span style={{ fontSize: '.8rem', fontWeight: 600 }}>FCFA</span></span>
                </span>
              </div>

              {err && <p style={{ fontSize: '.85rem', color: '#DC2626' }}>⚠ {err}</p>}

              <button type="submit" disabled={busy}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '15px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: `linear-gradient(135deg,${GOLD},${GOLD_L})`, color: PLUM, fontWeight: 800, fontSize: '1rem', opacity: busy ? .7 : 1 }}>
                {busy ? 'Traitement…' : <>Procéder au paiement <span style={{ width: 18, height: 18 }}><I.Arrow /></span></>}
              </button>
              <p style={{ fontSize: '.74rem', color: '#9A92A8', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span style={{ width: 13, height: 13 }}><I.Lock /></span> Paiement 100% sécurisé · Accès immédiat après confirmation
              </p>
            </form>
          </>
        )}
      </div>

      <p style={{ marginTop: 20 }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', textDecoration: 'none' }}>← Retour à l&apos;accueil</Link>
      </p>
    </div>
  )
}
