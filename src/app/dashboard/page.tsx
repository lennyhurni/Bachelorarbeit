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

// Server Component for Dashboard with auth check
export default async function DashboardPage() {
  // Skip auth check during prerendering
  if (!isPrerendering) {
    try {
      // Server-side auth verification
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()
      
      if (error || !data?.user) {
        // If no session, redirect to login
        redirect('/login?redirectTo=/dashboard')
      }
    } catch (error) {
      console.error("Error checking authentication:", error)
      redirect('/login?redirectTo=/dashboard')
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