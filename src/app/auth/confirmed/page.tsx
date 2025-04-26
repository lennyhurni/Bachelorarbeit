'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthConfirmedPage() {
  const router = useRouter()
  
  useEffect(() => {
    // We're not using magic links anymore, just redirect to dashboard
    router.push('/dashboard')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium">Redirecting to dashboard...</p>
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
      </div>
    </div>
  )
} 