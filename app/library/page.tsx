import { createClient } from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import LibraryClient     from './LibraryClient'
import type { Book, Profile } from '@/lib/types'

export default async function LibraryPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: books }, { data: profile }] = await Promise.all([
    supabase.from('books').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
  ])

  return (
    <LibraryClient
      books={(books ?? []) as Book[]}
      profile={(profile ?? {}) as Profile}
      userEmail={user.email ?? ''}
    />
  )
}
