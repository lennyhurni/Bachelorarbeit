"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart4, Brain, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp, Calendar, Target, AlertTriangle, Sparkles, ArrowRight, HelpCircle, Info, Plus } from "lucide-react"
import RequireAuth from "@/components/RequireAuth"
import Link from "next/link"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart as RePieChart, Pie, Cell, LineChart, Line } from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUserSettings } from "@/hooks/useUserSettings"
import { 
  SubTabs, 
  MainTabsList, 
  MainTabTrigger, 
  MainTabContent,
  SubTabsList, 
  SubTabTrigger, 
  SubTabContent 
} from "@/components/ui/nested-tabs"

interface Reflection {
  id: string
  title: string
  created_at: string
  category: string
  kpi_depth: number
  kpi_coherence: number
  kpi_metacognition: number
  kpi_actionable: number
  analyzed_at?: string
}

interface KpiOverTime {
  date: string
  depth: number
  coherence: number
  metacognition: number
  actionable: number
  average: number
}

interface ReflectionAnalytics {
  totalReflections: number
  reflectionsOverTime: {
    date: string
    count: number
  }[]
  kpiOverTime: KpiOverTime[]
  categoryDistribution: {
    name: string
    value: number
  }[]
  reflectionLevelDistribution: {
    name: string
    value: number
  }[]
  avgMetrics: {
    depth: number
    coherence: number
    metacognition: number
    actionable: number
    overall: number
  }
  topStrengths: string[]
  improvementAreas: string[]
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<ReflectionAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("all")
  const router = useRouter()
  const { settings } = useUserSettings()
  
  // Colors for charts
  const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981']
  const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899']
  const REFLECTION_LEVEL_COLORS = ['#60a5fa', '#fbbf24', '#34d399']
  
  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])
  
  async function fetchAnalytics() {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch reflections and calculate analytics
      const response = await fetch(`/api/reflections?limit=100`)
      
      if (!response.ok) {
        throw new Error(`Error fetching reflections: ${response.status}`)
      }
      
      const data = await response.json()
      const reflections: Reflection[] = data.reflections || []
      
      // Process the data to create analytics
      const processedAnalytics = processReflectionData(reflections, timeRange)
      setAnalytics(processedAnalytics)
      
    } catch (err: any) {
      console.error("Failed to fetch analytics data:", err)
      setError(err.message || "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }
  
  function processReflectionData(reflections: Reflection[], timeRange: string): ReflectionAnalytics {
    // Filter by time range if needed
    let filteredReflections = [...reflections]
    
    if (timeRange !== "all") {
      const now = new Date()
      const cutoffDate = new Date()
      
      if (timeRange === "week") {
        cutoffDate.setDate(now.getDate() - 7)
      } else if (timeRange === "month") {
        cutoffDate.setMonth(now.getMonth() - 1)
      } else if (timeRange === "year") {
        cutoffDate.setFullYear(now.getFullYear() - 1)
      }
      
      filteredReflections = reflections.filter(r => new Date(r.created_at) >= cutoffDate)
    }
    
    // Sort reflections by date (oldest first)
    filteredReflections.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    
    // Total count
    const totalReflections = filteredReflections.length
    
    // Calculate reflections over time
    const reflectionsOverTime = calculateReflectionsOverTime(filteredReflections)
    
    // Calculate KPIs over time
    const kpiOverTime = calculateKpiOverTime(filteredReflections)
    
    // Category distribution
    const categoryDistribution = calculateCategoryDistribution(filteredReflections)
    
    // Reflection level distribution (descriptive, analytical, critical)
    const reflectionLevelDistribution = calculateReflectionLevelDistribution(filteredReflections)
    
    // Average metrics
    const avgMetrics = calculateAverageMetrics(filteredReflections)
    
    // Identify top strengths and improvement areas
    const { topStrengths, improvementAreas } = identifyStrengthsAndWeaknesses(avgMetrics)
    
    return {
      totalReflections,
      reflectionsOverTime,
      kpiOverTime,
      categoryDistribution,
      reflectionLevelDistribution,
      avgMetrics,
      topStrengths,
      improvementAreas
    }
  }
  
  function calculateReflectionsOverTime(reflections: Reflection[]) {
    // Group reflections by date
    const dateGroups: Record<string, number> = {}
    
    reflections.forEach(reflection => {
      const date = new Date(reflection.created_at).toISOString().split('T')[0]
      dateGroups[date] = (dateGroups[date] || 0) + 1
    })
    
    // Convert to array for chart
    return Object.entries(dateGroups).map(([date, count]) => ({
      date: formatDate(date),
      count
    }))
  }
  
  function calculateKpiOverTime(reflections: Reflection[]): KpiOverTime[] {
    if (reflections.length === 0) return []
    
    // Group reflections by week
    const weekGroups: Record<string, Reflection[]> = {}
    
    reflections.forEach(reflection => {
      const date = new Date(reflection.created_at)
      // Get start of week (Sunday)
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      const weekKey = startOfWeek.toISOString().split('T')[0]
      
      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = []
      }
      
      weekGroups[weekKey].push(reflection)
    })
    
    // Calculate average KPIs for each week
    return Object.entries(weekGroups).map(([weekStart, weekReflections]) => {
      let totalDepth = 0, totalCoherence = 0, totalMetacognition = 0, totalActionable = 0
      
      weekReflections.forEach(r => {
        totalDepth += r.kpi_depth || 0
        totalCoherence += r.kpi_coherence || 0
        totalMetacognition += r.kpi_metacognition || 0
        totalActionable += r.kpi_actionable || 0
      })
      
      const count = weekReflections.length
      const depth = count > 0 ? Number((totalDepth / count).toFixed(1)) : 0
      const coherence = count > 0 ? Number((totalCoherence / count).toFixed(1)) : 0
      const metacognition = count > 0 ? Number((totalMetacognition / count).toFixed(1)) : 0
      const actionable = count > 0 ? Number((totalActionable / count).toFixed(1)) : 0
      const average = count > 0 ? Number(((depth + coherence + metacognition + actionable) / 4).toFixed(1)) : 0
      
      return {
        date: formatDate(weekStart),
        depth,
        coherence,
        metacognition,
        actionable,
        average
      }
    })
  }
  
  function calculateCategoryDistribution(reflections: Reflection[]) {
    const categories: Record<string, number> = {}
    
    reflections.forEach(reflection => {
      if (reflection.category) {
        categories[reflection.category] = (categories[reflection.category] || 0) + 1
      } else {
        categories["Keine Kategorie"] = (categories["Keine Kategorie"] || 0) + 1
      }
    })
    
    // Convert to array for chart
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }
  
  function calculateReflectionLevelDistribution(reflections: Reflection[]) {
    let descriptive = 0, analytical = 0, critical = 0
    
    reflections.forEach(reflection => {
      const avgScore = (
        (reflection.kpi_depth || 0) + 
        (reflection.kpi_coherence || 0) + 
        (reflection.kpi_metacognition || 0) + 
        (reflection.kpi_actionable || 0)
      ) / 4
      
      if (avgScore >= 8) {
        critical++
      } else if (avgScore >= 6) {
        analytical++
      } else {
        descriptive++
      }
    })
    
    return [
      { name: "Beschreibend", value: descriptive },
      { name: "Analytisch", value: analytical },
      { name: "Kritisch", value: critical }
    ]
  }
  
  function calculateAverageMetrics(reflections: Reflection[]) {
    if (reflections.length === 0) {
      return {
        depth: 0,
        coherence: 0,
        metacognition: 0,
        actionable: 0,
        overall: 0
      }
    }
    
    let totalDepth = 0, totalCoherence = 0, totalMetacognition = 0, totalActionable = 0
    
    reflections.forEach(reflection => {
      totalDepth += reflection.kpi_depth || 0
      totalCoherence += reflection.kpi_coherence || 0
      totalMetacognition += reflection.kpi_metacognition || 0
      totalActionable += reflection.kpi_actionable || 0
    })
    
    const count = reflections.length
    const depth = Number((totalDepth / count).toFixed(1))
    const coherence = Number((totalCoherence / count).toFixed(1))
    const metacognition = Number((totalMetacognition / count).toFixed(1))
    const actionable = Number((totalActionable / count).toFixed(1))
    const overall = Number(((depth + coherence + metacognition + actionable) / 4).toFixed(1))
    
    return {
      depth,
      coherence,
      metacognition,
      actionable,
      overall
    }
  }
  
  function identifyStrengthsAndWeaknesses(metrics: { depth: number, coherence: number, metacognition: number, actionable: number }) {
    const metricsArray = [
      { name: "Reflexionstiefe", value: metrics.depth },
      { name: "Kohärenz", value: metrics.coherence },
      { name: "Metakognition", value: metrics.metacognition },
      { name: "Handlungsorientierung", value: metrics.actionable }
    ].sort((a, b) => b.value - a.value)
    
    const topStrengths = metricsArray
      .filter(m => m.value >= 7)
      .map(m => m.name)
    
    const improvementAreas = metricsArray
      .filter(m => m.value < 6)
      .map(m => m.name)
    
    // Default messages if there are no specific strengths or improvements
    if (topStrengths.length === 0 && Math.max(...metricsArray.map(m => m.value)) >= 5) {
      topStrengths.push(metricsArray[0].name)
    }
    
    if (improvementAreas.length === 0 && Math.min(...metricsArray.map(m => m.value)) < 7) {
      improvementAreas.push(metricsArray[metricsArray.length - 1].name)
    }
    
    return { topStrengths, improvementAreas }
  }
  
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' }
    return new Date(dateString).toLocaleDateString('de-DE', options)
  }
  
  // Helper function for tooltip content based on feedback depth
  const getTooltipContent = (basic: string, standard: string, detailed: string) => {
    switch (settings?.feedbackDepth || 'standard') {
      case 'basic':
        return basic;
      case 'detailed':
        return detailed;
      case 'standard':
      default:
        return standard;
    }
  }
  
  if (loading) {
    return (
      <RequireAuth>
        <div className="py-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-10 w-56 mb-2" />
              <Skeleton className="h-5 w-80" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </RequireAuth>
    )
  }
  
  if (error) {
    return (
      <RequireAuth>
        <div className="py-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reflexionsanalyse</h1>
              <p className="text-muted-foreground mt-1">Visualisiere und analysiere deine Reflexionsdaten</p>
            </div>
          </div>
          <div className="px-6">
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>
                {error}. Bitte versuche es später erneut.
              </AlertDescription>
            </Alert>
            <Button onClick={fetchAnalytics}>Erneut versuchen</Button>
          </div>
        </div>
      </RequireAuth>
    )
  }
  
  if (!analytics || analytics.totalReflections === 0) {
    return (
      <RequireAuth>
        <div className="py-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reflexionsanalyse</h1>
              <p className="text-muted-foreground mt-1">Visualisiere und analysiere deine Reflexionsdaten</p>
            </div>
            <Button asChild>
              <Link href="/reflections/new">
                <Plus className="h-4 w-4 mr-2" />
                Reflexion erstellen
              </Link>
            </Button>
          </div>
          
          <div className="px-6">
            <Card className="bg-muted/30 border-dashed">
              <CardHeader>
                <CardTitle>Keine Daten verfügbar</CardTitle>
                <CardDescription>
                  Es wurden noch keine Reflexionen gefunden, die analysiert werden können.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <BarChart4 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="mb-6 text-muted-foreground max-w-md mx-auto">
                    Erstelle und analysiere Reflexionen, um detaillierte Statistiken und Trends zu sehen.
                  </p>
                  <Button asChild>
                    <Link href="/reflections/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Erste Reflexion erstellen
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </RequireAuth>
    )
  }
  
  return (
    <RequireAuth>
      <div className="py-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reflexionsanalyse</h1>
            <p className="text-muted-foreground mt-1">Detaillierte Analysen und Trends deiner Reflexionen</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Alle Reflexionen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Reflexionen</SelectItem>
                <SelectItem value="week">Letzte Woche</SelectItem>
                <SelectItem value="month">Letzter Monat</SelectItem>
                <SelectItem value="year">Letztes Jahr</SelectItem>
              </SelectContent>
            </Select>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    {getTooltipContent(
                      "Diese Seite zeigt dir Analysen deiner Reflexionen über Zeit.",
                      "Hier siehst du detaillierte Analysen und Trends deiner Reflexionen über Zeit. Wähle einen Zeitraum aus, um verschiedene Aspekte deiner Reflexionen zu untersuchen.",
                      "Diese analytische Übersicht visualisiert die zeitliche Entwicklung deiner Reflexionsqualität, thematische Verteilungen und metakognitive Muster. Die Daten werden kontinuierlich aktualisiert und können nach verschiedenen Zeiträumen gefiltert werden."
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="px-6">
          {/* KPI Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart4 className="h-4 w-4 text-primary" />
                    <span>Reflexionen</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="end" className="max-w-[280px] text-xs">
                        <p className="text-sm">
                          {getTooltipContent(
                            "Anzahl deiner Reflexionen im gewählten Zeitraum.",
                            "Gesamtanzahl deiner Reflexionen im gewählten Zeitraum.",
                            "Die Gesamtanzahl der erfassten Reflexionseinträge im ausgewählten Zeitfenster, die als Datenbasis für alle dargestellten Analysen dient."
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold">{analytics.totalReflections}</div>
                <p className="text-xs text-muted-foreground">im gewählten Zeitraum</p>
              </CardContent>
            </Card>
        
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChartIcon className="h-4 w-4 text-primary" />
                    <span>Ø Tiefe</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="end" className="max-w-[280px] text-xs">
                        <p className="text-sm">
                          {getTooltipContent(
                            "Wie tief du im Durchschnitt reflektierst.",
                            "Der Durchschnittswert der Reflexionstiefe auf einer Skala von 1-10, der angibt, wie gründlich du Themen untersuchst.",
                            "Dieser Wert repräsentiert die durchschnittliche Tiefe deiner analytischen Betrachtung, die Fähigkeit, über oberflächliche Beobachtungen hinauszugehen und tieferliegende Bedeutungsebenen zu erschließen. Ein höherer Wert deutet auf eine differenziertere Auseinandersetzung mit dem Reflexionsgegenstand hin."
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold">{analytics.avgMetrics.depth}/10</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.avgMetrics.depth < 4 ? 'Ausbaufähig' : analytics.avgMetrics.depth < 7 ? 'Gut' : 'Ausgezeichnet'}
                </p>
              </CardContent>
            </Card>
        
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-primary" />
                    <span>Ø Kohärenz</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="end" className="max-w-[280px] text-xs">
                        <p className="text-sm">
                          {getTooltipContent(
                            "Wie gut deine Gedanken zusammenhängen.",
                            "Der Durchschnittswert der Kohärenz auf einer Skala von 1-10, der angibt, wie logisch und zusammenhängend deine Reflexionen sind.",
                            "Die Kohärenz misst die strukturelle und logische Qualität deiner Reflexionen - wie gut Gedanken aufeinander aufbauen, Argumentationslinien entwickelt werden und ein roter Faden erkennbar ist. Hohe Werte deuten auf eine ausgereifte Fähigkeit hin, komplexe Gedankengänge schlüssig zu artikulieren."
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold">{analytics.avgMetrics.coherence}/10</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.avgMetrics.coherence < 4 ? 'Ausbaufähig' : analytics.avgMetrics.coherence < 7 ? 'Gut' : 'Ausgezeichnet'}
                </p>
              </CardContent>
            </Card>
        
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span>Ø Meta&shy;kognition</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="end" className="max-w-[280px] text-xs">
                        <p className="text-sm">
                          {getTooltipContent(
                            "Wie gut du über dein eigenes Denken nachdenkst.",
                            "Der Durchschnittswert der Metakognition auf einer Skala von 1-10, der angibt, wie bewusst du deine eigenen Denkprozesse reflektierst.",
                            "Metakognition beschreibt deine Fähigkeit, dein eigenes Denken zu beobachten, zu analysieren und zu verstehen. Ein hoher Wert zeigt, dass du regelmäßig kritisch deine eigenen mentalen Modelle, Überzeugungen und Denkprozesse hinterfragst und dir der Faktoren bewusst bist, die deine Perspektiven beeinflussen."
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold">{analytics.avgMetrics.metacognition}/10</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.avgMetrics.metacognition < 4 ? 'Ausbaufähig' : analytics.avgMetrics.metacognition < 7 ? 'Gut' : 'Ausgezeichnet'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Analysen</CardTitle>
              <CardDescription>
                Erkenne Trends und Muster in deinen Reflexionen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubTabs defaultMainTab="metrics" defaultSubTab="overview" className="mb-8">
                <div className="bg-muted/30 w-full p-1.5 rounded-lg mb-6">
                  <MainTabsList className="flex w-full justify-center gap-2">
                    <MainTabTrigger 
                      value="metrics" 
                      className="flex-1 max-w-52 flex items-center gap-2 py-2.5 px-3 rounded-md justify-center data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <LineChartIcon className="h-4 w-4" />
                      <span>Qualitätsmetriken</span>
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="center" className="max-w-[280px] text-xs">
                            <p className="text-sm">
                              {getTooltipContent(
                                "Zeigt, wie sich deine Reflexionsqualität entwickelt hat.",
                                "Diese Grafik zeigt die Entwicklung der verschiedenen Qualitätsmetriken deiner Reflexionen über Zeit.",
                                "Diese Zeitreihenanalyse visualisiert die Entwicklung der vier Hauptdimensionen der Reflexionsqualität in chronologischer Reihenfolge, um Muster, Fortschritte und Bereiche mit Verbesserungspotenzial zu identifizieren."
                              )}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </MainTabTrigger>
                    <MainTabTrigger 
                      value="frequency" 
                      className="flex-1 max-w-40 flex items-center gap-2 py-2.5 px-3 rounded-md justify-center data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <BarChart4 className="h-4 w-4" />
                      <span>Häufigkeit</span>
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="center" className="max-w-[280px] text-xs">
                            <p className="text-sm">
                              {getTooltipContent(
                                "Zeigt, wie oft du reflektierst.",
                                "Diese Grafik zeigt die Anzahl deiner Reflexionen im Zeitverlauf.",
                                "Diese Analyse zeigt die zeitliche Verteilung deiner Reflexionsaktivitäten und hilft, Muster in deiner Reflexionspraxis zu identifizieren, wie regelmäßige Intervalle oder Phasen erhöhter Reflexionstätigkeit."
                              )}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </MainTabTrigger>
                    <MainTabTrigger 
                      value="categories" 
                      className="flex-1 max-w-40 flex items-center gap-2 py-2.5 px-3 rounded-md justify-center data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <PieChartIcon className="h-4 w-4" />
                      <span>Kategorien</span>
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="center" className="max-w-[280px] text-xs">
                            <p className="text-sm">
                              {getTooltipContent(
                                "Zeigt die Verteilung deiner Reflexionsthemen.",
                                "Diese Grafik zeigt die Verteilung deiner Reflexionen nach Kategorien.",
                                "Diese thematische Analyse visualisiert die Verteilung deiner Reflexionen auf verschiedene Kategorien und gibt Aufschluss über deine inhaltlichen Schwerpunkte, mögliche blinde Flecken und thematische Präferenzen."
                              )}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </MainTabTrigger>
                    <MainTabTrigger 
                      value="levels" 
                      className="flex-1 max-w-48 flex items-center gap-2 py-2.5 px-3 rounded-md justify-center data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>Reflexionsebenen</span>
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="center" className="max-w-[280px] text-xs">
                            <p className="text-sm">
                              {getTooltipContent(
                                "Zeigt die Tiefe deiner Reflexionen.",
                                "Diese Grafik zeigt, wie deine Reflexionen auf verschiedene Reflexionsebenen verteilt sind - von beschreibend über analytisch bis kritisch.",
                                "Diese Analyse klassifiziert deine Reflexionen nach kognitiven Komplexitätsebenen - von beschreibenden, faktenfokussierten Reflexionen über analytische Betrachtungen bis hin zu kritisch-evaluativen Reflexionen mit Integration verschiedener Perspektiven und metakognitiver Tiefe."
                              )}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </MainTabTrigger>
                  </MainTabsList>
                </div>
                
                <MainTabContent value="metrics">
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <SubTabTrigger 
                      value="overview" 
                      className="bg-muted/30 min-w-24 flex items-center gap-2 py-2 px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <LineChartIcon className="h-4 w-4" />
                      <span>Übersicht</span>
                    </SubTabTrigger>
                    <SubTabTrigger 
                      value="depth" 
                      className="bg-muted/30 min-w-24 flex items-center gap-2 py-2 px-4 rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      <Target className="h-4 w-4" />
                      <span>Tiefe</span>
                    </SubTabTrigger>
                    <SubTabTrigger 
                      value="coherence" 
                      className="bg-muted/30 min-w-24 flex items-center gap-2 py-2 px-4 rounded-md data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                    >
                      <PieChartIcon className="h-4 w-4" />
                      <span>Kohärenz</span>
                    </SubTabTrigger>
                    <SubTabTrigger 
                      value="metacognition" 
                      className="bg-muted/30 min-w-24 flex items-center gap-2 py-2 px-4 rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                    >
                      <Brain className="h-4 w-4" />
                      <span>Metakognition</span>
                    </SubTabTrigger>
                    <SubTabTrigger 
                      value="actionable" 
                      className="bg-muted/30 min-w-24 flex items-center gap-2 py-2 px-4 rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span>Handlung</span>
                    </SubTabTrigger>
                  </div>
                
                  <SubTabContent value="overview">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.kpiOverTime}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 10]} />
                          <RechartsTooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="depth"
                            name="Tiefe"
                            stroke={COLORS[0]} 
                            activeDot={{ r: 8 }} 
                          />
                          <Line
                            type="monotone"
                            dataKey="coherence"
                            name="Kohärenz"
                            stroke={COLORS[1]} 
                          />
                          <Line
                            type="monotone"
                            dataKey="metacognition"
                            name="Metakognition"
                            stroke={COLORS[2]} 
                          />
                          <Line
                            type="monotone"
                            dataKey="actionable"
                            name="Handlung" 
                            stroke={COLORS[3]} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </SubTabContent>
                  
                  <SubTabContent value="depth">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.kpiOverTime}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 10]} />
                          <RechartsTooltip />
                          <Line
                            type="monotone"
                            dataKey="depth" 
                            name="Reflexionstiefe" 
                            stroke={COLORS[0]} 
                            strokeWidth={2}
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </SubTabContent>
                  
                  <SubTabContent value="coherence">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.kpiOverTime}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 10]} />
                          <RechartsTooltip />
                          <Line 
                            type="monotone" 
                            dataKey="coherence" 
                            name="Kohärenz" 
                            stroke={COLORS[1]} 
                            strokeWidth={2}
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </SubTabContent>
                  
                  <SubTabContent value="metacognition">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.kpiOverTime}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 10]} />
                          <RechartsTooltip />
                          <Line 
                            type="monotone" 
                            dataKey="metacognition" 
                            name="Metakognition" 
                            stroke={COLORS[2]} 
                            strokeWidth={2}
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </SubTabContent>
                
                  <SubTabContent value="actionable">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.kpiOverTime}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 10]} />
                          <RechartsTooltip />
                          <Line 
                            type="monotone"
                            dataKey="actionable" 
                            name="Handlungsorientierung" 
                            stroke={COLORS[3]} 
                            strokeWidth={2}
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </SubTabContent>
                </MainTabContent>
                
                <MainTabContent value="frequency">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.reflectionsOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <RechartsTooltip />
                        <Bar dataKey="count" name="Anzahl" fill={COLORS[0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </MainTabContent>
                
                <MainTabContent value="categories">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analytics.categoryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analytics.categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </MainTabContent>
                
                <MainTabContent value="levels">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analytics.reflectionLevelDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analytics.reflectionLevelDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={REFLECTION_LEVEL_COLORS[index % REFLECTION_LEVEL_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </MainTabContent>
              </SubTabs>
            </CardContent>
          </Card>
          
          {/* Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Stärken
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="max-w-[280px] text-xs">
                        <p className="text-sm">
                          {getTooltipContent(
                            "Deine größten Stärken beim Reflektieren.",
                            "Basierend auf der Analyse deiner Reflexionen wurden diese Bereiche als deine Stärken identifiziert.",
                            "Diese KI-identifizierten Stärken basieren auf einer vergleichenden Analyse deiner Reflexionsmetriken, wobei Bereiche mit überdurchschnittlicher Leistung und konsistenten Qualitätsmustern hervorgehoben werden."
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analytics.topStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-5 w-5 mt-0.5 flex-shrink-0 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center">
                        <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">{index + 1}</span>
                      </div>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-600" />
                  Verbesserungspotenzial
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs cursor-help">?</div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="max-w-[280px] text-xs">
                        <p className="text-sm">
                          {getTooltipContent(
                            "Bereiche zum Verbessern deiner Reflexionen.",
                            "Basierend auf der Analyse deiner Reflexionen wurden diese Bereiche mit Verbesserungspotenzial identifiziert.",
                            "Diese Entwicklungsbereiche wurden durch die algorithmische Analyse deiner Reflexionsmuster identifiziert, wobei relative Schwächen, Inkonsistenzen oder unterdurchschnittliche Aspekte im Vergleich zu deinen anderen Reflexionskompetenzen hervorgehoben werden."
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analytics.improvementAreas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-5 w-5 mt-0.5 flex-shrink-0 rounded-full bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center">
                        <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">{index + 1}</span>
                      </div>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/reflections/new" className="flex items-center gap-2">
                <span>Neue Reflexion starten</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
} 