"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { resetSession } from "@/app/utils/session-recovery"
import { Loader2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface SessionRecoveryButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

const SessionRecoveryButton = ({ 
  className,
  variant = "outline" 
}: SessionRecoveryButtonProps) => {
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()

  const handleResetSession = async () => {
    try {
      setIsResetting(true)
      const success = await resetSession()
      
      if (success) {
        // Reload the page after successful reset
        window.location.href = "/login"
      } else {
        // Hard reload as fallback
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to reset session:", error)
      // Force reload as final fallback
      window.location.reload()
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <Button
      onClick={handleResetSession}
      disabled={isResetting}
      variant={variant}
      className={className}
    >
      {isResetting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Wiederherstellung läuft...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sitzung zurücksetzen
        </>
      )}
    </Button>
  )
}

export default SessionRecoveryButton 