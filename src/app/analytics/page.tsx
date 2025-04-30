"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart4, Brain, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp, Calendar, Target, AlertTriangle, Sparkles, ArrowRight } from "lucide-react"
import RequireAuth from "@/components/RequireAuth"
import Link from "next/link"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart as RePieChart, Pie, Cell, LineChart, Line } from "recharts"

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
  
  if (loading) {
    return (
      <RequireAuth>
        <div className="container py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-56 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-80 col-span-2" />
            <Skeleton className="h-80" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </RequireAuth>
    )
  }
  
  if (error) {
    return (
      <RequireAuth>
        <div className="container py-8">
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>
              {error}. Bitte versuche es später erneut.
            </AlertDescription>
          </Alert>
          <Button onClick={fetchAnalytics}>Erneut versuchen</Button>
        </div>
      </RequireAuth>
    )
  }
  
  if (!analytics || analytics.totalReflections === 0) {
    return (
      <RequireAuth>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">Reflexionsanalyse</h1>
          <p className="text-muted-foreground mb-8">
            Visualisiere und analysiere deine Reflexionsdaten
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Keine Daten verfügbar</CardTitle>
              <CardDescription>
                Es wurden noch keine Reflexionen gefunden, die analysiert werden können.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Erstelle und analysiere Reflexionen, um detaillierte Statistiken und Trends zu sehen.
              </p>
              <Button asChild>
                <Link href="/reflections/new">
                  Erste Reflexion erstellen
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </RequireAuth>
    )
  }
  
  return (
    <RequireAuth>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reflexionsanalyse</h1>
            <p className="text-muted-foreground">
              Detaillierte Analyse deiner {analytics.totalReflections} Reflexionen
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Zeitraum wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Zeit</SelectItem>
                <SelectItem value="week">Letzte Woche</SelectItem>
                <SelectItem value="month">Letzter Monat</SelectItem>
                <SelectItem value="year">Letztes Jahr</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={fetchAnalytics}>
              Aktualisieren
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="kpis">KPI-Metriken</TabsTrigger>
            <TabsTrigger value="trends">Trends & Entwicklung</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* KPI Score Card */}
              <Card className="shadow-md md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-primary" />
                    KPI-Übersicht
                  </CardTitle>
                  <CardDescription>
                    Durchschnittliche NLP-basierte Bewertungen deiner Reflexionen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Tiefe",
                            value: analytics.avgMetrics.depth,
                            color: "#3b82f6",
                            max: 10
                          },
                          {
                            name: "Kohärenz",
                            value: analytics.avgMetrics.coherence,
                            color: "#f59e0b",
                            max: 10
                          },
                          {
                            name: "Metakognition",
                            value: analytics.avgMetrics.metacognition,
                            color: "#8b5cf6",
                            max: 10
                          },
                          {
                            name: "Handlungsorientierung",
                            value: analytics.avgMetrics.actionable,
                            color: "#10b981",
                            max: 10
                          }
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip 
                          formatter={(value) => [`${value}/10`, "Punktzahl"]}
                        />
                        <Bar dataKey="value" name="Punktzahl">
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg bg-muted/30">
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        Stärken
                      </h4>
                      <ul className="text-sm space-y-1">
                        {analytics.topStrengths.length > 0 ? (
                          analytics.topStrengths.map((strength, i) => (
                            <li key={i} className="text-muted-foreground">• {strength}</li>
                          ))
                        ) : (
                          <li className="text-muted-foreground">Keine besonderen Stärken identifiziert</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="p-3 border rounded-lg bg-muted/30">
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Target className="h-4 w-4 text-amber-500" />
                        Verbesserungspotenzial
                      </h4>
                      <ul className="text-sm space-y-1">
                        {analytics.improvementAreas.length > 0 ? (
                          analytics.improvementAreas.map((area, i) => (
                            <li key={i} className="text-muted-foreground">• {area}</li>
                          ))
                        ) : (
                          <li className="text-muted-foreground">Keine spezifischen Verbesserungsbereiche identifiziert</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Reflection Level Distribution */}
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Reflexionsebenen
                  </CardTitle>
                  <CardDescription>
                    Verteilung nach Moon&apos;s Reflexionsmodell
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analytics.reflectionLevelDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name} (${(percent * 100).toFixed(0)}%)`
                          }
                          labelLine={false}
                        >
                          {analytics.reflectionLevelDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={REFLECTION_LEVEL_COLORS[index % REFLECTION_LEVEL_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} Reflexionen`, ""]}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-center text-sm text-muted-foreground">
                      Durchschnittliche Bewertung: <span className="font-medium">{analytics.avgMetrics.overall}/10</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Kategorien
                  </CardTitle>
                  <CardDescription>
                    Verteilung der Reflexionen nach Kategorien
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analytics.categoryDistribution.slice(0, 5)}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name} (${(percent * 100).toFixed(0)}%)`
                          }
                        >
                          {analytics.categoryDistribution.slice(0, 5).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} Reflexionen`, ""]}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Reflection Count Trend */}
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-primary" />
                    Reflexionsaktivität
                  </CardTitle>
                  <CardDescription>
                    Anzahl der Reflexionen im Zeitverlauf
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analytics.reflectionsOverTime}
                        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          interval="preserveEnd"
                        />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="count"
                          name="Reflexionen"
                          stroke="#3b82f6"
                          fill="#3b82f680"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="kpis">
            <Card className="shadow-md mb-8">
              <CardHeader>
                <CardTitle>KPI-Entwicklung im Zeitverlauf</CardTitle>
                <CardDescription>
                  Verbesserung deiner Reflexionsmetriken über die Zeit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.kpiOverTime}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="depth"
                        name="Tiefe"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="coherence"
                        name="Kohärenz"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="metacognition"
                        name="Metakognition"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="actionable"
                        name="Handlungsorientierung"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="average"
                        name="Durchschnitt"
                        stroke="#475569"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <p>Die Visualisierung zeigt die durchschnittlichen KPI-Werte pro Woche basierend auf NLP-Analysen.</p>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Vergleich zu Bildungsstandards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Durchschnittlicher KPI-Wert</span>
                        <span className="font-medium">{analytics.avgMetrics.overall}/10</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${analytics.avgMetrics.overall * 10}%` }} 
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                        <span>Anfänger</span>
                        <span>Fortgeschritten</span>
                        <span>Experte</span>
                      </div>
                    </div>
                    
                    {/* KPI interpretations */}
                    <div className="p-3 border rounded-lg bg-muted/30">
                      <h4 className="text-sm font-medium mb-2">NLP-Analyse Interpretation</h4>
                      {analytics.avgMetrics.overall < 5 && (
                        <p className="text-sm text-muted-foreground">
                          Deine Reflexionen zeigen grundlegende deskriptive Elemente. Versuche, tiefer in die Analyse zu gehen und deine eigenen Denkmuster zu hinterfragen.
                        </p>
                      )}
                      {analytics.avgMetrics.overall >= 5 && analytics.avgMetrics.overall < 7 && (
                        <p className="text-sm text-muted-foreground">
                          Deine Reflexionen zeigen eine gute analytische Qualität. Du beginnst, Ursachen und Zusammenhänge zu erkennen und zu verstehen.
                        </p>
                      )}
                      {analytics.avgMetrics.overall >= 7 && (
                        <p className="text-sm text-muted-foreground">
                          Deine Reflexionen zeigen ein hohes kritisches Niveau. Du betrachtest Situationen aus verschiedenen Perspektiven und verknüpfst Erkenntnisse mit breiteren Kontexten.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    NLP-basierte Empfehlungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30">
                      <h4 className="text-sm font-medium mb-2 text-blue-700 dark:text-blue-300">Empfehlungen zur Verbesserung</h4>
                      <ul className="text-sm space-y-2">
                        {analytics.avgMetrics.depth < 6 && (
                          <li className="text-muted-foreground">
                            <span className="font-medium text-blue-600 dark:text-blue-400">Reflexionstiefe:</span> Versuche, tiefer in deine Erfahrungen einzutauchen und verschiedene Aspekte zu analysieren.
                          </li>
                        )}
                        {analytics.avgMetrics.coherence < 6 && (
                          <li className="text-muted-foreground">
                            <span className="font-medium text-amber-600 dark:text-amber-400">Kohärenz:</span> Achte auf eine klare Struktur und logische Verbindungen zwischen deinen Gedanken.
                          </li>
                        )}
                        {analytics.avgMetrics.metacognition < 6 && (
                          <li className="text-muted-foreground">
                            <span className="font-medium text-purple-600 dark:text-purple-400">Metakognition:</span> Reflektiere bewusster über deine eigenen Denk- und Lernprozesse.
                          </li>
                        )}
                        {analytics.avgMetrics.actionable < 6 && (
                          <li className="text-muted-foreground">
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">Handlungsorientierung:</span> Leite konkrete nächste Schritte und Aktionen aus deinen Erkenntnissen ab.
                          </li>
                        )}
                        {(analytics.avgMetrics.depth >= 6 && analytics.avgMetrics.coherence >= 6 && 
                          analytics.avgMetrics.metacognition >= 6 && analytics.avgMetrics.actionable >= 6) && (
                          <li className="text-muted-foreground">
                            Deine Reflexionen zeigen bereits eine gute Qualität in allen Bereichen. Versuche, dieses Niveau zu halten und weiter zu verfeinern.
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/resources/reflection-theory">
                        Mehr über Reflexionstheorie lernen
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <Card className="shadow-md mb-8">
              <CardHeader>
                <CardTitle>Langzeitentwicklung deiner Reflexionsfähigkeiten</CardTitle>
                <CardDescription>
                  Analyse deiner Fortschritte über Zeit basierend auf NLP-Metriken
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analytics.kpiOverTime}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="average"
                        name="Durchschnitt aller KPIs"
                        stroke="#475569"
                        fill="#47556960"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Aktivitätsverteilung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.reflectionsOverTime}
                        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" name="Reflexionen" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Fortschrittsanalyse</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Overall progress calculation based on trends */}
                    {(() => {
                      // Calculate progress trend
                      let trend = 0;
                      if (analytics.kpiOverTime.length >= 2) {
                        const firstAvg = analytics.kpiOverTime[0].average;
                        const lastAvg = analytics.kpiOverTime[analytics.kpiOverTime.length - 1].average;
                        trend = lastAvg - firstAvg;
                      }
                      
                      return (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Gesamtfortschritt</h4>
                          <div className="p-3 border rounded-lg bg-muted/30">
                            {trend > 0.5 && (
                              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                <TrendingUp className="h-4 w-4 inline-block mr-1" />
                                Positive Entwicklung: Deine Reflexionsqualität hat sich um {trend.toFixed(1)} Punkte verbessert.
                              </p>
                            )}
                            {trend < -0.5 && (
                              <p className="text-sm text-amber-600 dark:text-amber-400">
                                <TrendingUp className="h-4 w-4 inline-block mr-1 rotate-180" />
                                Rückläufige Entwicklung: Deine Reflexionsqualität hat um {Math.abs(trend).toFixed(1)} Punkte abgenommen.
                              </p>
                            )}
                            {trend >= -0.5 && trend <= 0.5 && (
                              <p className="text-sm text-muted-foreground">
                                <TrendingUp className="h-4 w-4 inline-block mr-1 rotate-90" />
                                Stabile Entwicklung: Deine Reflexionsqualität ist konstant geblieben.
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Nächste Schritte</h4>
                      <div className="p-3 border rounded-lg bg-muted/30">
                        <ul className="text-sm space-y-1">
                          <li className="text-muted-foreground">
                            • Erstelle regelmäßige Reflexionen für konsistentes Feedback
                          </li>
                          <li className="text-muted-foreground">
                            • Fokussiere auf Verbesserung in deinen identifizierten Schwachbereichen
                          </li>
                          <li className="text-muted-foreground">
                            • Nutze die NLP-Analysen für konkrete Verbesserungsvorschläge
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  )
} 