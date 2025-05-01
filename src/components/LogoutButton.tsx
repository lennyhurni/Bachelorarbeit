"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { showSuccess, showError } from "@/utils/feedback"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  redirectTo?: string
}

export default function LogoutButton({ 
  variant = "default",
  size = "default", 
  className = "",
  redirectTo = "/login"
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      // Use server-side logout route with proper method and pass redirectTo
      const logoutUrl = `/auth/logout${redirectTo !== "/login" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`
      
      const response = await fetch(logoutUrl, {
        method: 'GET',
        cache: 'no-store',
      })
      
      if (response.redirected) {
        // Show success message before redirecting
        showSuccess("logout")
        
        // Follow the redirect if the server provides one
        setTimeout(() => {
          window.location.href = response.url
        }, 1000)
      } else {
        // Show success message
        showSuccess("logout")
        
        // Manually redirect if no redirect in response
        setTimeout(() => {
          router.push(redirectTo)
          router.refresh()
        }, 1000)
      }
    } catch (error) {
      console.error('Logout error:', error)
      showError("logout")
      
      // If there's an error, still try to redirect
      setTimeout(() => {
        router.push(redirectTo)
      }, 1500)
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