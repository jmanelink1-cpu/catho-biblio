import { createClient } from '@/lib/supabase/client'

/**
 * Accès bas-niveau à Supabase pour les services côté client.
 * L'UI n'importe JAMAIS ceci directement — elle passe par les services
 * (booksService, usersService, etc.) qui exposent des fonctions métier.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = () => createClient() as any
