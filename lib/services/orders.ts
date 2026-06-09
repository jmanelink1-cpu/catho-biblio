import { db } from './client'

/** Commandes / informations clients collectées au checkout. */
export const ordersService = {
  create: (payload: { first_name: string; last_name: string; email: string; country: string; promo_code: string | null }) =>
    db().from('orders').insert(payload),
}
