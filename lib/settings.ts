import { createClient } from '@/lib/supabase/server'
import { SINGLE_PLAN } from '@/lib/types'

/** Prix d'accès dynamique, lu côté serveur. Repli sur la valeur par défaut. */
export async function getSettings(): Promise<{ price: number; currency: string }> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('app_settings').select('price, currency').eq('id', 1).single()
    if (data?.price != null) return { price: data.price, currency: data.currency ?? 'FCFA' }
  } catch {}
  return { price: SINGLE_PLAN.price, currency: 'FCFA' }
}
