import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const email = formData.get('email') as string
  const full_name = formData.get('full_name') as string
  
  if (!email || !full_name) {
    return NextResponse.json(
      { error: 'Email and full name are required' },
      { status: 400 }
    )
  }

  const cookieStore = cookies();
  const supabase = createClient();
  
  try {
    // Bei Registrierung ohne Passwort signInWithOtp verwenden und Benutzerdaten mitgeben
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${new URL(req.url).origin}/auth/callback`,
        data: {
          full_name
        }
      }
    })
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.redirect(
      new URL('/login/check-email', req.url),
      {
        status: 302
      }
    )
  } catch (err) {
    console.error('Fehler bei der Registrierung:', err);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
} 