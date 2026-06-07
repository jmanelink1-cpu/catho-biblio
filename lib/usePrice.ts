'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SINGLE_PLAN } from '@/lib/types'

/**
 * Récupère le prix d'accès dynamique (table app_settings, lisible publiquement).
 * Repli sur la valeur par défaut le temps du chargement / si la table manque.
 */
export function usePrice() {
  const [price, setPrice]       = useState<number>(SINGLE_PLAN.price)
  const [currency, setCurrency] = useState<string>('FCFA')

  useEffect(() => {
    const db = createClient() as any
    db.from('app_settings').select('price, currency').eq('id', 1).single()
      .then(({ data }: any) => {
        if (data?.price != null) setPrice(data.price)
        if (data?.currency) setCurrency(data.currency)
      })
      .catch(() => {})
  }, [])

  return { price, currency, label: price.toLocaleString('fr-FR') }
}
