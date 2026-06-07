import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReaderClient from './ReaderClient'
import type { Book } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function ReaderPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Lecture réservée aux utilisateurs ayant payé (ou admins)
  const { data: profile } = await (supabase as any).from('profiles').select('has_access, is_admin').eq('id', user.id).single()
  if (!profile?.has_access && !profile?.is_admin) redirect('/pricing')

  if (!id) redirect('/library')

  // Le drive_file_id est lu côté SERVEUR depuis la base (jamais via l'URL) ;
  // la RLS garantit qu'il n'est accessible qu'aux ayants droit.
  const { data: book } = await (supabase as any).from('books').select('*').eq('id', id).single()
  if (!book) redirect('/library')

  return <ReaderClient book={book as Book} userId={user.id} />
}
