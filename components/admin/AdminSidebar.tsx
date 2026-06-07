'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Icon as I } from '@/components/Icons'
import type { ComponentType } from 'react'

type IconC = ComponentType<{ width?: number; height?: number }>

const NAV: [string, IconC, string][] = [
  ['/admin',           I.Grid,  'Tableau de bord'],
  ['/admin/books',     I.Book,  'Livres'],
  ['/admin/users',     I.Users, 'Utilisateurs'],
  ['/admin/payments',  I.Card,  'Paiements'],
  ['/admin/marketing', I.Mega,  'Marketing'],
  ['/admin/settings',  I.Settings, 'Paramètres'],
]

function Glyph({ icon, size = 18 }: { icon: IconC; size?: number }) {
  const C = icon
  return <span style={{ display: 'inline-flex', width: size, height: size }}><C width={size} height={size} /></span>
}

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const Brand = (
    <div className="p-5 border-b flex items-center gap-2 font-extrabold text-white"
         style={{ fontFamily: 'var(--font-sora)', borderColor: 'rgba(255,255,255,0.1)' }}>
      <span style={{ color: 'var(--color-gold-light)', display: 'inline-flex', width: 18, height: 18 }}><I.Cross width={18} height={18} /></span>
      Catho Biblio
    </div>
  )

  const Panel = (
    <>
      {Brand}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(([href, icon, label]) => (
          <Link key={href} href={href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={pathname === href ? { background: 'var(--color-brand)', color: '#fff' } : { color: 'rgba(255,255,255,0.6)' }}>
            <Glyph icon={icon} /> {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="text-xs mb-3 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{userEmail}</div>
        <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all" style={{ color: '#FC8181' }}>
          <Glyph icon={I.Logout} size={16} /> Déconnexion
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Barre du haut — mobile uniquement */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14"
           style={{ background: 'var(--color-dark)' }}>
        <span className="flex items-center gap-2 text-white font-extrabold" style={{ fontFamily: 'var(--font-sora)' }}>
          <span style={{ color: 'var(--color-gold-light)', display: 'inline-flex', width: 18, height: 18 }}><I.Cross width={18} height={18} /></span>
          Catho Biblio
        </span>
        <button onClick={() => setOpen(true)} aria-label="Menu" className="text-white">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      {/* Barre latérale — ordinateur */}
      <aside className="hidden md:flex w-56 flex-shrink-0 flex-col h-screen sticky top-0" style={{ background: 'var(--color-dark)' }}>
        {Panel}
      </aside>

      {/* Tiroir — mobile */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div onClick={() => setOpen(false)} className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />
          <aside className="absolute inset-y-0 left-0 w-64 flex flex-col" style={{ background: 'var(--color-dark)' }}>
            <button onClick={() => setOpen(false)} aria-label="Fermer" className="absolute top-4 right-3 text-white/70 z-10">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {Panel}
          </aside>
        </div>
      )}
    </>
  )
}
