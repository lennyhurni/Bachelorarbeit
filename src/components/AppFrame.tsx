"use client"

import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { usePathname, useRouter } from 'next/navigation'
import { Navigation } from './navigation'
import { Sidebar } from './sidebar'
import { createClientBrowser } from '@/utils/supabase/client'

// Public paths that don't require authenticated UI
const publicPaths = ['/', '/login', '/register', '/auth/callback', '/auth/confirmed', '/auth/confirm', '/register/confirmation']

const isPublicPath = (path: string) =>
  publicPaths.some(publicPath =>
    path === publicPath || path.startsWith(`${publicPath}/`))

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const supabase = createClientBrowser()
    
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const currentSession = data.session
        
        // Check if session exists but is expired
        if (currentSession && currentSession.expires_at && currentSession.expires_at * 1000 < Date.now()) {
          console.log('Session expired in client component, logging out')
          await supabase.auth.signOut()
          router.push('/login')
          router.refresh()
          setSession(null)
        } else {
          setSession(currentSession)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, newSession: Session | null) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setSession(null)
          router.push('/login')
          router.refresh()
        } else if (event === 'SIGNED_IN' && newSession) {
          // Verify the session is not expired
          if (newSession.expires_at && newSession.expires_at * 1000 < Date.now()) {
            console.log('New session is expired, logging out')
            await supabase.auth.signOut()
            router.push('/login')
            router.refresh()
            setSession(null)
          } else {
            setSession(newSession)
          }
        } else {
          setSession(newSession)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Show simple loading indicator while checking session
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // For public paths, don't show navigation/sidebar
  if (isPublicPath(pathname)) {
    return <>{children}</>
  }

  // For authenticated routes, show navigation and sidebar
  return (
    <div className="flex flex-col h-screen">
      {session && <Navigation />}
      <div className="flex flex-grow">
        {session && <Sidebar />}
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  )
} 