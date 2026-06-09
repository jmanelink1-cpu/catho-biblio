import { db } from './client'

/** Suivi de lecture (progression par livre, propre à chaque utilisateur). */
export const readingService = {
  getProgress: async (userId: string): Promise<Record<string, number>> => {
    const { data } = await db().from('reading_progress').select('book_id, progress').eq('user_id', userId)
    const map: Record<string, number> = {}
    ;(data ?? []).forEach((r: { book_id: string; progress: number }) => { map[r.book_id] = r.progress })
    return map
  },
  markStarted: (userId: string, bookId: string) =>
    db().from('reading_progress').upsert({ user_id: userId, book_id: bookId, progress: 10 }, { onConflict: 'user_id,book_id' }),
  markFinished: (userId: string, bookId: string) =>
    db().from('reading_progress').upsert(
      { user_id: userId, book_id: bookId, progress: 100, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,book_id' },
    ),
}
