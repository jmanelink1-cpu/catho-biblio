import { db } from './client'

/** Paramètres de la plateforme (prix) côté client. */
export const settingsService = {
  get: async (): Promise<{ price: number; currency: string } | null> => {
    const { data } = await db().from('app_settings').select('price, currency').eq('id', 1).single()
    return data ?? null
  },
  update: (price: number, currency: string) =>
    db().from('app_settings').update({ price, currency }).eq('id', 1),
}
