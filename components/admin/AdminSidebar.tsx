'use client'

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

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-screen sticky top-0" style={{ background: 'var(--color-dark)' }}>
      <div className="p-5 border-b flex items-center gap-2 font-extrabold text-white"
           style={{ fontFamily: 'var(--font-sora)', borderColor: 'rgba(255,255,255,0.1)' }}>
        <span style={{ color: 'var(--color-gold-light)', display: 'inline-flex', width: 18, height: 18 }}><I.Cross width={18} height={18} /></span>
        Catho Biblio
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(([href, icon, label]) => (
          <Link key={href} href={href}
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
    </aside>
  )
}
