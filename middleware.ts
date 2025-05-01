import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// Pfade, die zwingend eine gültige Supabase-Session benötigen
const PROTECTED_PATHS = [
  '/dashboard',
  '/reflections',
  '/reflections/new',
  '/reflections/:id',
  '/profile',
  '/goals',
  '/analytics',
  '/settings',
  '/help',
]

// Public paths that bypass auth checks
const PUBLIC_PATHS = [
  '/', 
  '/login', 
  '/register', 
  '/auth/callback', 
  '/auth/confirmed', 
  '/auth/confirm', 
  '/register/confirmation',
  '/api/health'
]

// Check URL against protected paths patterns
function isProtected(pathname: string) {
  return PROTECTED_PATHS.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`),
  )
}

// Check if URL is a public path
function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`),
  )
}

/**
 * Haupt-Middleware
 * Läuft bei jedem Request, bevor Next.js Routing übernimmt
 */
export async function middleware(request: NextRequest) {
  // Get path from request
  const { pathname } = request.nextUrl
  
  // Skip auth checks for public paths, static assets, images, etc
  if (isPublicPath(pathname) || pathname.startsWith('/_next') || pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)) {
    return NextResponse.next()
  }
  
  // Standard-Antwort vorbereiten
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    // Supabase-Client mit vereinfachten Cookie-Methoden anlegen
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
          set(name, value, options) {
            response.cookies.set(name, value, options)
          },
          remove(name, options) {
            response.cookies.set(name, '', { ...options, maxAge: 0 })
          },
        },
      },
    )

    // Session prüfen
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    // If there was an error getting the session, log and redirect to login
    if (sessionError) {
      console.error("Session error in middleware:", sessionError)
      
      if (isProtected(pathname)) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirectTo', pathname)
        loginUrl.searchParams.set('error', 'session')
        return NextResponse.redirect(loginUrl)
      }
      
      return response
    }

    /* ------------------------------------------------------ */
    /* Session Management                                     */
    /* ------------------------------------------------------ */

    // Handle session expiration - check if it's about to expire within the next 5 minutes
    // and try to refresh the session if possible
    if (session && session.expires_at) {
      const expiresAt = session.expires_at * 1000 // convert to milliseconds
      const now = Date.now()
      const fiveMinutesInMs = 5 * 60 * 1000
      
      // If token is about to expire in less than 5 minutes, try to refresh it
      if (expiresAt - now < fiveMinutesInMs) {
        try {
          // Attempt to refresh the session
          const { data, error } = await supabase.auth.refreshSession()
          if (error) {
            console.error('Failed to refresh session:', error)
            
            // If refresh failed and the token is expired, redirect to login
            if (expiresAt < now && isProtected(pathname)) {
              const loginUrl = new URL('/login', request.url)
              loginUrl.searchParams.set('redirectTo', pathname)
              loginUrl.searchParams.set('expired', 'true')
              return NextResponse.redirect(loginUrl)
            }
          }
        } catch (err) {
          console.error('Error refreshing session:', err)
        }
      }
    }

    /* ------------------------------------------------------ */
    /* Weiterleitungen                                        */
    /* ------------------------------------------------------ */

    // 1. Geschützte Route ohne Session → Login mit Redirect
    if (isProtected(pathname) && !session) {
      console.log(`Protected path accessed without session: ${pathname}`)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // 2. User ist schon eingeloggt und ruft /login auf → Dashboard
    if ((pathname === '/login' || pathname === '/register') && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // 3. Alles andere durchlassen
    return response
  } catch (e) {
    // Global error handler - critical errors should still allow the user to access public paths
    console.error("Middleware critical error:", e)
    
    // For critical errors on protected routes, redirect to login
    if (isProtected(pathname)) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      loginUrl.searchParams.set('error', 'critical')
      return NextResponse.redirect(loginUrl)
    }
    
    // Otherwise, pass through the request
    return NextResponse.next()
  }
}

/**
 * Matcher: auf **alle** Routen anwenden,
 * aber Next.js-Assets und Favicon ausnehmen
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - .well-known (ACME Challenge files)
     * - API routes
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico|.well-known).*)',
  ],
}