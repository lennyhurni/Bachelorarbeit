"use client"

import React, { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import SessionRecoveryButton from "./SessionRecoveryButton"

interface LoadingIndicatorProps {
  fullScreen?: boolean
  message?: string
  timeout?: number
  longTimeout?: number
  showTimeoutMessage?: boolean
}

const LoadingIndicator = ({
  fullScreen = false,
  message = "Wird geladen...",
  timeout = 10000,
  longTimeout = 20000,
  showTimeoutMessage = true,
}: LoadingIndicatorProps) => {
  const [showTimeout, setShowTimeout] = useState(false)
  const [showRecovery, setShowRecovery] = useState(false)

  useEffect(() => {
    // Show timeout message after specified duration
    const timeoutTimer = setTimeout(() => {
      setShowTimeout(true)
    }, timeout)
    
    // Show recovery option after longer timeout
    const recoveryTimer = setTimeout(() => {
      setShowRecovery(true)
    }, longTimeout)

    return () => {
      clearTimeout(timeoutTimer)
      clearTimeout(recoveryTimer)
    }
  }, [timeout, longTimeout])

  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center py-12"

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center text-center max-w-md p-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium">{message}</p>
        
        {showTimeout && showTimeoutMessage && (
          <div className="mt-6 text-sm text-muted-foreground max-w-sm">
            <p>Das dauert länger als erwartet.</p>
            <p className="mt-2">
              Wenn das Problem weiterhin besteht, versuch es mit einem Neuladen 
              der Seite oder melde dich ab und wieder an.
            </p>
            
            {showRecovery && (
              <div className="mt-4">
                <SessionRecoveryButton className="w-full mt-2" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoadingIndicator 