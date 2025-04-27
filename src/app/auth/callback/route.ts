export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  
  // Absolute URL sicherstellen für Produktion
  return NextResponse.redirect(new URL('/dashboard', origin))
}