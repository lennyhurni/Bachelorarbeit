import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Return a dummy client during build if environment variables are missing
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key is missing. This might be expected during build time.")
    return createDummyClient()
  }
  
  try {
    // Create the Supabase client with improved cookie handling for Next.js 15+
    return createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          // Neue cookie handler implementation die mit next js 15 kompatibel ist
          async get(name: string) {
            try {
              const cookieStore = await cookies()
              return cookieStore.get(name)?.value
            } catch (error) {
              console.warn(`Error getting cookie '${name}':`, error)
              return undefined
            }
          },
          async set(name: string, value: string, options) {
            try {
              const cookieStore = await cookies()
              cookieStore.set(name, value, options)
            } catch (error) {
              // Wir ignorieren bestimmte erwartete Fehler im dev mode
              if (error instanceof Error && 
                  !error.message.includes('Cookies can only be modified')) {
                console.warn(`Error setting cookie '${name}':`, error.message)
              }
            }
          },
          async remove(name: string, options) {
            try {
              const cookieStore = await cookies()
              cookieStore.set(name, '', { ...options, maxAge: 0 })
            } catch (error) {
              // Wir ignorieren bestimmte erwartete Fehler im dev mode
              if (error instanceof Error && 
                  !error.message.includes('Cookies can only be modified')) {
                console.warn(`Error removing cookie '${name}':`, error.message)
              }
            }
          }
        }
      }
    )
  } catch (error) {
    console.warn("Error creating Supabase client, returning mock client:", error)
    return createDummyClient()
  }
}

// Hilfsfunktion für einen Mock-Client
function createDummyClient() {
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
  } as any
}
