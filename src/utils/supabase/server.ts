import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
