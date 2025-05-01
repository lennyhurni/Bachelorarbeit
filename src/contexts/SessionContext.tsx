"use client"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { ensureUserProfile } from "@/utils/profile-manager"
import { Session, User } from "@supabase/supabase-js"

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

// Maximum timeout to prevent indefinite loading
const MAX_LOADING_TIME = 8000 // 8 seconds

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState<Error | null>(null)
  const supabase = createClient()
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const refreshAttempts = useRef(0)

  // Funktion zum Aktualisieren der Session
  const refreshSession = async () => {
    try {
      // Increment attempt counter
      refreshAttempts.current += 1
      
      // Set loading state
      setLoading(true)
      
      // Clear any previous timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
      
      // Set timeout to prevent infinite loading
      loadingTimeoutRef.current = setTimeout(() => {
        console.warn("Session refresh timeout - forcing loading state to complete")
        setLoading(false)
        
        // If we have no session after multiple attempts, try to clear cookies
        if (!session && refreshAttempts.current > 2) {
          console.warn("Multiple session failures - attempting recovery")
          // Force sign out to clear any corrupted session state
          supabase.auth.signOut().catch(e => console.error("Error signing out:", e))
        }
      }, MAX_LOADING_TIME)

      // Fetch session
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        throw error
      }
      
      if (data.session) {
        // Check if session is valid (not expired)
        const isExpired = data.session.expires_at && (data.session.expires_at * 1000 < Date.now())
        
        if (isExpired) {
          console.log("Session is expired, attempting refresh...")
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError) {
            console.error("Error refreshing session:", refreshError)
            setSession(null)
            setUser(null)
            // Clear timeout since we're done
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current)
              loadingTimeoutRef.current = null
            }
            setLoading(false)
            return
          }
          
          if (refreshData.session) {
            setSession(refreshData.session)
            
            // Profile laden oder erstellen
            const profile = await ensureUserProfile(
              refreshData.session.user.id,
              refreshData.session.user.email,
              refreshData.session.user.user_metadata?.full_name
            )
            
            setUser(profile)
          } else {
            setSession(null)
            setUser(null)
          }
        } else {
          // Session is valid
          setSession(data.session)
          
          // Profil laden oder erstellen
          const profile = await ensureUserProfile(
            data.session.user.id,
            data.session.user.email,
            data.session.user.user_metadata?.full_name
          )
          
          setUser(profile)
        }
      } else {
        setSession(null)
        setUser(null)
      }
      
      // Reset error state
      setLoadingError(null)
      refreshAttempts.current = 0
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Session:", error)
      setLoadingError(error as Error)
      
      // Safety fallback - if session refresh fails, ensure loading state completes
      setSession(null)
      setUser(null)
    } finally {
      // Clear timeout since we're done
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
      setLoading(false)
    }
  }

  // Beim ersten Laden die Session abrufen
  useEffect(() => {
    refreshSession()
    
    // Auf Auth-Änderungen hören
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession: Session | null) => {
        console.log("Auth state changed:", event)
        
        if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          setLoading(false)
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Re-run refresh session logic
          refreshSession()
        }
      }
    )

    return () => {
      // Clear any timeout when component unmounts
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
      subscription.unsubscribe()
    }
  }, [])

  return (
    <SessionContext.Provider value={{ session, user, loading, refreshSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext) 