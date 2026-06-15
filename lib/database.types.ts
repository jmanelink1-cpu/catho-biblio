/**
 * Types de la base Supabase (schéma `public`).
 * Écrits à la main d'après le schéma réel — remplaçables par
 * `supabase gen types typescript` si tu connectes la CLI plus tard.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          id: string; title: string; author: string | null; description: string | null
          category: string | null; cover_url: string | null; drive_file_id: string
          language: string; year: number | null; pages: number | null; is_featured: boolean; created_at: string
        }
        Insert: {
          id?: string; title: string; author?: string | null; description?: string | null
          category?: string | null; cover_url?: string | null; drive_file_id: string
          language?: string; year?: number | null; pages?: number | null; is_featured?: boolean; created_at?: string
        }
        Update: Partial<Database['public']['Tables']['books']['Insert']>
        Relationships: []
      }
      profiles: {
        Row: {
          id: string; email: string | null; full_name: string | null; has_access: boolean
          access_type: string | null; access_expires_at: string | null; is_admin: boolean; banned: boolean; created_at: string
        }
        Insert: {
          id: string; email?: string | null; full_name?: string | null; has_access?: boolean
          access_type?: string | null; access_expires_at?: string | null; is_admin?: boolean; banned?: boolean; created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      payments: {
        Row: {
          id: string; user_id: string | null; amount: number | null; currency: string | null
          payment_method: string | null; transaction_id: string | null; plan: string | null
          status: string; metadata: Json | null; created_at: string
        }
        Insert: {
          id?: string; user_id?: string | null; amount?: number | null; currency?: string | null
          payment_method?: string | null; transaction_id?: string | null; plan?: string | null
          status?: string; metadata?: Json | null; created_at?: string
        }
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
        Relationships: []
      }
      promo_codes: {
        Row: { id: string; code: string; discount_percent: number; max_uses: number | null; uses: number; active: boolean; created_at: string }
        Insert: { id?: string; code: string; discount_percent?: number; max_uses?: number | null; uses?: number; active?: boolean; created_at?: string }
        Update: Partial<Database['public']['Tables']['promo_codes']['Insert']>
        Relationships: []
      }
      orders: {
        Row: { id: string; first_name: string; last_name: string; email: string; country: string | null; amount: number; promo_code: string | null; status: string; created_at: string }
        Insert: { id?: string; first_name: string; last_name: string; email: string; country?: string | null; amount?: number; promo_code?: string | null; status?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
        Relationships: []
      }
      app_settings: {
        Row: { id: number; price: number; currency: string }
        Insert: { id?: number; price?: number; currency?: string }
        Update: Partial<Database['public']['Tables']['app_settings']['Insert']>
        Relationships: []
      }
      reading_progress: {
        Row: { user_id: string; book_id: string; progress: number; updated_at: string }
        Insert: { user_id: string; book_id: string; progress?: number; updated_at?: string }
        Update: Partial<Database['public']['Tables']['reading_progress']['Insert']>
        Relationships: []
      }
      user_devices: {
        Row: { user_id: string; device_id: string; label: string | null; last_seen: string; created_at: string }
        Insert: { user_id: string; device_id: string; label?: string | null; last_seen?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['user_devices']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      validate_promo: { Args: { p_code: string }; Returns: { discount_percent: number }[] }
      claim_device: { Args: { p_device_id: string; p_label?: string }; Returns: string }
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
