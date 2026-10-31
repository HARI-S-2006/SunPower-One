import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder') &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-anon-key')
)

export const backendMode: 'demo' | 'production' = isSupabaseConfigured ? 'production' : 'demo'

if (!isSupabaseConfigured) {
  console.info(
    '[SunPower One] Operating in Demo Mode (Local Storage). Backend persistence is simulated locally. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to connect a managed Supabase database.'
  )
} else {
  console.info('[SunPower One] Operating in Production Mode (Supabase Managed Backend Connected).')
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key'
)

export type SupabaseClient = typeof supabase