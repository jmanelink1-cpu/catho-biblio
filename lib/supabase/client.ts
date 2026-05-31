import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let _client: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.PLACEHOLDER'
  _client = createSupabaseClient(url, key)
  return _client
}
