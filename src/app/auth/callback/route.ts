export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const type = searchParams.get('type')
  
  // Use your production URL instead of origin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bachelorarbeit-production.up.railway.app/'

  
  // If this is coming from email confirmation, redirect to login with success message
  if (type === 'signup' || type === 'recovery') {
    return NextResponse.redirect(new URL('/login?email_confirmed=true', siteUrl))
  }
  
  return NextResponse.redirect(new URL('/dashboard', siteUrl))
}