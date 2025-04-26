"use client"

import { useEffect, useState } from "react"
import { createClientBrowser } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { User, Mail, Save } from "lucide-react"
import Link from "next/link"

// Typdefinition für Benutzerdaten
interface UserProfile {
  id: string
  email: string
  full_name?: string
  username?: string
  avatar_url?: string
  website?: string
}

export default function ProfileClient() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formValues, setFormValues] = useState<Partial<UserProfile>>({})
  const supabase = createClientBrowser()
  const router = useRouter()

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        
        // Session abrufen
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }
        
        // Benutzerprofil abrufen
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (userError) {
          console.error('Fehler beim Abrufen des Benutzerprofils:', userError)
        }
        
        // Benutzerdaten setzen
        const profileData = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: userData?.full_name || session.user.user_metadata?.full_name || '',
          username: userData?.username || '',
          avatar_url: userData?.avatar_url || session.user.user_metadata?.avatar_url || '',
          website: userData?.website || ''
        }
        
        setUser(profileData)
        setFormValues(profileData)
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [supabase, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    try {
      setSaving(true)
      
      // Profildaten aktualisieren
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formValues.full_name,
          username: formValues.username,
          website: formValues.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
      
      if (error) {
        console.error('Fehler beim Aktualisieren des Profils:', error)
        return
      }
      
      // Benutzerdaten aktualisieren
      setUser({
        ...user,
        ...formValues
      })
      
      alert('Profil erfolgreich aktualisiert')
    } catch (error) {
      console.error('Fehler beim Speichern der Profildaten:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Lade Benutzerdaten...</div>
  }

  return (
    <div className="container py-8 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center border rounded-md px-3 py-2 bg-muted">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="full_name">Vollständiger Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formValues.full_name || ''}
                onChange={handleChange}
                placeholder="Max Mustermann"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="username">Benutzername</Label>
              <Input
                id="username"
                name="username"
                value={formValues.username || ''}
                onChange={handleChange}
                placeholder="maxmustermann"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formValues.website || ''}
                onChange={handleChange}
                placeholder="https://beispiel.de"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full flex items-center gap-2"
              disabled={saving}
            >
              {saving ? 'Wird gespeichert...' : (
                <>
                  <Save className="h-4 w-4" />
                  Speichern
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link href="/dashboard" className="w-full">
            <Button variant="outline" className="w-full">
              Zurück zum Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 