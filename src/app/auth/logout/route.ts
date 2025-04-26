import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  
  // Benutzer ausloggen und das Cookie entfernen
  await supabase.auth.signOut({ scope: 'local' })
  
  // Zur Login-Seite umleiten
  return NextResponse.redirect(new URL('/login', req.url), { status: 302 })
} 