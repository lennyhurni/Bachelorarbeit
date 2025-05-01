"use client"

import { useEffect, useState, ReactNode } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check for session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          // No session, redirect to login
          router.push('/login')
          return
        }
        
        // Check if session is about to expire
        if (session.expires_at) {
          const expiresAt = session.expires_at * 1000
          const now = Date.now()
          const tenMinutesInMs = 10 * 60 * 1000
          
          // If token expires in less than 10 minutes, try to refresh
          if (expiresAt - now < tenMinutesInMs) {
            try {
              console.log('Session about to expire, attempting refresh')
              const { data, error } = await supabase.auth.refreshSession()
              
              if (error) {
                console.error('Failed to refresh session:', error)
                // If we can't refresh, redirect to login
                if (error.message.includes('expired')) {
                  router.push('/login?expired=true')
                  return
                }
              }
            } catch (err) {
              console.error('Error during session refresh:', err)
            }
          }
          
          // If token is expired, redirect to login
          if (expiresAt < now) {
            console.log('Session expired, redirecting to login')
            router.push('/login?expired=true')
            return
          }
        }
        
        // Set authenticated state
        setAuthenticated(true)
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setAuthenticated(false)
        router.push('/login')
      } else if (event === 'SIGNED_IN' && session) {
        setAuthenticated(true)
      }
    })
    
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Lädt...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null // Will be redirected in the useEffect
  }

  return <>{children}</>
} 