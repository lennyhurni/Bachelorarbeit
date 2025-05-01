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
  Brain,
  RefreshCw
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

  const [currentPrompt, setCurrentPrompt] = useState<string>("")
  const [processingPrompt, setProcessingPrompt] = useState<boolean>(false)

  useEffect(() => {
    async function loadData() {
      try {
        // Wenn der Benutzer nicht angemeldet ist oder noch geladen wird, abbrechen
        if (sessionLoading || !sessionUser?.id) {
          return
        }
        
        setLoading(true)
        
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
        setCurrentPrompt(data.currentPrompt || "")
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
    
    // Cargar datos cuando el usuario esté disponible
    if (!sessionLoading && sessionUser?.id) {
      loadData()
    }
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

  const handleGenerateNewPrompt = async () => {
    setProcessingPrompt(true)
    try {
      const response = await fetch('/api/reflections/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Fehler beim Generieren eines neuen Impulses')
      }

      const data = await response.json()
      
      if (data.prompt) {
        setCurrentPrompt(data.prompt)
        toast({
          title: "Neuer Impuls generiert",
          description: "Ein neuer Reflexionsimpuls wurde für dich erstellt.",
        })
      }
    } catch (error) {
      console.error('Fehler beim Generieren eines neuen Impulses:', error)
      toast({
        title: "Fehler",
        description: "Beim Generieren eines neuen Impulses ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setProcessingPrompt(false)
    }
  }

  // Zusätzliche Helper-Funktion, um Inhalte basierend auf Feedback-Tiefe anzupassen
  const getContentByFeedbackDepth = (basic: string, standard: string, detailed: string) => {
    switch (settings.feedbackDepth) {
      case 'basic':
        return basic;
      case 'detailed':
        return detailed;
      case 'standard':
      default:
        return standard;
    }
  }

  // Helper-Funktion für Tooltip-Inhalte basierend auf Feedback-Tiefe
  const getTooltipByFeedbackDepth = (metric: string) => {
    switch (metric) {
      case 'depth':
        return getContentByFeedbackDepth(
          "Wie tief gehst du in deinen Überlegungen.",
          "Reflexionstiefe zeigt, wie gründlich du Themen untersuchst und über oberflächliche Betrachtungen hinausgehst.",
          "Die Tiefe deiner Reflexion misst, wie gründlich du Themen analysierst, verschiedene Perspektiven erforschst und über die offensichtlichen Aspekte hinaus in tiefere Bedeutungsebenen eindringst."
        );
      case 'coherence':
        return getContentByFeedbackDepth(
          "Wie gut deine Gedanken zusammenhängen.",
          "Kohärenz zeigt, wie gut deine Gedanken logisch aufeinander aufbauen und ein stimmiges Ganzes bilden.",
          "Kohärenz misst die logische Struktur deiner Reflexion, wie gut deine Gedanken verbunden sind, und ob deine Argumentation einem roten Faden folgt, der zu schlüssigen Erkenntnissen führt."
        );
      case 'metacognition':
        return getContentByFeedbackDepth(
          "Wie gut du über dein eigenes Denken nachdenkst.",
          "Metakognition zeigt, wie bewusst du deine eigenen Denkprozesse und Lernstrategien reflektierst.",
          "Metakognition beurteilt, wie gut du dein eigenes Denken analysierst, deine mentalen Modelle hinterfragst und dein Bewusstsein für die Einflussfaktoren auf deine Überzeugungen und Annahmen entwickelst."
        );
      case 'actionable':
        return getContentByFeedbackDepth(
          "Wie gut du konkrete nächste Schritte ableitest.",
          "Handlungsorientierung zeigt, ob du aus deinen Überlegungen praktische Konsequenzen für die Zukunft ziehst.",
          "Handlungsorientierung misst, wie effektiv du aus deinen Erkenntnissen konkrete, umsetzbare Schlussfolgerungen und Handlungsschritte ableitest, die zu messbaren Veränderungen führen können."
        );
      default:
        return "";
    }
  };

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
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    {getContentByFeedbackDepth(
                      "Einfaches Feedback mit klaren, leicht verständlichen Erklärungen.",
                      "Ausgewogenes Feedback mit angemessener Detailtiefe und Hintergrundinformationen.",
                      "Detailliertes Feedback mit umfassenden Analysen, theoretischen Hintergründen und spezifischen Verbesserungsvorschlägen."
                    )}
                  </p>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{getTooltipByFeedbackDepth('depth')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{getTooltipByFeedbackDepth('coherence')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{getTooltipByFeedbackDepth('metacognition')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{getTooltipByFeedbackDepth('actionable')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
      
      {/* Main content section - simplified to two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left column: Feedback-Impuls */}
        <Card className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Reflexionsimpuls
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          {getContentByFeedbackDepth(
                            "Ein Thema für deine nächste Reflexion.",
                            "Ein personalisierter Reflexionsimpuls, der auf deinen bisherigen Reflexionen basiert und dich zu neuen Gedanken anregen soll.",
                            "Dieser KI-generierte Reflexionsimpuls wurde speziell für dich erstellt, basierend auf einer Analyse deiner bisherigen Reflexionsmuster, Stärken und Entwicklungsbereiche, um deine Reflexionspraxis zu bereichern und zu vertiefen."
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </CardTitle>
              <CardDescription>
                {getContentByFeedbackDepth(
                  "Idee für deine nächste Reflexion",
                  "Personalisierter Denkanstoss für deine nächste Reflexion",
                  "Individuell generierter Reflexionsimpuls zur Förderung kritischen Denkens"
                )}
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleGenerateNewPrompt}>
                    <RefreshCw className={`h-4 w-4 ${processingPrompt ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    {getContentByFeedbackDepth(
                      "Neuen Impuls generieren",
                      "Neuen personalisierten Impuls generieren",
                      "Einen neuen KI-personalisierten Reflexionsimpuls basierend auf deinen Reflexionsmustern generieren"
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800/30">
              <p className="text-lg font-medium text-center italic leading-relaxed">
                {currentPrompt || "Wie hat sich dein Verständnis zu diesem Thema im Laufe der Zeit entwickelt?"}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild>
                      <Link href="/reflections/new" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Neue Reflexion
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">
                      {getContentByFeedbackDepth(
                        "Starte eine neue Reflexion",
                        "Starte eine neue Reflexion mit diesem Impuls",
                        "Beginne eine neue Reflexion, die von diesem personalisierten Impuls geleitet wird"
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
        
        {/* Right column: KI-Reflexionsanalyse card */}
        <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              KI-Reflexionsanalyse
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      {getContentByFeedbackDepth(
                        "Diese Analyse zeigt dir, wie gut deine Reflexionen sind.",
                        "Diese KI-basierte Analyse wertet deine Reflexionen aus und zeigt dir deine Stärken und Verbesserungspotenziale.",
                        "Diese umfassende KI-Analyse evaluiert deine Reflexionen anhand mehrerer Qualitätsdimensionen und bietet dir detaillierte Einsichten zur Verbesserung deiner Reflexionspraxis."
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              {getContentByFeedbackDepth(
                "Wie gut sind deine Reflexionen?",
                "Übersicht über deine Reflexionsfähigkeiten",
                "Detaillierte Evaluation deiner metakognitiven Reflexionsprozesse"
              )}
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
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-800/30 text-sm">
                  {settings.feedbackDepth === 'basic' ? (
                    // Einfache Empfehlungen
                    <>
                      {reflectionStats.avgDepth < 5 && <p className="mb-2">Gehe mehr in die Tiefe deiner Themen.</p>}
                      {reflectionStats.avgCoherence < 5 && <p className="mb-2">Strukturiere deine Gedanken besser.</p>}
                      {reflectionStats.avgMetacognition < 5 && <p className="mb-2">Denke mehr über dein eigenes Denken nach.</p>}
                      {reflectionStats.avgDepth >= 5 && reflectionStats.avgCoherence >= 5 && reflectionStats.avgMetacognition >= 5 && 
                        <p>Du machst das schon gut! Weiter so.</p>}
                    </>
                  ) : settings.feedbackDepth === 'detailed' ? (
                    // Detaillierte Empfehlungen
                    <>
                      {reflectionStats.avgDepth < 5 && (
                        <p className="mb-2">Deine Reflexionen könnten von einer tiefergehenden Analyse profitieren. Versuche, mehrere Ebenen eines Themas zu untersuchen, verschiedene theoretische Perspektiven einzubeziehen und die Verbindungen zwischen oberflächlichen Beobachtungen und tieferliegenden Prinzipien zu artikulieren.</p>
                      )}
                      {reflectionStats.avgCoherence < 5 && (
                        <p className="mb-2">Die strukturelle Kohärenz deiner Reflexionen könnte verbessert werden. Achte auf klar definierte Einleitungen, die den Reflexionskontext etablieren, eine logische Progression von Gedanken im Hauptteil und synthetisierende Schlussfolgerungen, die die wichtigsten Erkenntnisse integrieren.</p>
                      )}
                      {reflectionStats.avgMetacognition < 5 && (
                        <p className="mb-2">Deine metakognitiven Prozesse könnten stärker in deine Reflexionen integriert werden. Analysiere bewusst, wie deine Vorannahmen, mentalen Modelle und epistemologischen Überzeugungen deine Interpretation von Erfahrungen beeinflussen, und dokumentiere Veränderungen in deinem Denken über Zeit.</p>
                      )}
                      {reflectionStats.avgDepth >= 5 && reflectionStats.avgCoherence >= 5 && reflectionStats.avgMetacognition >= 5 && (
                        <p>Deine Reflexionen zeigen bereits eine beachtliche Qualität in mehreren Dimensionen. Zur weiteren Verfeinerung könntest du dich auf die Integration verschiedener theoretischer Rahmenwerke konzentrieren und systematischer die Wechselwirkungen zwischen deinen persönlichen Erfahrungen und breiteren konzeptuellen Strukturen herausarbeiten.</p>
                      )}
                    </>
                  ) : (
                    // Standard Empfehlungen (wie zuvor)
                    <>
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
                    </>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <Link href="/analytics">
                      <BarChart4 className="h-4 w-4" />
                      <span>Zur detaillierten Analyse</span>
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Reflections */}
      <Card>
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
    </div>
  )
} 