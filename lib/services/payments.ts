import { db } from './client'
import type { TablesInsert } from '@/lib/database.types'

/** Paiements (création + validation). */
export const paymentsService = {
  record: (payload: TablesInsert<'payments'>) => db().from('payments').insert(payload).select().single(),
  complete: (id: string) => db().from('payments').update({ status: 'completed' }).eq('id', id),
}
