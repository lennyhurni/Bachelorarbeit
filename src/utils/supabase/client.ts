import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase-Client für Browser/Client-Komponenten
 */
export const createClientBrowser = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export both function names for compatibility
export const createClient = createClientBrowser 