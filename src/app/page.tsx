"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientBrowser } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Brain, ArrowRight } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClientBrowser()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Reflective Journal</h1>
        <p className="text-lg text-muted-foreground">
          Enhance your reflective practice with AI-assisted insights
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/login">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/about">
          <Button variant="outline" size="lg">Learn More</Button>
        </Link>
      </div>
    </div>
  )
}