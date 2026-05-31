'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/admin',          icon: '📊', label: 'Tableau de bord' },
  { href: '/admin/books',    icon: '📚', label: 'Livres' },
  { href: '/admin/users',    icon: '👤', label: 'Utilisateurs' },
  { href: '/admin/payments', icon: '💳', label: 'Paiements' },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-screen sticky top-0"
           style={{ background: 'var(--color-dark)' }}>
      <div className="p-5 border-b flex items-center gap-2 font-extrabold text-white"
           style={{ fontFamily: 'var(--font-sora)', borderColor: 'rgba(255,255,255,0.1)' }}>
        <span style={{ color: 'var(--color-gold-light)' }}>✝</span> Catho Biblio
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(item => (
          <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={pathname === item.href
                  ? { background: 'var(--color-brand)', color: '#fff' }
                  : { color: 'rgba(255,255,255,0.6)' }}>
            <span>{item.icon}</span> {item.label}
          </Link>
        ))}
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
        <Link href="/library"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
          🏠 Bibliothèque
        </Link>
      </nav>

      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="text-xs mb-3 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{userEmail}</div>
        <button onClick={logout}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all"
                style={{ color: '#FC8181' }}>
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  )
}
