export const dynamic = 'force-dynamic'

import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('Auth confirm route called with:', { token_hash: !!token_hash, type, next })

  if (!token_hash) {
    console.error('No token_hash provided for email verification')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bachelorarbeit-production.up.railway.app/'
    return NextResponse.redirect(new URL('/login?error=Missing_verification_token', siteUrl))
  }

  if (!type) {
    console.error('No type provided for email verification')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bachelorarbeit-production.up.railway.app/'
    return NextResponse.redirect(new URL('/login?error=Missing_verification_type', siteUrl))
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (error) {
      console.error('Error verifying OTP:', error.message)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bachelorarbeit-production.up.railway.app/'
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, siteUrl)
      )
    }

    // On success, redirect to login with success message
    console.log('Email verification successful, redirecting to login')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bachelorarbeit-production.up.railway.app/'
    
    if (type === 'signup') {
      // For new user signups, show the confirmation message
      return NextResponse.redirect(new URL('/login?email_confirmed=true', siteUrl))
    }
    
    // For other types, just redirect to the intended destination
    return NextResponse.redirect(new URL(next, siteUrl))
  } catch (err) {
    console.error('Unexpected error during email verification:', err)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bachelorarbeit-production.up.railway.app/'
    return NextResponse.redirect(
      new URL('/login?error=An_unexpected_error_occurred', siteUrl)
    )
  }
} 