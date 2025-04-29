"use client"

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { createClientBrowser } from "@/utils/supabase/client"
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
  Info,
  Download,
  Trash2,
  Eye,
  EyeOff,
  HelpCircle,
  Sliders,
  BookOpen,
  Target,
  Sparkles,
  FileText,
  Settings,
  ShieldCheck,
  User,
  Code,
  Loader2
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import RequireAuth from "@/components/RequireAuth"
import { showSuccess, showError } from "@/utils/feedback"
import { Skeleton } from "@/components/ui/skeleton"

interface UserSettings {
  theme: string
  language: string
  notifications: boolean
  notificationTime: string
  notificationFrequency: string
  aiSuggestions: boolean
  aiLevel: number
  feedbackDepth: string // changed to string: 'basic', 'standard', 'detailed'
  aiTopics: string[]
  aiPersonalization: boolean
  aiDataUsage: boolean
  analytics: boolean
  twoFactor: boolean
  dataRetention: string
  showSystemInfo: boolean
}

interface UserProfile {
  id: string
  settings?: UserSettings
}

// Helper component for setting groups
const SettingGroup = ({ 
  title, 
  description, 
  icon, 
  children 
}: { 
  title: string, 
  description: string, 
  icon: React.ReactNode, 
  children: React.ReactNode 
}) => {
  return (
    <div className="space-y-4 py-5 first:pt-0 last:pb-0 border-b last:border-b-0 border-border/40">
      <div className="flex items-center gap-3">
        <div className="bg-muted/50 p-1.5 rounded-md">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-base">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="pl-9 space-y-5">
        {children}
      </div>
    </div>
  )
}

// Helper component for individual settings items
const SettingItem = ({ 
  label, 
  description, 
  tooltip, 
  children 
}: { 
  label: string, 
  description?: string, 
  tooltip?: string, 
  children: React.ReactNode 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1.5">
      <div className="space-y-1 max-w-full sm:max-w-[70%]">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium">{label}</Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/70 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="ml-auto sm:ml-0">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientBrowser()
  
  const defaultSettings: UserSettings = {
    theme: "system",
    language: "de",
    notifications: true,
    notificationTime: "18",
    notificationFrequency: "daily",
    aiSuggestions: true,
    aiLevel: 75,
    feedbackDepth: "standard", // changed from numeric to string value
    aiTopics: ["technical", "softskills", "project"],
    aiPersonalization: true,
    aiDataUsage: true,
    analytics: true,
    twoFactor: false,
    dataRetention: "1year",
    showSystemInfo: true
  }
  
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [savedSettings, setSavedSettings] = useState<UserSettings | null>(null)

  // Load settings from Supabase on mount
  useEffect(() => {
    async function loadUserSettings() {
      try {
        setLoading(true)
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          console.log('No user session found')
          setLoading(false)
          return
        }
        
        setUserId(session.user.id)
        
        // Get user profile with settings
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('settings')
          .eq('id', session.user.id)
          .single()
        
        if (userError) {
          console.error('Error fetching user settings:', userError)
          return
        }
        
        if (userData?.settings) {
          // Merge with defaults to ensure we have all fields
          const mergedSettings = {
            ...defaultSettings,
            ...userData.settings
          }
          
          setSettings(mergedSettings)
          setSavedSettings(mergedSettings)
          
          // Sync theme with system
          if (mergedSettings.theme) {
            setTheme(mergedSettings.theme)
          }
        } else {
          // If no settings exist yet, use defaults
          setSettings(defaultSettings)
          setSavedSettings(defaultSettings)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserSettings()
  }, [supabase, setTheme])

  // Sync theme with settings when theme changes externally
  useEffect(() => {
    if (theme) {
      setSettings(prev => ({ ...prev, theme }))
    }
  }, [theme])

  const handleThemeChange = (value: string) => {
    // Set the theme immediately for UI responsiveness
    setTheme(value)
    
    // Update local settings state
    setSettings(prev => ({ ...prev, theme: value }))
    
    // If user is logged in, save to backend (but don't show toast here)
    if (userId) {
      supabase
        .from('profiles')
        .update({
          settings: { ...settings, theme: value }
        })
        .eq('id', userId)
        .then(({ error }) => {
          if (error) {
            console.error('Error saving theme setting:', error)
          } else {
            // Successfully saved to backend
            localStorage.setItem("userTheme", value)
          }
        })
    }
  }

  const handleSettingChange = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!userId) {
      showError("settings", {
        title: "Fehler",
        description: "Sie sind nicht eingeloggt."
      })
      return
    }
    
    setIsSaving(true)
    
    // Save current settings including current theme
    const settingsToSave = {
      ...settings,
      theme: theme || "system"
    }
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          settings: settingsToSave
        })
        .eq('id', userId)
      
      if (error) {
        throw error
      }
      
      // Also save to localStorage for backup/faster access
      localStorage.setItem("userSettings", JSON.stringify(settingsToSave))
      setSavedSettings({...settingsToSave})
      
      showSuccess("settings")
    } catch (error) {
      console.error('Error saving settings:', error)
      showError("settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    const confirmReset = window.confirm("Möchten Sie wirklich alle Einstellungen zurücksetzen?")
    
    if (confirmReset && userId) {
      setIsSaving(true)
      
      try {
        // Reset to default settings
        const { error } = await supabase
          .from('profiles')
          .update({
            settings: defaultSettings
          })
          .eq('id', userId)
        
        if (error) {
          throw error
        }
        
        // Update local state
        setSettings(defaultSettings)
        setSavedSettings(defaultSettings)
        setTheme(defaultSettings.theme)
        
        // Clear localStorage
        localStorage.removeItem("userSettings")
        
        showSuccess("reset")
      } catch (error) {
        console.error('Error resetting settings:', error)
        showError("reset")
      } finally {
        setIsSaving(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="py-6 space-y-6">
        <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
        <div className="px-6">
          <div className="grid gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[400px] w-full" />
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
            <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
            <p className="text-muted-foreground mt-1">Passen Sie die Anwendung an Ihre Bedürfnisse an</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleReset} 
              disabled={isSaving}
              className="gap-2"
            >
              Zurücksetzen
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !savedSettings}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Speichern...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Speichern
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="px-6">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 md:w-auto">
              <TabsTrigger value="general" className="gap-2 px-2 text-xs sm:text-sm overflow-hidden">
                <Settings className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline truncate">Allgemein</span>
                <span className="inline sm:hidden">Allg.</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2 px-2 text-xs sm:text-sm overflow-hidden">
                <Bell className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline truncate">Benachrichtigungen</span>
                <span className="inline sm:hidden">Benachr.</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2 px-2 text-xs sm:text-sm overflow-hidden">
                <Brain className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline truncate">KI-Funktionen</span>
                <span className="inline sm:hidden">KI</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2 px-2 text-xs sm:text-sm overflow-hidden">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline truncate">Sicherheit</span>
                <span className="inline sm:hidden">Sicherh.</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Darstellung</CardTitle>
                  <CardDescription>
                    Passen Sie das Erscheinungsbild der Anwendung an
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SettingGroup
                    title="Erscheinungsbild"
                    description="Passen Sie die visuelle Darstellung der Anwendung an"
                    icon={<Settings className="h-4 w-4 text-muted-foreground" />}
                  >
                    <SettingItem
                      label="Farbschema"
                      description="Wählen Sie zwischen hellem und dunklem Modus"
                    >
                      <Select
                        value={settings.theme}
                        onValueChange={(value) => handleThemeChange(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Wählen Sie ein Farbschema" />
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
                          <SelectItem value="system">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              <span>System</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingItem>
                  </SettingGroup>
                  
                  <SettingGroup
                    title="Sprache"
                    description="Wählen Sie die Anzeigesprache für die Benutzeroberfläche"
                    icon={<Languages className="h-4 w-4 text-muted-foreground" />}
                  >
                    <SettingItem label="Sprache">
                      <Select
                        value={settings.language}
                        onValueChange={(value) => handleSettingChange('language', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Wählen Sie eine Sprache" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="en">Englisch</SelectItem>
                          <SelectItem value="fr">Französisch</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingItem>
                  </SettingGroup>
                  
                  <SettingGroup
                    title="System"
                    description="Verwalten Sie Systemeinstellungen"
                    icon={<Code className="h-4 w-4 text-muted-foreground" />}
                  >
                    <SettingItem
                      label="Systeminformationen anzeigen"
                      description="Zeigt technische Informationen in der Fußzeile an"
                      tooltip="Diese Information kann bei der Fehlersuche hilfreich sein"
                    >
                      <Switch
                        checked={settings.showSystemInfo}
                        onCheckedChange={(checked) => handleSettingChange('showSystemInfo', checked)}
                      />
                    </SettingItem>
                  </SettingGroup>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Benachrichtigungen</CardTitle>
                  <CardDescription>
                    Verwalten Sie, wie und wann Sie benachrichtigt werden
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SettingGroup
                    title="Benachrichtigungen"
                    description="Konfigurieren Sie Benachrichtigungseinstellungen"
                    icon={<Bell className="h-4 w-4 text-muted-foreground" />}
                  >
                    <SettingItem 
                      label="Benachrichtigungen aktivieren" 
                      description="Erhalten Sie Erinnerungen zur regelmäßigen Reflexion"
                    >
                      <Switch
                        checked={settings.notifications}
                        onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                      />
                    </SettingItem>
                    
                    {settings.notifications && (
                      <>
                        <SettingItem label="Häufigkeit">
                          <Select
                            value={settings.notificationFrequency}
                            onValueChange={(value) => handleSettingChange('notificationFrequency', value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Wählen Sie eine Häufigkeit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Täglich</SelectItem>
                              <SelectItem value="weekly">Wöchentlich</SelectItem>
                              <SelectItem value="biweekly">Zweiwöchentlich</SelectItem>
                              <SelectItem value="monthly">Monatlich</SelectItem>
                            </SelectContent>
                          </Select>
                        </SettingItem>
                        
                        <SettingItem 
                          label="Uhrzeit der Benachrichtigung" 
                          description="Wählen Sie eine bevorzugte Tageszeit für Benachrichtigungen"
                        >
                          <Select
                            value={settings.notificationTime}
                            onValueChange={(value) => handleSettingChange('notificationTime', value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Wählen Sie eine Zeit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9">09:00 Uhr</SelectItem>
                              <SelectItem value="12">12:00 Uhr</SelectItem>
                              <SelectItem value="15">15:00 Uhr</SelectItem>
                              <SelectItem value="18">18:00 Uhr</SelectItem>
                              <SelectItem value="21">21:00 Uhr</SelectItem>
                            </SelectContent>
                          </Select>
                        </SettingItem>
                      </>
                    )}
                  </SettingGroup>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>KI-Funktionen</CardTitle>
                  <CardDescription>
                    Verwalten Sie, wie KI-Features für Ihre Reflexionen verwendet werden
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SettingGroup
                    title="KI-Unterstützung"
                    description="Steuern Sie, wie KI-Funktionen Ihre Reflexionen verbessern"
                    icon={<Brain className="h-4 w-4 text-muted-foreground" />}
                  >
                    <SettingItem 
                      label="KI-Vorschläge aktivieren" 
                      description="Erhalten Sie Vorschläge für tiefere Reflexionen und Erkenntnisse"
                    >
                      <Switch
                        checked={settings.aiSuggestions}
                        onCheckedChange={(checked) => handleSettingChange('aiSuggestions', checked)}
                      />
                    </SettingItem>
                    
                    {settings.aiSuggestions && (
                      <>
                        <SettingItem 
                          label="KI-Intensität" 
                          description="Stellt ein, wie aktiv die KI Vorschläge machen soll"
                          tooltip="Höhere Werte führen zu mehr und detaillierteren Vorschlägen"
                        >
                          <div className="w-[180px] space-y-4">
                            <Slider
                              value={[settings.aiLevel]}
                              min={0}
                              max={100}
                              step={25}
                              onValueChange={([value]) => handleSettingChange('aiLevel', value)}
                              className="py-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground px-1">
                              <span>Minimal</span>
                              <span>Moderat</span>
                              <span>Maximal</span>
                            </div>
                          </div>
                        </SettingItem>
                        
                        <SettingItem 
                          label="KI-Feedback Detailgrad"
                          description="Wählen Sie, wie detailliert das KI-Feedback sein soll"
                        >
                          <Select
                            value={settings.feedbackDepth}
                            onValueChange={(value) => handleSettingChange('feedbackDepth', value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Standard" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Einfach</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="detailed">Detailliert</SelectItem>
                            </SelectContent>
                          </Select>
                        </SettingItem>
                        
                        <SettingItem 
                          label="KI-Personalisierung" 
                          description="Erlaubt der KI, aus Ihren früheren Reflexionen zu lernen"
                          tooltip="Verbessert die Relevanz der Vorschläge, indem Ihre früheren Reflexionen berücksichtigt werden"
                        >
                          <Switch
                            checked={settings.aiPersonalization}
                            onCheckedChange={(checked) => handleSettingChange('aiPersonalization', checked)}
                          />
                        </SettingItem>
                      </>
                    )}
                  </SettingGroup>
                  
                  {settings.aiSuggestions && (
                    <SettingGroup
                      title="KI-Datenschutz"
                      description="Steuern Sie, wie Ihre Daten für KI-Funktionen verwendet werden"
                      icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
                    >
                      <SettingItem 
                        label="KI-Datennutzung erlauben" 
                        description="Erlaubt anonymisierte Datennutzung zur Verbesserung der KI-Modelle"
                        tooltip="Ihre Daten werden nur anonymisiert verwendet und nie mit Ihrer Identität verknüpft"
                      >
                        <Switch
                          checked={settings.aiDataUsage}
                          onCheckedChange={(checked) => handleSettingChange('aiDataUsage', checked)}
                        />
                      </SettingItem>
                    </SettingGroup>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sicherheit & Datenschutz</CardTitle>
                  <CardDescription>
                    Verwalten Sie Sicherheitseinstellungen und Datenschutzoptionen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SettingGroup
                    title="Sicherheit"
                    description="Verwalten Sie Sicherheitseinstellungen für Ihr Konto"
                    icon={<Shield className="h-4 w-4 text-muted-foreground" />}
                  >
                    <SettingItem 
                      label="Zwei-Faktor-Authentifizierung" 
                      description="Erhöht die Sicherheit durch eine zusätzliche Authentifizierung"
                    >
                      <Switch
                        checked={settings.twoFactor}
                        onCheckedChange={(checked) => handleSettingChange('twoFactor', checked)}
                      />
                    </SettingItem>
                  </SettingGroup>
                  
                  <SettingGroup
                    title="Datenspeicherung"
                    description="Steuern Sie, wie lange Ihre Daten aufbewahrt werden"
                    icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                  >
                    <SettingItem label="Aufbewahrungszeitraum">
                      <Select
                        value={settings.dataRetention}
                        onValueChange={(value) => handleSettingChange('dataRetention', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Wählen Sie einen Zeitraum" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3months">3 Monate</SelectItem>
                          <SelectItem value="6months">6 Monate</SelectItem>
                          <SelectItem value="1year">1 Jahr</SelectItem>
                          <SelectItem value="forever">Unbegrenzt</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingItem>
                    
                    <SettingItem
                      label="Daten löschen"
                      description="Löscht alle Ihre Daten permanent"
                      tooltip="Diese Aktion kann nicht rückgängig gemacht werden"
                    >
                      <Button variant="destructive" size="sm" className="gap-1.5">
                        <Trash2 className="h-4 w-4" />
                        Löschen
                      </Button>
                    </SettingItem>
                  </SettingGroup>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <Toaster />
      </div>
    </RequireAuth>
  )
} 