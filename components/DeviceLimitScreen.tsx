'use client'

import { useEffect, useState } from 'react'
import { devicesService, type UserDevice } from '@/lib/services/devices'
import { createClient } from '@/lib/supabase/client'
import { SUPPORT_EMAIL } from '@/lib/types'

const PLUM = '#190A2E', GOLD = '#C99A3B', GOLD_L = '#E3BE6E', IVORY = '#FBF8F3'

const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function DeviceLimitScreen() {
  const [devices, setDevices] = useState<UserDevice[]>([])
  const [busy, setBusy] = useState(false)
  const current = devicesService.current()

  useEffect(() => { devicesService.list().then(setDevices).catch(() => {}) }, [])

  async function freeDevice(id: string) {
    setBusy(true)
    const { error } = await devicesService.remove(id)
    setBusy(false)
    if (error) { alert('Erreur : ' + error.message); return }
    // Un créneau est libéré → on recharge pour revendiquer cet appareil
    window.location.reload()
  }

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg,${PLUM},#2A1248)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 18px', textAlign: 'center' }}>
      <div style={{ width: '100%', maxWidth: 460, background: IVORY, borderRadius: 22, padding: 32, boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
        <div style={{ width: 60, height: 60, borderRadius: 999, margin: '0 auto 18px', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.4rem', color: PLUM, marginBottom: 10 }}>Limite de 2 appareils atteinte</h1>
        <p style={{ fontSize: '.92rem', color: '#6B6478', lineHeight: 1.6, marginBottom: 22 }}>
          Votre accès est utilisable sur <strong>2 appareils</strong>. Pour utiliser celui-ci, déconnectez l&apos;un des appareils ci-dessous, puis continuez.
        </p>

        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
          {devices.map(d => (
            <div key={d.device_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', borderRadius: 12, background: '#fff', border: '1px solid rgba(25,10,46,.1)' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '.9rem', fontWeight: 700, color: PLUM }}>{d.label || 'Appareil'}{d.device_id === current ? ' (celui-ci)' : ''}</div>
                <div style={{ fontSize: '.74rem', color: '#9A92A8' }}>Dernière activité : {fmt(d.last_seen)}</div>
              </div>
              {d.device_id !== current && (
                <button onClick={() => freeDevice(d.device_id)} disabled={busy}
                  style={{ flexShrink: 0, fontSize: '.8rem', fontWeight: 700, color: '#DC2626', background: '#FEF2F2', border: 'none', borderRadius: 999, padding: '8px 14px', cursor: 'pointer' }}>
                  Déconnecter
                </button>
              )}
            </div>
          ))}
          {devices.length === 0 && <div style={{ fontSize: '.85rem', color: '#9A92A8' }}>Chargement des appareils…</div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Réinitialiser mes appareils — Catho Biblio')}`}
             style={{ fontSize: '.85rem', fontWeight: 700, color: GOLD, textDecoration: 'none' }}>
            Besoin d&apos;aide ? Contacter le support
          </a>
          <button onClick={logout} style={{ fontSize: '.85rem', color: '#9A92A8', background: 'none', border: 'none', cursor: 'pointer' }}>Se déconnecter</button>
        </div>
      </div>
      <span style={{ marginTop: 18, color: 'rgba(255,255,255,.4)', fontSize: '.8rem', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        <span style={{ width: 12, height: 12, color: GOLD_L }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 2v20M2 12h20"/></svg></span>
        Catho Biblio
      </span>
    </div>
  )
}
