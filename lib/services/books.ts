import { db } from './client'
import type { Book } from '@/lib/types'
import type { TablesInsert, TablesUpdate } from '@/lib/database.types'

/** Gestion du catalogue de livres (admin). */
export const booksService = {
  list: async (): Promise<Book[]> => {
    const { data } = await db().from('books').select('*').order('created_at', { ascending: false })
    return (data ?? []) as Book[]
  },
  create: (payload: TablesInsert<'books'>) => db().from('books').insert(payload),
  update: (id: string, payload: TablesUpdate<'books'>) => db().from('books').update(payload).eq('id', id),
  remove: (id: string) => db().from('books').delete().eq('id', id),
}
