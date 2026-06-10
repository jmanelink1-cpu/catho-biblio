import { createClient } from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import LibraryShell      from './LibraryShell'
import { DEMO_BOOKS }    from '@/lib/demoBooks'
import type { Book, Profile } from '@/lib/types'

export default async function LibraryPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Accès réservé aux utilisateurs ayant payé (ou aux admins)
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile?.has_access && !profile?.is_admin) redirect('/pricing')

  const { data: books } = await supabase.from('books').select('*').order('created_at', { ascending: false })

  const realBooks = (books ?? []) as Book[]
  const isDemo    = realBooks.length === 0

  return (
    <LibraryShell
      books={isDemo ? DEMO_BOOKS : realBooks}
      profile={(profile ?? {}) as Profile}
      userEmail={user.email ?? ''}
      isDemo={isDemo}
    />
  )
}
