import { Suspense } from "react"
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from "./dashboard-client"

// Server Component for Dashboard with auth check
export default async function DashboardPage() {
  // Server-side auth verification
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user) {
    // If no session, redirect to login
    return redirect('/login?redirectTo=/dashboard')
  }

  return (
    <Suspense fallback={<div className="p-4">Lädt Dashboard...</div>}>
      <DashboardClient />
    </Suspense>
  )
} 