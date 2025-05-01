"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { ensureUserProfile } from "@/utils/profile-manager"
import { Session, User, AuthChangeEvent } from "@supabase/supabase-js"

// Typdefinitionen für den Kontext
interface SessionContextType {
  session: Session | null
  user: any | null
  loading: boolean
  refreshSession: () => Promise<void>
}

// Kontext erstellen mit Standardwerten
const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  loading: true,
  refreshSession: async () => {}
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Funktion zum Aktualisieren der Session
  const refreshSession = async () => {
    try {
      setLoading(true)
      const { data } = await supabase.auth.getSession()
      
      if (data.session) {
        setSession(data.session)
        
        // Verzögerung, um sicherzustellen, dass das Profil verfügbar ist
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Profil laden oder erstellen
        const profile = await ensureUserProfile(
          data.session.user.id,
          data.session.user.email,
          data.session.user.user_metadata?.full_name
        )
        
        setUser(profile)
      } else {
        setSession(null)
        setUser(null)
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Session:", JSON.stringify(error, null, 2))
    } finally {
      setLoading(false)
    }
  }

  // Beim ersten Laden die Session abrufen
  useEffect(() => {
    refreshSession()
    
    // Auf Auth-Änderungen hören
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, newSession: Session | null) => {
        // Actualizar la sesión independientemente durante la carga inicial
        if (loading || newSession?.user?.id !== session?.user?.id || (!!newSession !== !!session)) {
          setSession(newSession)
          
          if (newSession?.user) {
            const profile = await ensureUserProfile(
              newSession.user.id,
              newSession.user.email,
              newSession.user.user_metadata?.full_name
            )
            setUser(profile)
          } else {
            setUser(null)
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SessionContext.Provider value={{ session, user, loading, refreshSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext) 