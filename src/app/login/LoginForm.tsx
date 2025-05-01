"use client"
export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

// Wrapper-Komponente für Suspense
function LoginFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Get the redirectTo value from URL params
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  // Check if email was confirmed
  const emailConfirmed = searchParams.get('email_confirmed') === 'true'
  // Check if session expired
  const sessionExpired = searchParams.get('expired') === 'true'

  // Check if the user is already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession()
        
        // Middleware will handle redirects if there's a session
        // Just update our loading state
        setIsCheckingSession(false)
      } catch (err) {
        console.error('LoginForm: Error checking session:', err)
        setIsCheckingSession(false)
      }
    }
    
    checkSession()
  }, [supabase.auth])

  // Handle login with email and password
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    
    setError(null)
    setLoading(true)
    
    try {
      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (signInError) throw signInError
      
      // Successfully logged in
      console.log('Login successful')
      
      // Refresh the page to update auth state
      router.refresh()
      
      // Redirect to intended destination
      router.push(redirectTo)
      
    } catch (err: any) {
      console.error('LoginForm: Authentication error:', err)
      setError(err.message || 'An unexpected error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  if (isCheckingSession) {
    return <div className="flex justify-center"><div className="animate-pulse text-gray-600 dark:text-gray-400">Checking session...</div></div>
  }

  return (
    <div className="space-y-6">
      {emailConfirmed && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-md mb-4 text-sm border border-green-200 dark:border-green-800">
          <p className="font-medium">Ihre E-Mail-Adresse wurde erfolgreich bestätigt!</p>
          <p>Sie können sich jetzt mit Ihren Anmeldedaten einloggen.</p>
        </div>
      )}
      
      {sessionExpired && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-4 rounded-md mb-4 text-sm border border-yellow-200 dark:border-yellow-800">
          <p className="font-medium">Ihre Sitzung ist abgelaufen.</p>
          <p>Bitte melden Sie sich erneut an, um fortzufahren.</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {searchParams.get('error') === 'auth_callback_failed' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-3 rounded-md text-sm">
          Authentication process was interrupted. Please try signing in again.
        </div>
      )}

      <div>
        <div className="mb-5">
          <h3 className="text-center text-lg font-medium">Sign in with Email and Password</h3>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Exportiere die Hauptkomponente mit Suspense Boundary
export default function LoginForm() {
  return (
    <Suspense fallback={<div className="flex justify-center"><div className="animate-pulse text-gray-600 dark:text-gray-400">Loading...</div></div>}>
      <LoginFormContent />
    </Suspense>
  )
} 