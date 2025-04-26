export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // We're no longer using magic links, but keeping this route for backward compatibility
  // Simply redirect to the dashboard
  const { searchParams, origin } = new URL(request.url)
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  
  console.log('Auth callback: Magic links are disabled, redirecting to dashboard')
  
  // Redirect to the dashboard page with an info message
  return NextResponse.redirect(new URL('/dashboard', origin))
} 