'use client'

import { useEffect, useState } from 'react'
import { settingsService } from '@/lib/services/settings'
import { eurFromFcfa } from '@/lib/format'
import { SINGLE_PLAN } from '@/lib/types'

/**
 * Récupère le prix d'accès dynamique (table app_settings, lisible publiquement).
 * Repli sur la valeur par défaut le temps du chargement / si la table manque.
 */
export function usePrice() {
  const [price, setPrice]       = useState<number>(SINGLE_PLAN.price)
  const [currency, setCurrency] = useState<string>('FCFA')

  useEffect(() => {
    settingsService.get()
      .then(s => { if (s?.price != null) setPrice(s.price); if (s?.currency) setCurrency(s.currency) })
      .catch(() => {})
  }, [])

  const eur = eurFromFcfa(price)
  return { price, currency, label: price.toLocaleString('fr-FR'), eur, eurLabel: eur.toLocaleString('fr-FR') }
}
