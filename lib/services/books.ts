import { db } from './client'
import type { Book } from '@/lib/types'

/** Gestion du catalogue de livres (admin). */
export const booksService = {
  list: async (): Promise<Book[]> => {
    const { data } = await db().from('books').select('*').order('created_at', { ascending: false })
    return (data ?? []) as Book[]
  },
  create: (payload: Record<string, unknown>) => db().from('books').insert(payload),
  update: (id: string, payload: Record<string, unknown>) => db().from('books').update(payload).eq('id', id),
  remove: (id: string) => db().from('books').delete().eq('id', id),
}
