/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

const isConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-anon-key'

// Create mock client for demo mode
const mockSupabaseClient = {
  auth: {
    signUp: async () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    upsert: () => ({ data: null, error: null })
  })
}

// Create client conditionally - real client if configured, mock client otherwise
export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : mockSupabaseClient
export const isSupabaseConfigured = isConfigured

export type Database = {
  public: {
    Tables: {
      user_credits: {
        Row: {
          id: string
          user_id: string
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          credits?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}