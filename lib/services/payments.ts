import { db } from './client'

/** Paiements (création + validation). */
export const paymentsService = {
  record: (payload: Record<string, unknown>) => db().from('payments').insert(payload).select().single(),
  complete: (id: string) => db().from('payments').update({ status: 'completed' }).eq('id', id),
}
