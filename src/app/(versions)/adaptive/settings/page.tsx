"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Brain,
  Home,
  Languages,
  Clock,
  Shield,
  Save,
  Check,
  MessageSquare,
  BarChart,
  Zap,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface UserSettings {
  theme: string
  language: string
  notifications: boolean
  notificationTime: string
  notificationFrequency: string
  aiSuggestions: boolean
  aiLevel: number
  aiTopics: string[]
  aiPersonalization: boolean
  aiDataUsage: boolean
  analytics: boolean
  twoFactor: boolean
  dataRetention: string
}

export default function AdaptiveSettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    theme: "system",
    language: "de",
    notifications: true,
    notificationTime: "18",
    notificationFrequency: "daily",
    aiSuggestions: true,
    aiLevel: 75,  // Default für erweiterte Version: höherer Unterstützungsgrad
    aiTopics: ["technical", "softskills", "project"],
    aiPersonalization: true,
    aiDataUsage: true,
    analytics: true,
    twoFactor: false,
    dataRetention: "1year"
  })

  // Load settings from localStorage on mount only
  useEffect(() => {
    const savedSettings = localStorage.getItem("adaptiveUserSettings")
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
        localStorage.setItem("adaptiveUserSettings", JSON.stringify(settingsToSave))
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
            <Link href="/adaptive/dashboard">
              <Button variant="ghost" size="icon">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-foreground">Einstellungen</span>
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
        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Allgemein</TabsTrigger>
              <TabsTrigger value="ai">KI-Einstellungen</TabsTrigger>
              <TabsTrigger value="privacy">Sicherheit</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
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
                        Erhalten Sie Erinnerungen für regelmäßige Reflexionen
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

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Häufigkeit</Label>
                      <Select
                        value={settings.notificationFrequency}
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, notificationFrequency: value }))
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Häufigkeit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Täglich</SelectItem>
                          <SelectItem value="weekly">Wöchentlich</SelectItem>
                          <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              {/* KI-Einstellungen (erweitert) */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <CardTitle>KI-Einstellungen</CardTitle>
                  </div>
                  <CardDescription>
                    Detaillierte Anpassung der KI-Unterstützung
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>KI-Vorschläge</Label>
                      <p className="text-sm text-muted-foreground">
                        Fortgeschrittene Vorschläge für Ihre Reflexionen
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
                      Detaillierte Einstellung der KI-Unterstützung
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
                      <span>Moderat</span>
                      <span>Standard</span>
                      <span>Umfassend</span>
                      <span>Maximal</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      KI-Personalisierung
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Personalisierte Vorschläge</Label>
                          <p className="text-sm text-muted-foreground">
                            KI lernt aus Ihren bisherigen Reflexionen
                          </p>
                        </div>
                        <Switch
                          checked={settings.aiPersonalization}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, aiPersonalization: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Lernverhalten-Analyse</Label>
                          <p className="text-sm text-muted-foreground">
                            KI analysiert Ihre Lernmuster für bessere Empfehlungen
                          </p>
                        </div>
                        <Switch
                          checked={settings.aiDataUsage}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, aiDataUsage: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
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

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Datenspeicherung</Label>
                      <Select
                        value={settings.dataRetention}
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, dataRetention: value }))
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Datenspeicherung" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3months">3 Monate</SelectItem>
                          <SelectItem value="6months">6 Monate</SelectItem>
                          <SelectItem value="1year">1 Jahr</SelectItem>
                          <SelectItem value="unlimited">Unbegrenzt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-yellow-200 border p-4 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Datenschutzhinweis</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                          Für die erweiterte KI-Funktionalität werden Ihre Reflexionsdaten 
                          anonymisiert zur Verbesserung der Vorschläge verwendet. 
                          Sie können dies jederzeit in den KI-Einstellungen deaktivieren.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Toaster />
    </div>
  )
} 