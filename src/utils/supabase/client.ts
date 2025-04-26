import { createBrowserClient } from '@supabase/ssr'

export function createClientBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase-Umgebungsvariablen fehlen:', { 
      url: supabaseUrl ? 'Vorhanden' : 'Fehlt', 
      key: supabaseKey ? 'Vorhanden' : 'Fehlt'
    })
    throw new Error('Fehlende Supabase-Umgebungsvariablen')
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Speicherort auf localStorage setzen, was in Railway zuverlässiger ist
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    },
    global: {
      // Explizites Fetch für Railway
      fetch: (...args) => fetch(...args)
    }
  })
}