import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Protect /library and /reader — must be logged in with active access
  if (path.startsWith('/library') || path.startsWith('/reader')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_access, access_type, access_expires_at, is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      const hasAccess = profile?.has_access &&
        (profile.access_type === 'lifetime' ||
          !profile.access_expires_at ||
          new Date(profile.access_expires_at) > new Date())
      if (!hasAccess) {
        return NextResponse.redirect(new URL('/pricing', request.url))
      }
    }
  }

  // Protect /admin — must be admin
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/library', request.url))
    }
  }

  // Redirect already-logged-in users away from auth pages
  if ((path.startsWith('/auth/login') || path.startsWith('/auth/register')) && user) {
    return NextResponse.redirect(new URL('/library', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
