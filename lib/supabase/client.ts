import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

let _client: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Browser Supabase client. Uses @supabase/ssr's createBrowserClient so the
 * auth session is stored in COOKIES (not localStorage) — this lets server
 * components (e.g. /library) read the session and avoids login redirect loops.
 * Lazily instantiated (call only inside event handlers/effects) to avoid the
 * production render hang.
 */
export function createClient() {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  _client = createBrowserClient<Database>(url, key)
  return _client
}
