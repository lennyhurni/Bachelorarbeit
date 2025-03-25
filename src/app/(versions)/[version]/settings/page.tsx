"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
  Settings,
  Bell,
  Moon,
  Sun,
  Brain,
  Home,
  ChevronRight,
  Languages,
  Clock,
  Shield,
  Save,
  Check
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface UserSettings {
  theme: string
  language: string
  notifications: boolean
  notificationTime: string
  aiSuggestions: boolean
  aiLevel: number
  analytics: boolean
  twoFactor: boolean
}

export default function SettingsPage() {
  const pathname = usePathname()
  const version = pathname.startsWith("/adaptive") ? "adaptive" : "simple"
  const isAdaptive = version === "adaptive"
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    theme: "system",
    language: "de",
    notifications: false,
    notificationTime: "18",
    aiSuggestions: true,
    aiLevel: 75,
    analytics: true,
    twoFactor: false
  })

  // Load settings from localStorage on mount only
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
    }
  }, []) // Empty dependency array - only run once on mount

  // Sync theme with settings when theme changes externally
  useEffect(() => {
    if (theme) {
      setSettings(prev => ({ ...prev, theme }))
    }
  }, [theme])

  const handleThemeChange = (value: string) => {
    setTheme(value)  // This will trigger the above useEffect
  }

  const handleSave = () => {
    setIsSaving(true)
    
    // Save current settings including current theme
    const settingsToSave = {
      ...settings,
      theme: theme || "system"
    }
    
    setTimeout(() => {
      try {
        localStorage.setItem("userSettings", JSON.stringify(settingsToSave))
        setIsSaving(false)
        toast({
          title: "Einstellungen gespeichert",
          description: "Ihre Einstellungen wurden erfolgreich gespeichert.",
        })
      } catch (error) {
        console.error('Error saving settings:', error)
        toast({
          title: "Fehler beim Speichern",
          description: "Ihre Einstellungen konnten nicht gespeichert werden.",
          variant: "destructive"
        })
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${version}/dashboard`}>
              <Button variant="ghost" size="icon">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-foreground">{isAdaptive ? "KI-Einstellungen" : "Einstellungen"}</span>
            </div>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Check className="h-4 w-4 animate-pulse" />
                Wird gespeichert...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Speichern
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Settings Header */}
        <div className="flex items-center gap-2 mb-8">
          {isAdaptive ? (
            <Brain className="h-8 w-8 text-primary" />
          ) : (
            <Settings className="h-8 w-8 text-primary" />
          )}
          <h1 className="text-3xl font-bold">{isAdaptive ? "KI-Einstellungen" : "Einstellungen"}</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Allgemeine Einstellungen */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Allgemeine Einstellungen</CardTitle>
              <CardDescription>
                Passen Sie die grundlegenden Funktionen der App an
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Erscheinungsbild</Label>
                  <p className="text-sm text-muted-foreground">
                    Wählen Sie zwischen hell und dunkel
                  </p>
                </div>
                <Select
                  value={theme || "system"}
                  onValueChange={handleThemeChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Erscheinungsbild" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span>Hell</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span>Dunkel</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sprache</Label>
                  <p className="text-sm text-muted-foreground">
                    Wählen Sie Ihre bevorzugte Sprache
                  </p>
                </div>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sprache" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Benachrichtigungen */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Benachrichtigungen</CardTitle>
              <CardDescription>
                Legen Sie fest, wann Sie Erinnerungen erhalten möchten
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reflexions-Erinnerungen</Label>
                  <p className="text-sm text-muted-foreground">
                    Erhalten Sie Erinnerungen für regelmässige Reflexionen
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, notifications: checked }))
                  }
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Erinnerungszeit</Label>
                  <Select
                    value={settings.notificationTime}
                    onValueChange={(value) => 
                      setSettings(prev => ({ ...prev, notificationTime: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Uhrzeit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">09:00</SelectItem>
                      <SelectItem value="12">12:00</SelectItem>
                      <SelectItem value="15">15:00</SelectItem>
                      <SelectItem value="18">18:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KI-Einstellungen (nur in der adaptiven Version) */}
          {isAdaptive && (
            <Card className="mb-6 border-primary/30 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle>KI-Einstellungen</CardTitle>
                </div>
                <CardDescription>
                  Passen Sie die KI-Unterstützung an Ihre Bedürfnisse an
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatische Vorschläge</Label>
                    <p className="text-sm text-muted-foreground">
                      KI schlägt automatisch Reflexionsthemen vor
                    </p>
                  </div>
                  <Switch
                    checked={settings.aiSuggestions}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, aiSuggestions: checked }))
                    }
                  />
                </div>

                <div className="space-y-4">
                  <Label>KI-Unterstützungsgrad</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bestimmen Sie, wie aktiv die KI Sie unterstützen soll
                  </p>
                  <Slider
                    value={[settings.aiLevel]}
                    onValueChange={(value) => 
                      setSettings(prev => ({ ...prev, aiLevel: value[0] }))
                    }
                    max={100}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Minimal</span>
                    <span>Ausgewogen</span>
                    <span>Proaktiv</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Datenschutz */}
          <Card>
            <CardHeader>
              <CardTitle>Datenschutz & Sicherheit</CardTitle>
              <CardDescription>
                Verwalten Sie Ihre Datenschutzeinstellungen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anonyme Nutzungsstatistiken</Label>
                  <p className="text-sm text-muted-foreground">
                    Helfen Sie uns, die App zu verbessern
                  </p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Zwei-Faktor-Authentifizierung</Label>
                  <p className="text-sm text-muted-foreground">
                    Erhöhen Sie die Sicherheit Ihres Accounts
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactor}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, twoFactor: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Toaster />
    </div>
  )
} 