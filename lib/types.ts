export interface Book {
  id: string
  title: string
  author: string | null
  description: string | null
  category: string | null
  cover_url: string | null
  drive_file_id: string
  language: string
  year: number | null
  pages: number | null
  is_featured: boolean
  created_at: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  has_access: boolean
  access_type: 'monthly' | 'yearly' | 'lifetime' | null
  access_expires_at: string | null
  is_admin: boolean
  created_at: string
}

export interface Payment {
  id: string
  user_id: string | null
  amount: number | null
  currency: string | null
  payment_method: string | null
  transaction_id: string | null
  plan: string | null
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  metadata: Record<string, unknown> | null
  created_at: string
  profiles?: Pick<Profile, 'full_name' | 'email'>
}

export type BookCategory =
  | 'bible'
  | 'catechisme'
  | 'saints'
  | 'spiritualite'
  | 'theologie'
  | 'liturgie'
  | 'priere'
  | 'papes'
  | 'jeunesse'
  | 'famille'

export const CATEGORIES: { value: BookCategory; label: string; emoji: string }[] = [
  { value: 'bible',        label: 'Bible',                 emoji: '📖' },
  { value: 'catechisme',   label: 'Catéchisme',            emoji: '📜' },
  { value: 'saints',       label: 'Saints',                emoji: '✨' },
  { value: 'spiritualite', label: 'Spiritualité',          emoji: '🙏' },
  { value: 'theologie',    label: 'Théologie',             emoji: '🎓' },
  { value: 'liturgie',     label: 'Liturgie',              emoji: '⛪' },
  { value: 'priere',       label: 'Prière',                emoji: '📿' },
  { value: 'papes',        label: 'Documents Pontificaux', emoji: '👑' },
  { value: 'jeunesse',     label: 'Jeunesse',              emoji: '🌟' },
  { value: 'famille',      label: 'Famille',               emoji: '👨‍👩‍👧' },
]

export const PLANS = {
  monthly:  { label: 'Mensuel',  price: 2000,  duration_days: 30,  currency: 'FCFA' },
  yearly:   { label: 'Annuel',   price: 15000, duration_days: 365, currency: 'FCFA' },
  lifetime: { label: 'À Vie',    price: 35000, duration_days: null, currency: 'FCFA' },
} as const

export type PlanKey = keyof typeof PLANS
