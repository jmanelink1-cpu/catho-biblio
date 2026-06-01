import { createClient } from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import LibraryClient     from './LibraryClient'
import { DEMO_BOOKS }    from '@/lib/demoBooks'
import type { Book, Profile } from '@/lib/types'

export default async function LibraryPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: books }, { data: profile }] = await Promise.all([
    (supabase as any).from('books').select('*').order('created_at', { ascending: false }),
    (supabase as any).from('profiles').select('*').eq('id', user.id).single(),
  ])

  const realBooks = (books ?? []) as Book[]
  const isDemo    = realBooks.length === 0

  return (
    <LibraryClient
      books={isDemo ? DEMO_BOOKS : realBooks}
      profile={(profile ?? {}) as Profile}
      userEmail={user.email ?? ''}
      isDemo={isDemo}
    />
  )
}
