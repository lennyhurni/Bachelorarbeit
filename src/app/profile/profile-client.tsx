"use client"

import { useEffect, useState } from "react"
import { createClientBrowser } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { User, Mail, Save, Check, Settings, Bell, Moon, Brain, Upload, Loader2, Sun, Shield, Trash2 } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { showSuccess, showError } from "@/utils/feedback"
import { Toaster } from "@/components/ui/toaster"
import RequireAuth from "@/components/RequireAuth"

// Type definition for user data
interface UserProfile {
  id: string
  email: string
  full_name?: string
  username?: string
  avatar_url?: string
  website?: string
  settings?: any
}

export default function ProfileClient() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [formValues, setFormValues] = useState<Partial<UserProfile>>({})
  const { toast } = useToast()
  const supabase = createClientBrowser()
  const router = useRouter()
  
  // Use theme hook only for avatar display purposes
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        setSaving(false)
        
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          // Don't show an error message here, just redirect to login
          router.push('/login')
          return
        }
        
        // Load profile data
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (userError) {
          // Check if this is a "not found" error, which might happen if the profile
          // hasn't been created yet after authentication
          if (userError.code === 'PGRST116') {
            console.log('Creating new profile for user:', session.user.id)
            
            try {
              // Create a basic profile for the user
              const { data: newUserData, error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name || '',
                  avatar_url: session.user.user_metadata?.avatar_url || '',
                  updated_at: new Date().toISOString()
                })
                .select()
              
              if (createError) {
                console.error('Error creating user profile:', JSON.stringify(createError, null, 2))
                showError("profile", { 
                  title: "Fehler beim Erstellen", 
                  description: `Dein Profil konnte nicht erstellt werden: ${createError.message || 'Unbekannter Fehler'}` 
                })
                return
              }
              
              // If the profile was created successfully, but no data was returned,
              // fetch the newly created profile
              let profileData = newUserData?.[0]
              
              if (!profileData) {
                const { data: fetchedProfile, error: fetchError } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single()
                  
                if (fetchError) {
                  console.error('Error fetching newly created profile:', JSON.stringify(fetchError, null, 2))
                  showError("profile", { 
                    title: "Fehler beim Laden", 
                    description: `Dein neues Profil konnte nicht geladen werden: ${fetchError.message || 'Unbekannter Fehler'}` 
                  })
                  return
                }
                
                profileData = fetchedProfile
              }
              
              // Use the newly created profile
              const newProfile = {
                ...profileData,
                email: session.user.email || ''
              }
              
              setUser(newProfile)
              setFormValues(newProfile)
              return
            } catch (err) {
              console.error('Unexpected error during profile creation/fetching:', err)
              showError("profile", { 
                title: "Unerwarteter Fehler", 
                description: "Ein unerwarteter Fehler ist aufgetreten." 
              })
              return
            }
          }
          
          console.error('Error loading user profile:', userError)
          showError("profile", { 
            title: "Fehler beim Laden", 
            description: "Dein Profil konnte nicht geladen werden." 
          })
          return
        }
        
        // Set user data - combine profile data with email from session
        const userWithEmail = {
          ...userData,
          email: session.user.email || ''
        }
        
        setUser(userWithEmail)
        setFormValues(userWithEmail)
        
        // Set theme from user settings if available
        if (userData?.settings?.theme) {
          setTheme(userData.settings.theme)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        showError("profile", { 
          title: "Fehler beim Laden", 
          description: "Dein Profil konnte nicht geladen werden." 
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [supabase, router, setTheme])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!user) return
      setUploadingAvatar(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }
      
      const file = event.target.files[0]

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showError("avatar", {
          title: "Datei zu groß",
          description: "Bitte wähle ein Bild kleiner als 2MB."
        })
        return
      }

      // Validate file type
      const fileType = file.type.split('/')[0]
      if (fileType !== 'image') {
        showError("avatar", {
          title: "Falscher Dateityp",
          description: "Bitte wähle nur Bilddateien aus."
        })
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          cacheControl: '3600'
        })
      
      if (uploadError) {
        if (uploadError.message.includes('storage')) {
          showError("avatar", {
            title: "Speicherfehler",
            description: "Es gab ein Problem beim Speichern deines Bildes. Bitte versuche es erneut."
          })
        } else {
          showError("avatar", {
            title: "Upload fehlgeschlagen",
            description: uploadError.message
          })
        }
        throw uploadError
      }
      
      // Get public URL for storing in the profile
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      
      // Update user profile with new avatar URL - store the FULL publicUrl
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl, // Store the full public URL instead of just the filename
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
      
      if (updateError) {
        throw updateError
      }
      
      // Update local state
      const updatedUser = { ...user, avatar_url: publicUrl }
      setUser(updatedUser)
      setFormValues(updatedUser)
      
      showSuccess("avatar")
    } catch (error) {
      console.error('Error uploading avatar:', error)
      showError("avatar")
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    try {
      setSaving(true)
      
      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formValues.full_name,
          username: formValues.username,
          website: formValues.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
      
      if (profileError) {
        console.error('Error updating profile:', profileError)
        showError("profile")
        return
      }
      
      // Update user data
      setUser({
        ...user,
        ...formValues
      })
      
      showSuccess("profile")
    } catch (error) {
      console.error('Error saving profile data:', error)
      showError("profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="px-6">
          <div className="grid gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <RequireAuth>
      <div className="py-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mein Profil</h1>
            <p className="text-muted-foreground mt-1">Verwalten Sie Ihre persönlichen Informationen</p>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={saving} 
            className="gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Änderungen speichern
              </>
            )}
          </Button>
        </div>
        
        <div className="px-6 grid gap-6">
          {/* Profile Information Card */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5 text-primary" />
                Persönliche Informationen
              </CardTitle>
              <CardDescription>
                Hier können Sie Ihre Profildaten und Ihr Avatar bearbeiten
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-28 w-28 border-2 border-muted">
                    <AvatarImage 
                      src={user?.avatar_url || undefined}
                    />
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">{user?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar" className="cursor-pointer text-sm px-3 py-1.5 border rounded-md hover:bg-muted inline-flex items-center gap-1">
                      {uploadingAvatar ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Wird hochgeladen...
                        </>
                      ) : (
                        <>
                          <Upload className="h-3 w-3" />
                          Bild ändern
                        </>
                      )}
                    </Label>
                    <input 
                      id="avatar" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={uploadAvatar} 
                      disabled={uploadingAvatar}
                    />
                  </div>
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Vollständiger Name</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          placeholder="Ihr Name"
                          value={formValues.full_name || ''}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Benutzername</Label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="Ihr Benutzername"
                          value={formValues.username || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail-Adresse</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted/50"
                      />
                      <p className="text-xs text-muted-foreground">Die E-Mail-Adresse kann nicht geändert werden.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="https://ihre-website.de"
                        value={formValues.website || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Security Card */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-5 w-5 text-primary" />
                Sicherheit & Datenschutz
              </CardTitle>
              <CardDescription>
                Verwalten Sie Ihre Sicherheitseinstellungen
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Passwort ändern</Label>
                  <p className="text-sm text-muted-foreground">Aktualisieren Sie Ihr Passwort regelmäßig für mehr Sicherheit</p>
                </div>
                <Button variant="outline" onClick={() => alert('Noch nicht implementiert')}>
                  Passwort ändern
                </Button>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="space-y-0.5">
                  <Label className="text-destructive">Konto löschen</Label>
                  <p className="text-sm text-muted-foreground">Löscht alle Ihre Daten unwiderruflich</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => alert('Noch nicht implementiert')}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Konto löschen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Toaster />
      </div>
    </RequireAuth>
  )
} 