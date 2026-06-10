import { createClient } from '@/lib/supabase/client'

/**
 * Accès bas-niveau à Supabase (typé via Database) pour les services client.
 * L'UI n'importe JAMAIS ceci directement — elle passe par les services
 * (booksService, usersService, etc.) qui exposent des fonctions métier.
 */
export const db = () => createClient()
