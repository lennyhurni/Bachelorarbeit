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

function isProtected(pathname: string) {
  return PROTECTED_PATHS.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`),
  )
}

/**
 * Haupt-Middleware
 * Läuft bei jedem Request, bevor Next.js Routing übernimmt
 */
export async function middleware(request: NextRequest) {
  // Standard-Antwort vorbereiten
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

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
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. Alles andere durchlassen
  return response
}

/**
 * Matcher: auf **alle** Routen anwenden,
 * aber Next.js-Assets und Favicon ausnehmen
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.ico).*)',
  ],
}