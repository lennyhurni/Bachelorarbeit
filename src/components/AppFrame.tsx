"use client"

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Navigation } from './navigation'
import { Sidebar } from './sidebar'
import { useSession } from '@/contexts/SessionContext'
import LoadingIndicator from './LoadingIndicator'

// Public paths that don't require authenticated UI
const publicPaths = ['/', '/login', '/register', '/auth/callback', '/auth/confirmed', '/auth/confirm', '/register/confirmation']

const isPublicPath = (path: string) =>
  publicPaths.some(publicPath =>
    path === publicPath || path.startsWith(`${publicPath}/`))

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const { session, loading: sessionLoading } = useSession()
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // If session context finished loading, we can stop our loading too
    if (!sessionLoading) {
      setLoading(false)
    }
  }, [sessionLoading])

  // Show loading indicator only for authenticated routes
  if (loading && !isPublicPath(pathname)) {
    return <LoadingIndicator fullScreen message="Anwendung wird geladen..." />
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