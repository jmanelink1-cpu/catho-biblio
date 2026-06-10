import { db } from './client'
import type { TablesInsert } from '@/lib/database.types'

/** Codes promo (admin) + validation publique (checkout). */
export const promoService = {
  create: (payload: TablesInsert<'promo_codes'>) =>
    db().from('promo_codes').insert(payload).select().single(),
  setActive: (id: string, active: boolean) => db().from('promo_codes').update({ active }).eq('id', id),
  remove: (id: string) => db().from('promo_codes').delete().eq('id', id),

  /** Valide un code précis sans jamais exposer la liste (RPC SECURITY DEFINER). */
  validate: async (code: string): Promise<number | null> => {
    const { data } = await db().rpc('validate_promo', { p_code: code })
    const row = Array.isArray(data) ? data[0] : data
    return row?.discount_percent ?? null
  },
}
