import { db } from './client'
import type { TablesInsert } from '@/lib/database.types'

/** Commandes / informations clients collectées au checkout. */
export const ordersService = {
  create: (payload: TablesInsert<'orders'>) => db().from('orders').insert(payload),
}
