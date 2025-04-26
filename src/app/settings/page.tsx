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
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import RequireAuth from "@/components/RequireAuth"

interface UserSettings {
  theme: string
  language: string
  notifications: boolean
  notificationTime: string
  notificationFrequency: string
  aiSuggestions: boolean
  aiLevel: number
  feedbackDepth: number
  aiTopics: string[]
  aiPersonalization: boolean
  aiDataUsage: boolean
  analytics: boolean
  twoFactor: boolean
  dataRetention: string
  showSystemInfo: boolean
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
  const [settings, setSettings] = useState<UserSettings>({
    theme: "system",
    language: "de",
    notifications: true,
    notificationTime: "18",
    notificationFrequency: "daily",
    aiSuggestions: true,
    aiLevel: 75,
    feedbackDepth: 2, // 1: Basic, 2: Standard, 3: Detailed
    aiTopics: ["technical", "softskills", "project"],
    aiPersonalization: true,
    aiDataUsage: true,
    analytics: true,
    twoFactor: false,
    dataRetention: "1year",
    showSystemInfo: true
  })
  const [savedSettings, setSavedSettings] = useState<UserSettings | null>(null)

  // Load settings from localStorage on mount only
  useEffect(() => {
    const savedSettingsJson = localStorage.getItem("userSettings")
    if (savedSettingsJson) {
      try {
        const parsed = JSON.parse(savedSettingsJson)
        setSettings(prev => ({...prev, ...parsed}))
        setSavedSettings({...parsed})
      } catch (e) {
        console.error("Error parsing settings:", e)
      }
    } else {
      // If no saved settings, current settings are the "saved" state
      setSavedSettings({...settings})
    }
  }, [])

  // Sync theme with settings when theme changes externally
  useEffect(() => {
    if (theme) {
      setSettings(prev => ({ ...prev, theme }))
    }
  }, [theme])

  const handleThemeChange = (value: string) => {
    setTheme(value)
  }

  const handleSettingChange = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
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
        setSavedSettings({...settingsToSave})
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
    }, 800)
  }

  const handleReset = () => {
    const confirmReset = window.confirm("Möchten Sie wirklich alle Einstellungen zurücksetzen?")
    if (confirmReset) {
      const defaultSettings: UserSettings = {
        theme: "system",
        language: "de",
        notifications: true,
        notificationTime: "18",
        notificationFrequency: "daily",
        aiSuggestions: true,
        aiLevel: 75,
        feedbackDepth: 2,
        aiTopics: ["technical", "softskills", "project"],
        aiPersonalization: true,
        aiDataUsage: true,
        analytics: true,
        twoFactor: false,
        dataRetention: "1year",
        showSystemInfo: true
      }
      
      setSettings(defaultSettings)
      setTheme(defaultSettings.theme)
      
      toast({
        title: "Einstellungen zurückgesetzt",
        description: "Alle Einstellungen wurden auf die Standardwerte zurückgesetzt.",
      })
    }
  }

  // Check if any settings have changed
  const hasChanges = savedSettings && Object.keys(settings).some(key => {
    const k = key as keyof UserSettings
    return settings[k] !== savedSettings[k]
  })

  return (
    <RequireAuth>
      <div className="p-6 pb-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
            <p className="text-muted-foreground">Verwalten Sie Ihre App- und Kontoeinstellungen</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="gap-1.5"
            >
              <AlertCircle className="h-4 w-4" />
              Zurücksetzen
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="gap-1.5"
            >
              {isSaving ? (
                <>Speichern...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Speichern
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="appearance">
          <div className="mb-8 overflow-x-auto">
            <TabsList className="mb-0 justify-start">
              <TabsTrigger value="appearance" className="gap-1.5">
                <Sun className="h-4 w-4" />
                Darstellung
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-1.5">
                <Bell className="h-4 w-4" />
                Benachrichtigungen
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-1.5">
                <Brain className="h-4 w-4" />
                KI-Funktionen
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-1.5">
                <BarChart className="h-4 w-4" />
                Analytik
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Sicherheit & Datenschutz
              </TabsTrigger>
              <TabsTrigger value="about" className="gap-1.5">
                <Info className="h-4 w-4" />
                Über
              </TabsTrigger>
            </TabsList>
          </div>
      
          <TabsContent value="appearance" className="space-y-6">
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
                        label="Feedback-Tiefe" 
                        description="Wählen Sie, wie detailliert KI-Feedback sein soll"
                      >
                        <div className="w-[180px]">
                          <Select
                            value={settings.feedbackDepth.toString()}
                            onValueChange={(value) => handleSettingChange('feedbackDepth', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Wählen Sie eine Tiefe" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Einfach</SelectItem>
                              <SelectItem value="2">Standard</SelectItem>
                              <SelectItem value="3">Detailliert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytik & Tracking</CardTitle>
                <CardDescription>
                  Verwalten Sie, wie Ihre Nutzungsdaten erfasst werden
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SettingGroup
                  title="Analytik"
                  description="Steuern Sie, wie Ihre Nutzungsdaten erfasst werden"
                  icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
                >
                  <SettingItem 
                    label="Analytik aktivieren" 
                    description="Hilft uns, die App zu verbessern, indem die Nutzung anonymisiert erfasst wird"
                    tooltip="Wir erfassen anonymisierte Daten zur Nutzung der App, um die Benutzerfreundlichkeit zu verbessern"
                  >
                    <Switch
                      checked={settings.analytics}
                      onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                    />
                  </SettingItem>
                  
                  <SettingItem
                    label="Daten exportieren"
                    description="Laden Sie Ihre persönlichen Nutzungsdaten herunter"
                  >
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Download className="h-4 w-4" />
                      Exportieren
                    </Button>
                  </SettingItem>
                </SettingGroup>
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
          
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Über MoonReflect</CardTitle>
                <CardDescription>
                  Informationen über die Anwendung und das System
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <Moon className="h-8 w-8 mr-2 text-primary" />
                    <span className="text-2xl font-bold">MoonReflect</span>
                  </div>
                  <p className="text-muted-foreground">
                    Eine fortschrittliche Reflexionsplattform, die Ihnen hilft, tiefere Einsichten in Ihre Erfahrungen zu gewinnen und persönliches Wachstum zu fördern.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="text-sm">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Erstellt von</span>
                    <span className="text-sm">John & Jane Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Kontakt</span>
                    <a href="mailto:support@moonreflect.com" className="text-sm text-primary">support@moonreflect.com</a>
                  </div>
                </div>
                
                {settings.showSystemInfo && (
                  <div className="pt-4 mt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Systeminformationen</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Browser</span>
                        <span>Chrome 115.0.5790.171</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Betriebssystem</span>
                        <span>Windows 11</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bildschirmauflösung</span>
                        <span>1920x1080</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start space-y-2">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/terms">Nutzungsbedingungen</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/privacy">Datenschutz</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/help">Hilfe</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Toaster />
      </div>
    </RequireAuth>
  )
} 