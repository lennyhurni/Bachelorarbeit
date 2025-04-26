import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Benutzer ist nicht angemeldet, zum Login umleiten
        const currentPath = window.location.pathname
        router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`)
        return
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [router, supabase.auth])

  // Zeige einen Ladeindikator während die Authentifizierung überprüft wird
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="text-lg font-medium">Laden...</div>
          <p className="text-sm text-muted-foreground">Authentifizierung wird überprüft</p>
        </div>
      </div>
    )
  }

  // Benutzer ist angemeldet, Komponenten-Inhalt anzeigen
  return <>{children}</>
} 