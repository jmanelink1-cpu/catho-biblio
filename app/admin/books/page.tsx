import { createClient } from '@/lib/supabase/server'
import AdminBooksClient from './AdminBooksClient'
import type { Book } from '@/lib/types'

export default async function AdminBooksPage() {
  const supabase = await createClient()
  const { data } = await (supabase as any).from('books').select('*').order('created_at', { ascending: false })
  return <AdminBooksClient initialBooks={(data ?? []) as Book[]} />
}
