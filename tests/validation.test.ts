import { describe, it, expect } from 'vitest'
import { registerSchema, checkoutSchema, loginSchema, firstError } from '@/lib/validation'

describe('registerSchema', () => {
  it('accepte une inscription valide', () => {
    const r = registerSchema.safeParse({ fullName: 'Jean Dupont', email: 'jean@example.com', password: 'motdepasse', confirm: 'motdepasse' })
    expect(r.success).toBe(true)
  })
  it('refuse un email invalide', () => {
    const r = registerSchema.safeParse({ fullName: 'Jean Dupont', email: 'pas-un-email', password: 'motdepasse', confirm: 'motdepasse' })
    expect(firstError(r)).toBe('Adresse email invalide.')
  })
  it('refuse un mot de passe trop court', () => {
    const r = registerSchema.safeParse({ fullName: 'Jean Dupont', email: 'jean@example.com', password: '123', confirm: '123' })
    expect(firstError(r)).toMatch(/8 caractères/)
  })
  it('refuse des mots de passe différents', () => {
    const r = registerSchema.safeParse({ fullName: 'Jean Dupont', email: 'jean@example.com', password: 'motdepasse', confirm: 'autre1234' })
    expect(firstError(r)).toMatch(/correspondent pas/)
  })
})

describe('checkoutSchema', () => {
  it('accepte un checkout valide', () => {
    expect(checkoutSchema.safeParse({ firstName: 'Jean', lastName: 'Dupont', email: 'j@e.com', country: 'Sénégal' }).success).toBe(true)
  })
  it('refuse un pays vide', () => {
    const r = checkoutSchema.safeParse({ firstName: 'Jean', lastName: 'Dupont', email: 'j@e.com', country: '' })
    expect(firstError(r)).toMatch(/pays/i)
  })
})

describe('loginSchema', () => {
  it('exige email et mot de passe', () => {
    expect(loginSchema.safeParse({ email: '', password: '' }).success).toBe(false)
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true)
  })
})

describe('firstError', () => {
  it('renvoie null si valide', () => {
    expect(firstError(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }))).toBeNull()
  })
})
