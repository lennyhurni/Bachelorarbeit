"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function LogoutButton({ 
  variant = "default",
  size = "default", 
  className = ""
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      // Use server-side logout route with proper method
      const response = await fetch('/auth/logout', {
        method: 'GET',
        cache: 'no-store',
      })
      
      if (response.redirected) {
        // Follow the redirect if the server provides one
        window.location.href = response.url
      } else {
        // Manually redirect to login if no redirect in response
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
      // If there's an error, still try to redirect to login
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
} 