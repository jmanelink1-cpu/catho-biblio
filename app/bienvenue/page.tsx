import Link from 'next/link'
import { Icon as I } from '@/components/Icons'

export const dynamic = 'force-dynamic'

const PLUM = '#190A2E', GOLD = '#C99A3B', GOLD_L = '#E3BE6E', IVORY = '#FBF8F3'

// Page d'atterrissage après paiement (URL de retour du prestataire).
export default function BienvenuePage() {
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg,${PLUM},#2A1248)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 18px', textAlign: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480, background: IVORY, borderRadius: 22, padding: 36, boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, margin: '0 auto 20px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 32, height: 32 }}><I.Check /></span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.6rem', color: PLUM, marginBottom: 10 }}>Paiement confirmé 🎉</h1>
        <p style={{ fontSize: '.96rem', color: '#6B6478', lineHeight: 1.6, marginBottom: 26 }}>
          Merci ! Votre accès à vie à toute la bibliothèque est activé. Un email de confirmation vous a également été envoyé avec un lien d&apos;accès.
        </p>
        <Link href="/library"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '15px 28px', borderRadius: 999,
            background: `linear-gradient(135deg,${GOLD},${GOLD_L})`, color: PLUM, fontWeight: 800, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 12px 32px rgba(201,154,59,.4)' }}>
          Accéder à ma bibliothèque <span style={{ width: 18, height: 18 }}><I.Arrow /></span>
        </Link>
        <p style={{ marginTop: 18, fontSize: '.8rem', color: '#9A92A8' }}>
          Si la bibliothèque demande une connexion, utilisez l&apos;email indiqué lors de l&apos;achat.
        </p>
      </div>
      <Link href="/" style={{ marginTop: 20, color: 'rgba(255,255,255,.6)', fontSize: '.85rem', textDecoration: 'none' }}>← Retour à l&apos;accueil</Link>
    </div>
  )
}
