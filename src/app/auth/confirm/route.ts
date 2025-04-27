export const dynamic = 'force-dynamic'

import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // On success, redirect to login with success message
      if (next === '/dashboard' && type === 'signup') {
        redirect('/login?email_confirmed=true')
      }
      // Otherwise, redirect user to specified redirect URL
      redirect(next)
    }
  }

  // redirect the user to an error page
  redirect('/login?error=Unable to verify your email. Please try signing in again.')
} 