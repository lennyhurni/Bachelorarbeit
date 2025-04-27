export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  
  // Use your production URL instead of origin
  const siteUrl = 'https://bachelorarbeit-production.up.railway.app/'
  return NextResponse.redirect(new URL('/dashboard', siteUrl))
}