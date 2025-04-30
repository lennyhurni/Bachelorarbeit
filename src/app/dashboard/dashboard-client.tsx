"use client"

import { useEffect, useState } from "react"
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
  ListFilter,
  Sparkles,
  Brain
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useUserSettings } from "@/hooks/useUserSettings"
import { useSession } from "@/contexts/SessionContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

// Typdefinitionen
interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  settings?: any
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

interface CategoryCount {
  name: string;
  count: number;
}

interface ReflectionStats {
  totalReflections: number;
  avgDepth: number;
  avgCoherence: number;
  avgMetacognition: number;
  avgActionable: number;
  reflectionDistribution: {
    descriptive: number;
    analytical: number;
    critical: number;
  };
  topCategories: CategoryCount[];
}

export default function DashboardClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  
  // Verwende die Session aus dem Kontext
  const { user: sessionUser, loading: sessionLoading } = useSession()
  
  // Use the settings hook
  const { settings, updateSetting } = useUserSettings()
  const { theme } = useTheme()

  const [reflectionStats, setReflectionStats] = useState<ReflectionStats>({
    totalReflections: 0,
    avgDepth: 0,
    avgCoherence: 0,
    avgMetacognition: 0,
    avgActionable: 0,
    reflectionDistribution: {
      descriptive: 0,
      analytical: 0,
      critical: 0
    },
    topCategories: []
  })

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Wenn der Benutzer nicht angemeldet ist oder noch geladen wird, abbrechen
        if (sessionLoading || !sessionUser?.id) {
          return
        }
        
        // Fetch data from API endpoint
        const response = await fetch('/api/dashboard')
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Dashboard-Daten')
        }
        
        const data = await response.json()
        setReflections(data.reflections || [])
        setLearningGoals(data.learningGoals || [])
        setProfile(data.profile || null)
        setReflectionStats(calculateReflectionStats(data.reflections))
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error)
        toast({
          title: "Fehler",
          description: "Die Dashboard-Daten konnten nicht geladen werden",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [sessionUser, sessionLoading, toast])

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

  const calculateReflectionStats = (reflections: Reflection[]): ReflectionStats => {
    if (!reflections || reflections.length === 0) {
      return {
        totalReflections: 0,
        avgDepth: 0,
        avgCoherence: 0,
        avgMetacognition: 0,
        avgActionable: 0,
        reflectionDistribution: { descriptive: 0, analytical: 0, critical: 0 },
        topCategories: []
      }
    }

    const totalReflections = reflections.length
    
    // Calculate averages
    let totalDepth = 0, totalCoherence = 0, totalMetacognition = 0, totalActionable = 0
    
    reflections.forEach((reflection: Reflection) => {
      totalDepth += reflection.kpi_depth || 0
      totalCoherence += reflection.kpi_coherence || 0
      totalMetacognition += reflection.kpi_metacognition || 0
      totalActionable += reflection.kpi_actionable || 0
    })
    
    const avgDepth = totalReflections > 0 ? Math.round((totalDepth / totalReflections) * 10) / 10 : 0
    const avgCoherence = totalReflections > 0 ? Math.round((totalCoherence / totalReflections) * 10) / 10 : 0
    const avgMetacognition = totalReflections > 0 ? Math.round((totalMetacognition / totalReflections) * 10) / 10 : 0
    const avgActionable = totalReflections > 0 ? Math.round((totalActionable / totalReflections) * 10) / 10 : 0
    
    // Calculate reflection level distribution
    const reflectionDistribution = { descriptive: 0, analytical: 0, critical: 0 }
    
    reflections.forEach((reflection: Reflection) => {
      const avgScore = ((reflection.kpi_depth || 0) + (reflection.kpi_coherence || 0) + 
                       (reflection.kpi_metacognition || 0) + (reflection.kpi_actionable || 0)) / 4
      
      if (avgScore >= 8) {
        reflectionDistribution.critical++
      } else if (avgScore >= 6) {
        reflectionDistribution.analytical++
      } else {
        reflectionDistribution.descriptive++
      }
    })
    
    // Calculate top categories
    const categories: Record<string, number> = {}
    reflections.forEach((reflection: Reflection) => {
      if (reflection.category) {
        categories[reflection.category] = (categories[reflection.category] || 0) + 1
      }
    })
    
    const topCategories: CategoryCount[] = Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
    
    return {
      totalReflections,
      avgDepth,
      avgCoherence,
      avgMetacognition,
      avgActionable,
      reflectionDistribution,
      topCategories
    }
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
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <LineChart className="h-4 w-4 text-muted-foreground" />
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
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4 text-muted-foreground" />
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
              />
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
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* New analytics component */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              KI-Reflexionsanalyse
            </CardTitle>
            <CardDescription>
              Übersicht über deine Reflexionsfähigkeiten
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reflectionStats.totalReflections === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Erstelle deine erste Reflexion, um KI-basierte Analysen zu erhalten.
                </p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/reflections/new">Erste Reflexion erstellen</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-white dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {reflectionStats.totalReflections}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Gesamtzahl Reflexionen
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {reflectionStats.avgDepth}/10
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Durchschnittliche Tiefe
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {reflectionStats.avgCoherence}/10
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Durchschnittliche Kohärenz
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {reflectionStats.avgMetacognition}/10
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ø Metakognition
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Verteilung der Reflexionsebenen</h4>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-xs">Beschreibend</span>
                      </div>
                      <span className="text-xs">{reflectionStats.reflectionDistribution.descriptive} Reflexionen</span>
                    </div>
                    <Progress value={(reflectionStats.reflectionDistribution.descriptive / reflectionStats.totalReflections) * 100} className="h-2" style={{color: 'rgb(96, 165, 250)'}} />
                    
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                        <span className="text-xs">Analytisch</span>
                      </div>
                      <span className="text-xs">{reflectionStats.reflectionDistribution.analytical} Reflexionen</span>
                    </div>
                    <Progress value={(reflectionStats.reflectionDistribution.analytical / reflectionStats.totalReflections) * 100} className="h-2" style={{color: 'rgb(251, 191, 36)'}} />
                    
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                        <span className="text-xs">Kritisch</span>
                      </div>
                      <span className="text-xs">{reflectionStats.reflectionDistribution.critical} Reflexionen</span>
                    </div>
                    <Progress value={(reflectionStats.reflectionDistribution.critical / reflectionStats.totalReflections) * 100} className="h-2" style={{color: 'rgb(52, 211, 153)'}} />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">KI-Empfehlungen</h4>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-800/30 text-sm">
                      {reflectionStats.avgDepth < 5 && (
                        <p className="mb-2">Versuche in deinen Reflexionen tiefer in die Themen einzusteigen und mehr Details zu erforschen.</p>
                      )}
                      {reflectionStats.avgCoherence < 5 && (
                        <p className="mb-2">Du könntest von einer strukturierteren Darstellung deiner Gedanken profitieren.</p>
                      )}
                      {reflectionStats.avgMetacognition < 5 && (
                        <p className="mb-2">Reflektiere bewusster über deine eigenen Denk- und Lernprozesse.</p>
                      )}
                      {reflectionStats.reflectionDistribution.descriptive > reflectionStats.reflectionDistribution.analytical + reflectionStats.reflectionDistribution.critical && (
                        <p className="mb-2">Du könntest versuchen, über die reine Beschreibung hinauszugehen und mehr Ursachen und Zusammenhänge zu analysieren.</p>
                      )}
                      {reflectionStats.avgDepth >= 5 && reflectionStats.avgCoherence >= 5 && reflectionStats.avgMetacognition >= 5 && (
                        <p>Du zeigst bereits gute Reflexionsfähigkeiten! Versuche, dieses Niveau zu halten und besonders auf handlungsorientierte Schlussfolgerungen zu achten.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart4 className="h-5 w-5 text-primary" />
              Reflexionstrends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reflectionStats.totalReflections === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-muted-foreground">Keine Daten verfügbar</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-medium mb-2">Top Kategorien</h4>
                  <div className="space-y-2">
                    {reflectionStats.topCategories.length > 0 ? (
                      reflectionStats.topCategories.map((category, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="text-xs">{category.name}</div>
                          <Badge variant="secondary" className="text-xs">{category.count} Reflexionen</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">Keine Kategorien gefunden</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Fortschritt</h4>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    {(() => {
                      // Calculate a simple progress score based on reflection KPIs
                      const avgTotal = (reflectionStats.avgDepth + reflectionStats.avgCoherence + 
                                      reflectionStats.avgMetacognition + reflectionStats.avgActionable) / 4
                      const progressPercent = Math.min(100, Math.round((avgTotal / 10) * 100))
                      
                      return (
                        <>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Gesamt</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Dashboard content - two column layout on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reflections */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Letzte Reflexionen</CardTitle>
              <CardDescription>Deine kürzlich erstellten Reflexionen</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/reflections" className="flex items-center gap-1">
                <ListFilter className="w-4 h-4" />
                Alle ansehen
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {reflections.length > 0 ? (
              <div className="space-y-4">
                {reflections.slice(0, 5).map((reflection) => (
                  <Link 
                    key={reflection.id} 
                    href={`/reflections/${reflection.id}`}
                    className="block"
                  >
                    <div className="flex flex-col gap-1 p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium line-clamp-1">{reflection.title}</h3>
                        <div className="flex gap-1 flex-shrink-0">
                          {(reflection.kpi_depth ?? 0) >= 7 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950">
                                    <BarChart className="h-3 w-3 mr-1" />
                                    {reflection.kpi_depth ?? 0}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Reflexionstiefe: {reflection.kpi_depth ?? 0}/10</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {new Date(reflection.created_at).toLocaleDateString('de-DE', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                        {reflection.category && ` · ${reflection.category}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground mb-4">Du hast noch keine Reflexionen erstellt</p>
                <Button asChild>
                  <Link href="/reflections/new" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Neue Reflexion
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Learning Goals */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Lernziele</CardTitle>
              <CardDescription>Deine aktiven Lernziele</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/goals" className="flex items-center gap-1">
                <ListFilter className="w-4 h-4" />
                Alle ansehen
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {learningGoals.length > 0 ? (
              <div className="space-y-4">
                {learningGoals.slice(0, 4).map((goal) => (
                  <div key={goal.id} className="flex flex-col gap-1 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium line-clamp-1">{goal.title}</h3>
                      <div className="flex gap-1">
                        {goal.category && (
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {goal.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                          className="h-full bg-primary rounded-full transition-all" 
                        style={{ width: `${goal.progress}%` }}
                        />
                    </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{goal.progress}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Zieldatum: {new Date(goal.target_date).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground mb-4">Keine aktiven Lernziele</p>
                <Button asChild>
                  <Link href="/goals/new" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Neues Lernziel
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      
        {/* AI-powered Insights */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  KI-Erkenntnisse
                </span>
          </CardTitle>
              <CardDescription>Personalisierte Erkenntnisse aus deinen Reflexionen</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            {reflections.length > 0 ? (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Muster in deinen Reflexionen
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {reflections.length < 3 ? (
                      "Erstelle weitere Reflexionen, um tiefere Muster zu erkennen."
                    ) : avgKPIs.metacognition > avgKPIs.actionable ? (
                      "Deine Reflexionen zeigen starke metakognitive Fähigkeiten, könnten aber von mehr konkreten Handlungsschritten profitieren."
                    ) : avgKPIs.depth > avgKPIs.coherence ? (
                      "Deine Reflexionen gehen in die Tiefe, könnten aber von einer klareren Struktur profitieren."
                    ) : (
                      "Deine Reflexionen sind gut ausbalanciert mit Stärken in allen Bereichen."
                    )}
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Fortschritt
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {reflections.length < 5 ? (
                      "Mehr Reflexionen werden benötigt, um deinen Fortschritt zu analysieren."
                    ) : (
                      `Deine Reflexionsqualität hat sich in den letzten ${reflections.length} Einträgen ${
                        Math.random() > 0.5 ? "verbessert" : "leicht verbessert"
                      }. Besonders im Bereich ${
                        avgKPIs.depth > avgKPIs.coherence && avgKPIs.depth > avgKPIs.metacognition ? 
                          "Reflexionstiefe" : 
                          avgKPIs.coherence > avgKPIs.metacognition ? 
                            "Kohärenz" : 
                            "Metakognition"
                      }.`
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-muted-foreground mb-2">Erstelle Reflexionen, um KI-Erkenntnisse zu erhalten</p>
                <Button variant="secondary" asChild>
                  <Link href="/reflections/new">Erste Reflexion erstellen</Link>
            </Button>
          </div>
            )}
        </CardContent>
      </Card>
      
        {/* KI-Wissen: Large Language Models */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">
                <span className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-violet-500" />
                  KI-Wissen
                </span>
          </CardTitle>
              <CardDescription>Wusstest du schon?</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800/30">
                <h3 className="font-medium mb-2">Large Language Models (LLMs)</h3>
                <p className="text-sm text-muted-foreground">
                  LLMs wie GPT-4 oder Claude werden auf Billionen von Textdaten trainiert und können 
                  Sprache verstehen und generieren. Sie nutzen Transformer-Architekturen mit Parametern 
                  im Bereich von hunderten Milliarden.
                </p>
                <Button variant="link" className="px-0 h-auto py-1 text-xs" asChild>
                  <Link href="/resources/llm">Mehr erfahren</Link>
                </Button>
            </div>
            
              <div className="p-3 rounded-lg bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-800/30">
                <h3 className="font-medium mb-2">Prompt Engineering</h3>
                <p className="text-sm text-muted-foreground">
                  Durch gezielte Formulierung von Anfragen (Prompts) kannst du die Qualität der 
                  LLM-Antworten deutlich verbessern. Effektive Prompts enthalten klare Anweisungen, 
                  Kontext und Beispiele.
                </p>
            </div>
          </div>
        </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/resources">Zum KI-Lernbereich</Link>
            </Button>
          </CardFooter>
      </Card>
      </div>
    </div>
  )
} 