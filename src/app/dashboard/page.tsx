"use client"

import { Suspense } from "react"
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from "./dashboard-client"

// Client Component for Dashboard with auth check
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-4">Lädt Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}

// Separate component to handle authentication check
async function DashboardContent() {
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
    // Only redirect during runtime, not build time
    if (typeof window !== 'undefined') {
      redirect('/login?redirectTo=/dashboard')
    }
  }

  return <DashboardClient />
} 