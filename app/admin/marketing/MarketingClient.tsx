'use client'

import { useEffect, useState } from 'react'
import { promoService } from '@/lib/services/promoCodes'
import { Icon as I } from '@/components/Icons'
import { StatCard } from '@/components/ui/Card'
import type { ComponentType } from 'react'

type IconC = ComponentType<{ width?: number; height?: number }>
type Code = { id: string; code: string; discount_percent: number; max_uses: number | null; uses: number; active: boolean; created_at: string }

interface Props {
  stats: { users: number; paid: number; conversion: number; revenue: number; price: number }
  monthlyRevenue: { label: string; amount: number }[]
  codes: Code[]
  codesMissing: boolean
}

function Glyph({ icon, size = 18 }: { icon: IconC; size?: number }) {
  const C = icon
  return <span style={{ display: 'inline-flex', width: size, height: size }}><C width={size} height={size} /></span>
}

const card = { background: 'var(--color-surface)', borderColor: 'var(--color-border)' } as const

export default function MarketingClient({ stats, monthlyRevenue, codes: initialCodes, codesMissing }: Props) {
  const [origin, setOrigin] = useState('https://catho-biblio.vercel.app')
  const [codes, setCodes] = useState<Code[]>(initialCodes)
  const [copied, setCopied] = useState('')

  // create form
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState(20)
  const [maxUses, setMaxUses] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => { if (typeof window !== 'undefined') setOrigin(window.location.origin) }, [])

  const shareUrl = origin
  const message = 'Découvrez Catho Biblio : plus de 500 livres catholiques à lire et télécharger, accès à vie pour un seul paiement.'

  function copy(text: string, key: string) {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 1800)
  }

  function utm(src: string) {
    return `${origin}/?utm_source=${src}&utm_medium=social&utm_campaign=partage`
  }

  const maxRevenue = Math.max(1, ...monthlyRevenue.map(m => m.amount))

  async function addCode(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    const clean = code.trim().toUpperCase().replace(/\s+/g, '')
    if (!clean) { setErr('Entrez un code.'); return }
    setBusy(true)
    const { data, error } = await promoService.create({
      code: clean,
      discount_percent: Math.min(100, Math.max(0, discount)),
      max_uses: maxUses ? parseInt(maxUses, 10) : null,
      active: true,
    })
    setBusy(false)
    if (error) { setErr(error.message.includes('duplicate') ? 'Ce code existe déjà.' : error.message); return }
    setCodes(c => [data as Code, ...c])
    setCode(''); setDiscount(20); setMaxUses('')
  }

  async function toggle(c: Code) {
    setCodes(list => list.map(x => x.id === c.id ? { ...x, active: !x.active } : x))
    await promoService.setActive(c.id, !c.active)
  }

  async function remove(c: Code) {
    setCodes(list => list.filter(x => x.id !== c.id))
    await promoService.remove(c.id)
  }

  const funnel = [
    { icon: I.Users, label: 'Inscrits',        value: stats.users.toLocaleString('fr-FR'),                 fg: '#2563EB', bg: '#EEF6FF' },
    { icon: I.Check, label: 'Clients payants',  value: stats.paid.toLocaleString('fr-FR'),                  fg: '#16A34A', bg: '#F0FDF4' },
    { icon: I.Trend, label: 'Taux de conversion', value: stats.conversion.toFixed(1) + ' %',                fg: 'var(--color-brand)', bg: 'var(--color-brand-soft)' },
    { icon: I.Money, label: 'Revenus (FCFA)',   value: stats.revenue.toLocaleString('fr-FR'),               fg: 'var(--color-gold)', bg: 'var(--color-gold-soft)' },
  ]

  const socials: { label: string; icon: IconC; href: string }[] = [
    { label: 'WhatsApp', icon: I.Phone, href: `https://wa.me/?text=${encodeURIComponent(message + ' ' + utm('whatsapp'))}` },
    { label: 'Facebook', icon: I.Share, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(utm('facebook'))}` },
    { label: 'Telegram', icon: I.Share, href: `https://t.me/share/url?url=${encodeURIComponent(utm('telegram'))}&text=${encodeURIComponent(message)}` },
    { label: 'Email',    icon: I.Inf,   href: `mailto:?subject=${encodeURIComponent('Catho Biblio')}&body=${encodeURIComponent(message + '\n\n' + utm('email'))}` },
  ]

  return (
    <div>
      <div className="h-14 flex items-center gap-2 px-6 border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <span style={{ color: 'var(--color-brand)' }}><Glyph icon={I.Mega} size={20} /></span>
        <h1 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Marketing</h1>
      </div>

      <div className="p-6 space-y-6">

        {/* Funnel */}
        <div>
          <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--color-ink)' }}>Conversion & croissance</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {funnel.map(f => <StatCard key={f.label} icon={f.icon} label={f.label} value={f.value} bg={f.bg} fg={f.fg} />)}
          </div>
        </div>

        {/* Revenue chart */}
        <div className="rounded-2xl border p-6" style={card}>
          <h3 className="font-bold mb-5" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Revenus — 6 derniers mois</h3>
          <div className="flex items-end gap-4" style={{ height: 150 }}>
            {monthlyRevenue.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2" title={`${m.label} : ${m.amount.toLocaleString('fr-FR')} FCFA`}>
                <span className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>{m.amount > 0 ? (m.amount / 1000).toFixed(0) + 'k' : ''}</span>
                <div style={{ width: '100%', maxWidth: 48, height: `${(m.amount / maxRevenue) * 100}%`, minHeight: m.amount > 0 ? 6 : 1, background: 'var(--color-gold)', borderRadius: '4px 4px 0 0' }} />
                <span className="text-[11px]" style={{ color: 'var(--color-muted-2)' }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Share & referral */}
        <div className="rounded-2xl border p-6" style={card}>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: 'var(--color-brand)' }}><Glyph icon={I.Share} size={18} /></span>
            <h3 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Partage & parrainage</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>Partagez ces liens pour attirer de nouveaux lecteurs. Chaque canal est tracé (UTM) pour mesurer ce qui marche.</p>

          {/* base link */}
          <div className="flex items-center gap-2 mb-4">
            <input readOnly value={shareUrl} className="flex-1 px-3 py-2.5 rounded-xl border text-sm" style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
            <button onClick={() => copy(shareUrl, 'base')} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--color-brand)' }}>
              <Glyph icon={I.Copy} size={15} /> {copied === 'base' ? 'Copié !' : 'Copier'}
            </button>
          </div>

          {/* social buttons */}
          <div className="flex flex-wrap gap-2">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                 style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}>
                <Glyph icon={s.icon} size={16} /> {s.label}
              </a>
            ))}
            <button onClick={() => copy(message + ' ' + utm('copie'), 'msg')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}>
              <Glyph icon={I.Copy} size={16} /> {copied === 'msg' ? 'Message copié !' : 'Copier le message'}
            </button>
          </div>
        </div>

        {/* Promo codes */}
        <div className="rounded-2xl border p-6" style={card}>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: 'var(--color-brand)' }}><Glyph icon={I.Tag} size={18} /></span>
            <h3 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Codes promo</h3>
          </div>

          {codesMissing ? (
            <div className="mt-3 p-4 rounded-xl text-sm" style={{ background: 'var(--color-gold-soft)', color: 'var(--color-ink)' }}>
              <p className="font-semibold mb-1">Table manquante</p>
              <p className="mb-2" style={{ color: 'var(--color-muted)' }}>Pour activer les codes promo, exécutez le script <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--color-subtle)' }}>SUPABASE_PROMO.sql</code> dans Supabase, puis rechargez cette page.</p>
            </div>
          ) : (
            <>
              <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>Créez des codes de réduction à partager dans vos campagnes.</p>
              <form onSubmit={addCode} className="flex flex-wrap items-end gap-3 mb-5">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>Code</label>
                  <input value={code} onChange={e => setCode(e.target.value)} placeholder="NOEL2026"
                         className="px-3 py-2 rounded-xl border text-sm uppercase" style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)', width: 150 }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>Réduction %</label>
                  <input type="number" min={0} max={100} value={discount} onChange={e => setDiscount(parseInt(e.target.value || '0', 10))}
                         className="px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)', width: 100 }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>Limite (vide = ∞)</label>
                  <input type="number" min={1} value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="∞"
                         className="px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)', width: 120 }} />
                </div>
                <button type="submit" disabled={busy} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ background: 'var(--color-brand)' }}>
                  <Glyph icon={I.Plus} size={15} /> {busy ? '...' : 'Créer'}
                </button>
              </form>
              {err && <p className="text-xs mb-3" style={{ color: '#DC2626' }}>{err}</p>}

              {codes.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Aucun code pour le moment.</p>
              ) : (
                <div className="space-y-2">
                  {codes.map(c => {
                    const price = stats.price
                    const final = Math.round(price * (1 - c.discount_percent / 100))
                    return (
                      <div key={c.id} className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg" style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>{c.code}</span>
                          <span className="text-sm" style={{ color: 'var(--color-ink)' }}>-{c.discount_percent}%</span>
                          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>→ {final.toLocaleString('fr-FR')} FCFA</span>
                          <span className="text-xs" style={{ color: 'var(--color-muted-2)' }}>· {c.uses}{c.max_uses ? '/' + c.max_uses : ''} util.</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => toggle(c)} className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                                  style={c.active ? { background: '#F0FDF4', color: '#16A34A' } : { background: 'var(--color-subtle)', color: 'var(--color-muted)' }}>
                            {c.active ? 'Actif' : 'Inactif'}
                          </button>
                          <button onClick={() => remove(c)} aria-label="Supprimer" style={{ color: '#DC2626' }}><Glyph icon={I.Trash} size={16} /></button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
