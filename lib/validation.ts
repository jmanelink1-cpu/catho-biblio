import { z } from 'zod'

const email = z.string().trim().min(1, 'Entrez votre email.')
  .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'Adresse email invalide.')

/** Inscription */
export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Entrez votre nom complet.').max(80),
  email,
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: 'Les mots de passe ne correspondent pas.', path: ['confirm'] })

/** Checkout (paiement) */
export const checkoutSchema = z.object({
  firstName: z.string().trim().min(1, 'Entrez votre prénom.').max(80),
  lastName:  z.string().trim().min(1, 'Entrez votre nom.').max(80),
  email,
  country:   z.string().min(1, 'Sélectionnez votre pays.'),
})

/** Connexion */
export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Entrez votre mot de passe.'),
})

/** Renvoie le 1er message d'erreur d'un safeParse, ou null si valide. */
export function firstError(result: { success: boolean; error?: z.ZodError }): string | null {
  if (result.success) return null
  return result.error?.issues[0]?.message ?? 'Données invalides.'
}
