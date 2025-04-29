"use client"

import { useEffect, useState } from "react"
import { createClientBrowser } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { 
  LineChart, 
  PieChart, 
  Target, 
  BarChart, 
  Lightbulb,
  Plus,
  Settings,
  BarChart4,
  TrendingUp,
  ListFilter
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { UserSettings as UserSettingsType } from "@/utils/user-settings"
import { useUserSettings } from "@/hooks/useUserSettings"
import { ensureUserProfile } from "@/utils/profile-manager"
import { useSession } from "@/contexts/SessionContext"
import { useTheme } from "@/contexts/ThemeContext"

// Typdefinitionen
interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  settings?: UserSettingsType
}

interface Reflection {
  id: string
  title: string
  created_at: string
  category: string
  is_public: boolean
  kpi_depth?: number
  kpi_coherence?: number
  kpi_metacognition?: number
  kpi_actionable?: number
}

interface LearningGoal {
  id: string
  title: string
  created_at: string
  target_date: string
  progress: number
  is_completed: boolean
  category: string
}

export default function DashboardClient() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientBrowser()
  const router = useRouter()
  
  // Verwende die Session aus dem Kontext
  const { user: sessionUser, loading: sessionLoading } = useSession()
  
  // Use the settings hook
  const { settings, updateSetting } = useUserSettings()
  const { theme } = useTheme()

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Wenn der Benutzer nicht angemeldet ist oder noch geladen wird, abbrechen
        if (sessionLoading || !sessionUser?.id) {
          return
        }
        
        // Reflexionen laden
        try {
          const { data: reflectionsData, error: reflectionsError } = await supabase
            .from('reflections')
            .select('*')
            .eq('user_id', sessionUser.id)
            .order('created_at', { ascending: false })
            .limit(5)

          if (reflectionsError) {
            console.error('Fehler beim Abrufen der Reflexionen:', JSON.stringify(reflectionsError, null, 2))
          } else {
            setReflections(reflectionsData || [])
          }
        } catch (error) {
          console.error('Unerwarteter Fehler beim Laden der Reflexionen:', JSON.stringify(error, null, 2))
          setReflections([])
        }

        // Lernziele laden
        try {
          const { data: goalsData, error: goalsError } = await supabase
            .from('learning_goals')
            .select('*')
            .eq('user_id', sessionUser.id)
            .eq('is_completed', false)
            .order('target_date', { ascending: true })
            .limit(5)

          if (goalsError) {
            console.error('Fehler beim Abrufen der Lernziele:', JSON.stringify(goalsError, null, 2))
          } else {
            setLearningGoals(goalsData || [])
          }
        } catch (error) {
          console.error('Unerwarteter Fehler beim Laden der Lernziele:', JSON.stringify(error, null, 2))
          setLearningGoals([])
        }
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', JSON.stringify(error, null, 2))
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [supabase, sessionUser, sessionLoading])

  // Handle feedback depth change with the hook
  const handleFeedbackDepthChange = (value: string) => {
    updateSetting('feedbackDepth', value)
  }

  // Funktion zur Berechnung der durchschnittlichen KPI-Werte
  const calculateAverageKPIs = () => {
    if (!reflections || reflections.length === 0) return { depth: 0, coherence: 0, metacognition: 0, actionable: 0 }
    
    const sum = reflections.reduce((acc, reflection) => {
      return {
        depth: acc.depth + (reflection.kpi_depth || 0),
        coherence: acc.coherence + (reflection.kpi_coherence || 0),
        metacognition: acc.metacognition + (reflection.kpi_metacognition || 0),
        actionable: acc.actionable + (reflection.kpi_actionable || 0)
      }
    }, { depth: 0, coherence: 0, metacognition: 0, actionable: 0 })
    
    return {
      depth: Math.round(sum.depth / reflections.length),
      coherence: Math.round(sum.coherence / reflections.length),
      metacognition: Math.round(sum.metacognition / reflections.length),
      actionable: Math.round(sum.actionable / reflections.length)
    }
  }

  // Berechne die Fortschrittsstatistiken für Lernziele
  const calculateGoalStats = () => {
    if (!learningGoals || learningGoals.length === 0) {
      return { total: 0, completed: 0, inProgress: 0, avgProgress: 0 }
    }
    
    const total = learningGoals.length
    const completed = learningGoals.filter(goal => goal.is_completed).length
    const inProgress = total - completed
    const avgProgress = Math.round(
      learningGoals.reduce((sum, goal) => sum + goal.progress, 0) / total
    )
    
    return { total, completed, inProgress, avgProgress }
  }

  // Rendering für Ladestaaten
  if (sessionLoading || loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[150px] w-full rounded-xl" />
          <Skeleton className="h-[150px] w-full rounded-xl" />
        </div>
      </div>
    )
  }

  const avgKPIs = calculateAverageKPIs()
  const goalStats = calculateGoalStats()

  return (
    <div className="container mx-auto p-6 overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="feedback-depth" className="text-sm">Feedback-Tiefe:</Label>
                    <Select 
                      value={settings.feedbackDepth} 
                      onValueChange={handleFeedbackDepthChange}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Standard" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Einfach</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="detailed">Detailliert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Wähle die Detailtiefe für dein KI-Feedback</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              Reflexionstiefe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgKPIs.depth}/10</div>
            <p className="text-xs text-muted-foreground mt-1">
              {avgKPIs.depth < 4 ? 'Ausbaufähig' : avgKPIs.depth < 7 ? 'Gut' : 'Ausgezeichnet'}
            </p>
            <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${avgKPIs.depth * 10}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Kohärenz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgKPIs.coherence}/10</div>
            <p className="text-xs text-muted-foreground mt-1">
              {avgKPIs.coherence < 4 ? 'Ausbaufähig' : avgKPIs.coherence < 7 ? 'Gut' : 'Ausgezeichnet'}
            </p>
            <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${avgKPIs.coherence * 10}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart4 className="h-4 w-4 text-muted-foreground" />
              Metakognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgKPIs.metacognition}/10</div>
            <p className="text-xs text-muted-foreground mt-1">
              {avgKPIs.metacognition < 4 ? 'Ausbaufähig' : avgKPIs.metacognition < 7 ? 'Gut' : 'Ausgezeichnet'}
            </p>
            <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${avgKPIs.metacognition * 10}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Handlungsorientierung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgKPIs.actionable}/10</div>
            <p className="text-xs text-muted-foreground mt-1">
              {avgKPIs.actionable < 4 ? 'Ausbaufähig' : avgKPIs.actionable < 7 ? 'Gut' : 'Ausgezeichnet'}
            </p>
            <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${avgKPIs.actionable * 10}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Reflections & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Neueste Reflexionen</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/reflections/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Neu
                </Link>
              </Button>
            </div>
            <CardDescription>Deine letzten Reflexionseinträge</CardDescription>
          </CardHeader>
          <CardContent>
            {reflections.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3">Keine Reflexionen vorhanden. Erstelle deine erste Reflexion!</p>
            ) : (
              <div className="space-y-2">
                {reflections.map((reflection) => (
                  <div key={reflection.id} className="flex items-center justify-between bg-muted/30 p-2 rounded">
                    <div className="flex-1 min-w-0">
                      <Link href={`/reflections/${reflection.id}`} className="font-medium hover:underline">
                        {reflection.title}
                      </Link>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(reflection.created_at).toLocaleDateString('de-DE')}
                        </span>
                        {reflection.category && (
                          <Badge variant="outline" className="ml-2 text-xs">{reflection.category}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground">Tiefe:</span>
                      <span className="font-medium">{reflection.kpi_depth || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/reflections">Alle anzeigen</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Lernziele</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Neu
              </Button>
            </div>
            <CardDescription>Deine aktiven Lernziele</CardDescription>
          </CardHeader>
          <CardContent>
            {learningGoals.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3">Keine Lernziele vorhanden. Setze dir neue Ziele!</p>
            ) : (
              <div className="space-y-3">
                {learningGoals.map((goal) => (
                  <div key={goal.id} className="space-y-1">
                    <div className="flex justify-between items-start text-sm">
                      <div className="flex items-center">
                        <span className="font-medium">{goal.title}</span>
                        {goal.category && (
                          <Badge variant="outline" className="ml-2 text-xs">{goal.category}</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {goal.target_date && new Date(goal.target_date).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{goal.progress}% abgeschlossen</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full">
              Alle anzeigen
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Reflection Impulse */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Reflexionsimpuls
          </CardTitle>
          <CardDescription>Ein personalisierter Impuls, um deine Reflexionen zu vertiefen</CardDescription>
        </CardHeader>
        <CardContent>
          <blockquote className="border-l-4 border-primary/70 pl-4 italic">
            "Betrachte eine Herausforderung, der du kürzlich begegnet bist. Wie haben deine früheren Erfahrungen 
            deine Reaktion beeinflusst? Welche alternativen Handlungsweisen hättest du in Betracht ziehen können?"
          </blockquote>
          <div className="mt-4">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Mit diesem Impuls reflektieren
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Filter Settings */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-muted-foreground" />
            Filter und Sortieroptionen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="sort-by" className="text-xs">Sortieren nach</Label>
              <Select defaultValue="date-desc">
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="Auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Datum (neueste zuerst)</SelectItem>
                  <SelectItem value="date-asc">Datum (älteste zuerst)</SelectItem>
                  <SelectItem value="depth-desc">Tiefe (höchste zuerst)</SelectItem>
                  <SelectItem value="title">Titel (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="category-filter" className="text-xs">Kategorie</Label>
              <Select defaultValue="all">
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle anzeigen</SelectItem>
                  <SelectItem value="work">Beruf</SelectItem>
                  <SelectItem value="education">Ausbildung</SelectItem>
                  <SelectItem value="personal">Persönlich</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="kpi-filter" className="text-xs">KPI-Bereich</Label>
              <Select defaultValue="all-kpis">
                <SelectTrigger id="kpi-filter">
                  <SelectValue placeholder="Auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-kpis">Alle KPIs</SelectItem>
                  <SelectItem value="depth">Reflexionstiefe</SelectItem>
                  <SelectItem value="coherence">Kohärenz</SelectItem>
                  <SelectItem value="metacognition">Metakognition</SelectItem>
                  <SelectItem value="actionable">Handlungsorientierung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 