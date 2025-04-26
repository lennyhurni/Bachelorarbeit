import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Return a dummy client during build if environment variables are missing
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key is missing. This might be expected during build time.")
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        signInWithPassword: () => Promise.resolve({ data: { session: null }, error: null }),
        updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ 
          data: { subscription: { unsubscribe: () => {} } }, 
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          }),
        }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null })
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null })
        }),
      }),
      // Add other methods needed during build as needed
    } as any
  }
  
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        /** Alle Cookies lesen */
        async getAll() {
          return (await cookies()).getAll()
        },

        /** Mehrere Cookies setzen bzw. löschen */
        async setAll(items) {
          const store = await cookies()

          // In einer Server Component kann store.set fehlen.
          // Das Casting verhindert TS-Fehler und ist zur Laufzeit unkritisch.
          const setter = (store as unknown as { set?: typeof store.set }).set

          if (setter) {
            items.forEach(({ name, value, options }) =>
              setter(name, value, options)
            )
          }
        }
      }
    }
  )
}
