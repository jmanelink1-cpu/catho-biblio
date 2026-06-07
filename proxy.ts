import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Deny-by-default : tout est protégé SAUF cette liste blanche publique.
const PUBLIC_EXACT = new Set(['/', '/apercu', '/acheter'])
function isPublic(path: string): boolean {
  if (PUBLIC_EXACT.has(path)) return true
  if (path.startsWith('/auth/')) return true // login, register, callback, forgot-password, reset
  return false
}

export async function proxy(req: NextRequest) {
  const res = NextResponse.next({ request: req })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // Si l'environnement n'est pas configuré, ne pas casser tout le site :
  // les contrôles par page restent en place.
  if (!url || !key) return res

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet) =>
        cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !isPublic(req.nextUrl.pathname)) {
    const redirect = req.nextUrl.clone()
    redirect.pathname = '/auth/login'
    redirect.search = ''
    return NextResponse.redirect(redirect)
  }

  return res
}

export const config = {
  // Protège toutes les routes sauf les assets statiques.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|covers/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
}
