import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  
  // Get the redirectTo from query params if present
  const { searchParams } = new URL(req.url)
  const redirectTo = searchParams.get('redirectTo') || '/login'
  
  // Make sure redirectTo is a public path - only allow redirection to login or register for security
  const allowedRedirects = ['/login', '/register']
  const safeRedirect = allowedRedirects.includes(redirectTo) ? redirectTo : '/login'
  
  // Benutzer ausloggen und das Cookie entfernen
  await supabase.auth.signOut({ scope: 'local' })
  
  // Zur gewünschten Seite umleiten
  return NextResponse.redirect(new URL(safeRedirect, req.url), { status: 302 })
} 