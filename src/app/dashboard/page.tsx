export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from "./dashboard-client"

// Detect if we're in a build/prerender environment
const isPrerendering = 
  process.env.NODE_ENV === 'production' && 
  typeof process.env.NEXT_PHASE !== 'undefined' &&
  process.env.NEXT_PHASE === 'phase-production-build'

// Alternativ-Funktion, die eine Weiterleitung auf die Login-Seite durchführt
// ohne einen expliziten Fehler zu verursachen
async function checkAuth() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    return { isAuthenticated: !error && !!data?.user, userId: data?.user?.id }
  } catch (error) {
    console.error("Error in auth check:", error)
    return { isAuthenticated: false, userId: null }
  }
}

// Server Component for Dashboard with auth check
export default async function DashboardPage() {
  // Skip auth check during prerendering
  if (!isPrerendering) {
    try {
      // Zuerst prüfen, ob der Benutzer authentifiziert ist
      const { isAuthenticated } = await checkAuth()
      
      // Nur wenn nicht authentifiziert, weiterleiten
      if (!isAuthenticated) {
        // Verwende return statt throw, damit kein Fehler im Client entsteht
        return redirect('/login?redirectTo=/dashboard')
      }
    } catch (error) {
      console.error("Critical error checking authentication:", error)
      // Im Fehlerfall auch weiterleiten, aber mit einer Fehlermeldung
      return redirect('/login?redirectTo=/dashboard&error=auth')
    }
  }

  // During prerendering, we'll just render the client component
  // At runtime, this will be properly protected by the auth check above
  return (
    <Suspense fallback={<div className="p-4">Lädt Dashboard...</div>}>
      <DashboardClient />
    </Suspense>
  )
} 