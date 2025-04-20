"use client"

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

  return (
    <div className="h-full overflow-auto pb-8">
      {/* Header with save button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Einstellungen</h1>
          <p className="text-muted-foreground mt-1">
            Passen Sie die Anwendung an Ihre Bedürfnisse an
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline" onClick={handleReset}>
            Zurücksetzen
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || (savedSettings !== null && JSON.stringify(settings) === JSON.stringify(savedSettings))}
          >
            {isSaving ? 'Speichern...' : 'Speichern'}
          </Button>
        </div>
      </div>

      {/* Main settings area */}
      <div className="container max-w-3xl mx-auto px-4 sm:px-6">
        <div className="rounded-xl border bg-card shadow">
          <div className="p-6 space-y-6">
            
            {/* General */}
            <SettingGroup 
              title="Allgemein" 
              description="Grundlegende Einstellungen der Anwendung" 
              icon={<Settings className="h-5 w-5 text-muted-foreground" />}
            >
              <SettingItem 
                label="Erscheinungsbild" 
                description="Helles, dunkles oder Systemtheme"
              >
                <Select
                  value={theme || "system"}
                  onValueChange={handleThemeChange}
                >
                  <SelectTrigger className="w-[160px]">
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
              </SettingItem>
              
              <SettingItem 
                label="Sprache" 
                description="Sprache der Benutzeroberfläche"
              >
                <Select
                  value={settings.language}
                  onValueChange={(value) => handleSettingChange("language", value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sprache" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </SettingItem>
            </SettingGroup>

            {/* AI */}
            <SettingGroup 
              title="KI Vorschläge" 
              description="Einstellungen für KI-generierte Vorschläge" 
              icon={<Sparkles className="h-5 w-5 text-muted-foreground" />}
            >
              <SettingItem 
                label="Feedback-Tiefe" 
                description="Wie detailliert soll das KI-Feedback sein?"
                tooltip="Beeinflusst alle Feedback-Darstellungen im System (F6)"
              >
                <div className="flex items-center gap-4">
                  <Tabs 
                    value={String(settings.feedbackDepth)} 
                    onValueChange={val => handleSettingChange("feedbackDepth", Number(val))}
                    className="w-[280px]"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="1">Einfach</TabsTrigger>
                      <TabsTrigger value="2">Standard</TabsTrigger>
                      <TabsTrigger value="3">Detailliert</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </SettingItem>
              
              <SettingItem 
                label="System-Informationen anzeigen" 
                description="Erläuterungen zur KI-Analyse anzeigen (E2)"
                tooltip="Aktivieren Sie diese Option, um besser zu verstehen, wie die Bewertungen zustande kommen"
              >
                <Switch
                  checked={settings.showSystemInfo}
                  onCheckedChange={(checked) => 
                    handleSettingChange("showSystemInfo", checked)
                  }
                />
              </SettingItem>
            </SettingGroup>

            {/* Privacy */}
            <SettingGroup 
              title="Privatsphäre & Daten"
              description="Bestimmen Sie, welche Daten gespeichert werden"
              icon={<ShieldCheck className="h-5 w-5 text-muted-foreground" />}
            >
              <SettingItem 
                label="Lokale Datenverarbeitung" 
                description="Alle Reflexionstexte bleiben auf Ihrem Gerät (N4)"
                tooltip="Die KI-Analyse erfolgt direkt in Ihrem Browser, ohne Daten zu externen Servern zu senden"
              >
                <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  Immer aktiviert
                </Badge>
              </SettingItem>
              
              <SettingItem 
                label="Anonyme Nutzungsstatistiken" 
                description="Hilft uns, die App zu verbessern"
                tooltip="Wir sammeln nur anonyme Nutzungsdaten, keine persönlichen Inhalte"
              >
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => 
                    handleSettingChange("analytics", checked)
                  }
                />
              </SettingItem>
              
              <SettingItem label="Datenspeicherdauer">
                <Select
                  value={settings.dataRetention}
                  onValueChange={(value) => 
                    handleSettingChange("dataRetention", value)
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Speicherdauer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">1 Monat</SelectItem>
                    <SelectItem value="6months">6 Monate</SelectItem>
                    <SelectItem value="1year">1 Jahr</SelectItem>
                    <SelectItem value="forever">Unbegrenzt</SelectItem>
                  </SelectContent>
                </Select>
              </SettingItem>
            </SettingGroup>

            {/* Account */}
            <SettingGroup 
              title="Konto & Profile"
              description="Ihre persönlichen Informationen und Anmeldedaten"
              icon={<User className="h-5 w-5 text-muted-foreground" />}
            >
              <SettingItem 
                label="Benachrichtigungen aktivieren"
                tooltip="Erhalten Sie Erinnerungen, um regelmäßig zu reflektieren"
              >
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => 
                    handleSettingChange("notifications", checked)
                  }
                />
              </SettingItem>
              
              {settings.notifications && (
                <>
                  <SettingItem label="Erinnerungszeit">
                    <Select
                      value={settings.notificationTime}
                      onValueChange={(value) => 
                        handleSettingChange("notificationTime", value)
                      }
                      disabled={!settings.notifications}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Zeit" />
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
                  
                  <SettingItem label="Häufigkeit">
                    <Select
                      value={settings.notificationFrequency}
                      onValueChange={(value) => 
                        handleSettingChange("notificationFrequency", value)
                      }
                      disabled={!settings.notifications}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Häufigkeit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Täglich</SelectItem>
                        <SelectItem value="weekdays">Wochentags</SelectItem>
                        <SelectItem value="weekly">Wöchentlich</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingItem>
                </>
              )}
            </SettingGroup>

            {/* Developer */}
            <SettingGroup 
              title="Entwickleroptionen"
              description="Erweiterte Einstellungen für Entwickler"
              icon={<Code className="h-5 w-5 text-muted-foreground" />}
            >
              <SettingItem 
                label="KI-Unterstützungsgrad" 
                description={`${settings.aiLevel}% - von subtilen Hinweisen bis zu umfassenden Analysen`}
                tooltip="Bestimmt wie aktiv die KI Sie bei Ihrer Reflexion unterstützt"
              >
                <div className="w-[180px]">
                  <Slider
                    value={[settings.aiLevel]}
                    min={25}
                    max={100}
                    step={5}
                    onValueChange={(values) => 
                      handleSettingChange("aiLevel", values[0])
                    }
                    className="py-4"
                  />
                </div>
              </SettingItem>
              
              <SettingItem 
                label="Personalisierte Vorschläge" 
                description="Basierend auf Ihrem Lernfortschritt"
                tooltip="Die KI lernt aus Ihren bisherigen Reflexionen und passt Vorschläge an (F3)"
              >
                <Switch
                  checked={settings.aiPersonalization}
                  onCheckedChange={(checked) => 
                    handleSettingChange("aiPersonalization", checked)
                  }
                />
              </SettingItem>
              
              <SettingItem label="Bevorzugte Themen">
                <Select
                  value={settings.aiTopics[0]}
                  onValueChange={(value) => {
                    const newTopics = [...settings.aiTopics]
                    newTopics[0] = value
                    handleSettingChange("aiTopics", newTopics)
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Thema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Fachliches</SelectItem>
                    <SelectItem value="softskills">Soft Skills</SelectItem>
                    <SelectItem value="project">Projektarbeit</SelectItem>
                    <SelectItem value="leadership">Führung</SelectItem>
                    <SelectItem value="learning">Lernprozesse</SelectItem>
                  </SelectContent>
                </Select>
              </SettingItem>
            </SettingGroup>

            {/* About */}
            <SettingGroup 
              title="Über"
              description="Informationen zur Anwendung"
              icon={<Info className="h-5 w-5 text-muted-foreground" />}
            >
              <SettingItem 
                label="KI-Personalisierung" 
                description="Individualisieren Sie die KI-Unterstützung"
              >
                <Switch
                  checked={settings.aiPersonalization}
                  onCheckedChange={(checked) => 
                    handleSettingChange("aiPersonalization", checked)
                  }
                />
              </SettingItem>
            </SettingGroup>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
} 