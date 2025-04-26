import { createBrowserClient } from '@supabase/ssr'

export function createClientBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Fehlende Supabase-Umgebungsvariablen:', {
      url: !!supabaseUrl,
      key: !!supabaseKey
    })
    throw new Error('Supabase-Umgebungsvariablen fehlen')
  }
  
  // Konfiguration speziell für Railway optimiert
  return createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Use localStorage for more reliability in Railway
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    },
    global: {
      // Custom fetch mit Timeout
      fetch: (...args) => {
        // @ts-ignore - Typendefinition ignorieren
        return fetch(...args, {
          // Längeres Timeout für Railway
          timeout: 30000
        }).catch(err => {
          console.error('Fetch error:', err)
          throw err
        })
      }
    }
  })
}