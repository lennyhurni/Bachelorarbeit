"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"
import SessionRecoveryButton from "@/components/SessionRecoveryButton"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  const isAuthError = error.message?.toLowerCase().includes("auth") || 
                      error.message?.toLowerCase().includes("session") ||
                      error.message?.toLowerCase().includes("unauthorized") ||
                      error.message?.toLowerCase().includes("token") ||
                      error.message?.toLowerCase().includes("permission")

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="max-w-md p-6 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">
          Etwas ist schiefgelaufen
        </h1>
        
        <p className="text-muted-foreground mb-6">
          {isAuthError 
            ? "Es scheint ein Problem mit deiner Anmeldung zu geben. Bitte setze deine Sitzung zurück oder melde dich erneut an."
            : "Beim Laden dieser Seite ist ein unerwarteter Fehler aufgetreten. Wir entschuldigen uns für die Unannehmlichkeiten."}
        </p>
        
        <div className="space-y-4">
          {isAuthError ? (
            <>
              <SessionRecoveryButton className="w-full" variant="default" />
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = "/login"}
              >
                Zur Anmeldeseite
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={reset}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Erneut versuchen
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = "/"}
              >
                Zurück zur Startseite
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 