import { describe, it, expect } from 'vitest'
import { eurFromFcfa, FCFA_PER_EUR } from '@/lib/format'

describe('eurFromFcfa', () => {
  it('convertit 10 300 FCFA ≈ 16 €', () => {
    expect(eurFromFcfa(10300)).toBe(16)
  })
  it('convertit le prix par défaut sur le taux fixe', () => {
    expect(eurFromFcfa(FCFA_PER_EUR)).toBe(1)
    expect(eurFromFcfa(FCFA_PER_EUR * 5)).toBe(5)
  })
  it('renvoie 0 pour 0', () => {
    expect(eurFromFcfa(0)).toBe(0)
  })
})
