'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Icon as I } from '@/components/Icons'

export default function SettingsClient({ initialPrice, initialCurrency }: { initialPrice: number; initialCurrency: string }) {
  const [price, setPrice]       = useState(String(initialPrice))
  const [currency, setCurrency] = useState(initialCurrency)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState('')
  const [ok, setOk]             = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setMsg('')
    const value = parseInt(price, 10)
    if (isNaN(value) || value < 0) { setSaving(false); setOk(false); setMsg('Prix invalide.'); return }
    const db = createClient() as any
    const { error } = await db.from('app_settings').update({ price: value, currency: currency.trim() || 'FCFA' }).eq('id', 1)
    setSaving(false)
    setOk(!error)
    setMsg(error ? `Erreur : ${error.message}` : 'Enregistré ✔ — le nouveau prix s\'affiche maintenant partout (accueil, checkout, etc.).')
  }

  return (
    <div>
      <div className="h-14 flex items-center gap-2 px-6 border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <span style={{ color: 'var(--color-brand)', display: 'inline-flex', width: 20, height: 20 }}><I.Settings width={20} height={20} /></span>
        <h1 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Paramètres</h1>
      </div>

      <div className="p-6">
        <div className="rounded-2xl border p-6 max-w-md" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>Prix d&apos;accès</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--color-muted)' }}>
            Le paiement unique à vie. Toute modification est répercutée automatiquement sur l&apos;ensemble de la plateforme.
          </p>
          <form onSubmit={save} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>Prix</label>
                <input type="number" min={0} value={price} onChange={e => setPrice(e.target.value)}
                       className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
              </div>
              <div style={{ width: 110 }}>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>Devise</label>
                <input value={currency} onChange={e => setCurrency(e.target.value)}
                       className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ borderColor: 'var(--color-border)', background: 'var(--color-subtle)', color: 'var(--color-ink)' }} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-full text-sm font-bold text-white disabled:opacity-60" style={{ background: 'var(--color-brand)' }}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            {msg && <p className="text-xs" style={{ color: ok ? '#16A34A' : '#DC2626' }}>{msg}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
