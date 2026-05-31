import { createClient } from '@/lib/supabase/server'
import AdminUsersClient from './AdminUsersClient'
import type { Profile } from '@/lib/types'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  return <AdminUsersClient initialUsers={(data ?? []) as Profile[]} />
}
