"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Brain, PieChart, Sparkles, Target, TrendingUp, Calendar, Clock, Edit, Trash2, FileText, Info, AlertTriangle, Loader2, Share2, Download, Printer, Lightbulb, MessageCircle, RefreshCw, HelpCircle, BarChart4 } from "lucide-react"
import Link from "next/link"
import React from "react"
import { useToast } from "@/components/ui/use-toast"
import ReflectionDashboard from "@/components/ReflectionDashboard"
import { useUserSettings } from "@/hooks/useUserSettings"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import ReflectionKPIDashboard from "@/components/ReflectionKPIDashboard"

interface Reflection {
  id: string
  title: string
  content: string
  created_at: string
  category: string
  is_public: boolean
  kpi_depth: number
  kpi_coherence: number
  kpi_metacognition: number
  kpi_actionable: number
  ai_feedback?: string
  ai_insights?: string[]
  reflection_level?: string
  analyzed_at?: string
}

export default function ReflectionDetailPage() {
  const [reflection, setReflection] = useState<Reflection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { settings } = useUserSettings()
  
  // Load reflection using API
  const fetchReflection = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/reflections/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Diese Reflexion wurde nicht gefunden.')
        } else if (response.status === 401) {
          router.push('/login')
          return
        } else {
          setError('Fehler beim Laden der Reflexion.')
        }
        return
      }
      
      const data = await response.json()
      setReflection(data)
    } catch (error) {
      console.error('Error loading reflection:', error)
      setError('Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }
  
  // Delete reflection
  const handleDelete = async () => {
    try {
      setDeleteLoading(true)
      
      const response = await fetch(`/api/reflections/${params.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Fehler beim Löschen der Reflexion')
      }
      
      toast({
        title: "Reflexion gelöscht",
        description: "Deine Reflexion wurde erfolgreich gelöscht."
      })
      
      router.push('/reflections')
    } catch (error) {
      console.error('Error deleting reflection:', error)
      toast({
        title: "Fehler",
        description: "Die Reflexion konnte nicht gelöscht werden.",
        variant: "destructive"
      })
    } finally {
      setDeleteLoading(false)
    }
  }
  
  // Add the analyzeReflection function
  const analyzeReflection = async () => {
    if (!reflection) return
    
    try {
      setAnalyzing(true)
      
      // Determine which KPIs already have values (greater than 0)
      const existingKpis = {
        hasDepth: reflection.kpi_depth > 0,
        hasCoherence: reflection.kpi_coherence > 0,
        hasMetacognition: reflection.kpi_metacognition > 0,
        hasActionable: reflection.kpi_actionable > 0
      }
      
      const response = await fetch('/api/reflections/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reflectionId: reflection.id,
          content: reflection.content,
          title: reflection.title,
          category: reflection.category,
          // Pass existing KPI information to the API
          preserveKpis: existingKpis
        })
      })
      
      if (!response.ok) {
        throw new Error('Analyse fehlgeschlagen')
      }
      
      const data = await response.json()
      
      // Update the reflection with the analysis results
      // But preserve existing KPI values if they were already set
      setReflection({
        ...reflection,
        ...data.reflection,
        // Preserve existing KPI values when they exist
        kpi_depth: existingKpis.hasDepth ? reflection.kpi_depth : data.reflection.kpi_depth,
        kpi_coherence: existingKpis.hasCoherence ? reflection.kpi_coherence : data.reflection.kpi_coherence,
        kpi_metacognition: existingKpis.hasMetacognition ? reflection.kpi_metacognition : data.reflection.kpi_metacognition,
        kpi_actionable: existingKpis.hasActionable ? reflection.kpi_actionable : data.reflection.kpi_actionable
      })
      
      // Switch to the analysis tab after successful analysis
      setActiveTab("analysis")
      
      toast({
        title: "Analyse aktualisiert",
        description: existingKpis.hasDepth ? 
          "Die KI-Feedback wurde aktualisiert, bestehende Bewertungen wurden beibehalten." : 
          "Deine Reflexion wurde erfolgreich analysiert.",
      })
    } catch (error) {
      console.error('Error analyzing reflection:', error)
      toast({
        title: "Analyse fehlgeschlagen",
        description: "Die Reflexion konnte nicht analysiert werden. Bitte versuche es später erneut.",
        variant: "destructive"
      })
    } finally {
      setAnalyzing(false)
    }
  }
  
  // Print reflection
  const handlePrint = () => {
    window.print()
  }
  
  // Determine if reflection needs analysis
  const needsAnalysis = () => {
    if (!reflection) return false
    return !reflection.analyzed_at || 
           reflection.kpi_depth === 0 || 
           !reflection.ai_feedback || 
           !reflection.ai_insights || 
           reflection.ai_insights.length === 0
  }
  
  useEffect(() => {
    if (params.id) {
      fetchReflection()
    }
  }, [params.id])
  
  const calculateAvgScore = () => {
    if (!reflection) return 0
    return Math.round((reflection.kpi_depth + reflection.kpi_coherence + reflection.kpi_metacognition + reflection.kpi_actionable) / 4)
  }
  
  // Get reflection level name
  const getReflectionLevelName = () => {
    if (!reflection) return "Unbekannt"
    
    const avgScore = calculateAvgScore()
    if (avgScore >= 8) return "Kritisch"
    if (avgScore >= 6) return "Analytisch"
    return "Beschreibend"  
  }
  
  // Get reflection level color
  const getReflectionLevelColor = () => {
    if (!reflection) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    
    const avgScore = calculateAvgScore()
    if (avgScore >= 8) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
    if (avgScore >= 6) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
  }
  
  // Helper function to get tooltip content based on feedback depth
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
      <div className="container py-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }
  
  if (error || !reflection) {
    return (
      <div className="container py-8 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Fehler
            </CardTitle>
            <CardDescription>
              {error || 'Die Reflexion konnte nicht gefunden werden.'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/reflections">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zu allen Reflexionen
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  const avgScore = calculateAvgScore()
  
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/reflections" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Zurück</span>
          </Link>
        </Button>
        <h1 className="font-bold text-2xl ml-2">{reflection.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Reflexionsinhalt</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {getTooltipContent(
                          "Der vollständige Text deiner Reflexion.",
                          "Dieser Abschnitt zeigt den vollständigen Inhalt deiner Reflexion, wie du sie verfasst hast.",
                          "Hier wird der vollständige, unveränderte Text deiner Reflexion dargestellt, der als Ausgangspunkt für die metakognitive Analyse und Bewertung verschiedener Reflexionsqualitäten dient."
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 font-normal">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(reflection.created_at).toLocaleDateString('de-DE', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </Badge>
                <Badge variant="outline" className="gap-1 font-normal">
                  {reflection.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-sm whitespace-pre-wrap">
                {reflection.content}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="h-8">
                    <Link href={`/reflections/${reflection.id}/edit`} className="flex items-center gap-1">
                      <Edit className="h-3.5 w-3.5" />
                      Bearbeiten
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 text-destructive">
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Löschen
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reflexion löschen?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Diese Aktion kann nicht rückgängig gemacht werden. Die Reflexion und alle dazugehörigen Analysen werden dauerhaft gelöscht.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Löschen...
                            </>
                          ) : (
                            <>Löschen</>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8" onClick={handlePrint}>
                    <Printer className="h-3.5 w-3.5 mr-1" />
                    Drucken
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                KI-Analyse
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {getTooltipContent(
                          "Die KI-Analyse deiner Reflexion.",
                          "Hier siehst du die KI-basierte Analyse deiner Reflexion mit Bewertungen und Feedback.",
                          "Dieser Bereich präsentiert die Ergebnisse der KI-gestützten Textanalyse deiner Reflexion, einschließlich quantitativer Bewertungen verschiedener Qualitätsdimensionen sowie qualitativer Erkenntnisse zu Stärken und Verbesserungspotenzialen."
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="pt-4">
              {/* Reflection Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Kategorie</h3>
                      <p className="text-sm">{reflection.category || "Keine Kategorie"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Erstellt am</h3>
                      <p className="text-sm">
                        {new Date(reflection.created_at).toLocaleDateString('de-DE', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {reflection.analyzed_at && (
                      <div>
                        <h3 className="text-sm font-medium mb-1">Analysiert am</h3>
                        <p className="text-sm">
                          {new Date(reflection.analyzed_at).toLocaleDateString('de-DE', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analysis" className="pt-4 space-y-6">
              {needsAnalysis() ? (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="text-center py-6">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Diese Reflexion wurde noch nicht analysiert</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2 mb-6">
                        Klicke auf "Reflexion analysieren", um KI-gestützte Erkenntnisse und Feedback zu erhalten.
                      </p>
                      <Button 
                        onClick={analyzeReflection} 
                        disabled={analyzing}
                        className="gap-2"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Analysiere...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Reflexion analysieren
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* KPI Dashboard */}
                  <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          Reflexionsqualität
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">
                                  {getTooltipContent(
                                    "Bewertung der Qualität deiner Reflexion.",
                                    "Diese Bewertungen zeigen die Qualität deiner Reflexion in verschiedenen Dimensionen wie Tiefe, Kohärenz, Metakognition und Handlungsorientierung.",
                                    "Diese multidimensionale Analyse der Qualität deiner Reflexion basiert auf einer KI-gestützten Textanalyse, die verschiedene Aspekte der Reflexionstiefe, logischen Struktur, metakognitiven Prozesse und Handlungsorientierung bewertet."
                                  )}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </CardTitle>
                        <Badge 
                          className={getReflectionLevelColor()}
                        >
                          {getReflectionLevelName()}
                        </Badge>
                      </div>
                      <CardDescription>
                        {getTooltipContent(
                          "Bewertung deiner Reflexion",
                          "KI-basierte Bewertung der verschiedenen Qualitätsdimensionen deiner Reflexion",
                          "Detaillierte Analyse der verschiedenen Dimensionen deiner Reflexionsqualität auf Basis fortschrittlicher Textanalyse"
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-white dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/30">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {reflection.kpi_depth}/10
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <BarChart4 className="h-3 w-3" />
                            <span>Reflexionstiefe</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">
                                    {getTooltipContent(
                                      "Wie tief du über das Thema nachgedacht hast.",
                                      "Die Reflexionstiefe bewertet, wie gründlich du das Thema untersucht und über oberflächliche Betrachtungen hinausgehst.",
                                      "Die Tiefe deiner Reflexion misst, wie gründlich du das Thema analysierst, inwieweit du verschiedene Perspektiven einbeziehst und ob du über offensichtliche Aspekte hinaus in tiefere Bedeutungsschichten eindringst."
                                    )}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-white dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/30">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {reflection.kpi_coherence}/10
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <PieChart className="h-3 w-3" />
                            <span>Kohärenz</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">
                                    {getTooltipContent(
                                      "Wie gut deine Gedanken zusammenhängen.",
                                      "Kohärenz bewertet, wie logisch strukturiert und zusammenhängend deine Reflexion ist.",
                                      "Diese Metrik bemisst die strukturelle und logische Qualität deiner Reflexion - wie gut deine Gedanken aufeinander aufbauen, wie konsistent deine Argumentation ist und ob ein klarer roter Faden erkennbar ist."
                                    )}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-white dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/30">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {reflection.kpi_metacognition}/10
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Brain className="h-3 w-3" />
                            <span>Metakognition</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">
                                    {getTooltipContent(
                                      "Wie gut du über dein eigenes Denken nachdenkst.",
                                      "Metakognition bewertet, wie bewusst du deine eigenen Denkprozesse und mentalen Modelle reflektierst.",
                                      "Diese Dimension erfasst, wie gut du dein eigenes Denken analysierst, mentale Modelle hinterfragst und dir der Faktoren bewusst bist, die deine Perspektiven beeinflussen."
                                    )}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-white dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/30">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {reflection.kpi_actionable}/10
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Target className="h-3 w-3" />
                            <span>Handlungsorientierung</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">
                                    {getTooltipContent(
                                      "Wie gut du konkrete nächste Schritte ableitest.",
                                      "Handlungsorientierung bewertet, ob du aus deinen Überlegungen praktische Konsequenzen für die Zukunft ziehst.",
                                      "Diese Dimension misst, wie effektiv du aus deinen Erkenntnissen konkrete, umsetzbare Schlussfolgerungen und Handlungsschritte ableitest, die zu messbaren Veränderungen führen können."
                                    )}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-blue-100 dark:border-blue-900/30 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                        <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          KI-Feedback
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">
                                  {getTooltipContent(
                                    "Personalisiertes Feedback zu deiner Reflexion.",
                                    "Dieses Feedback basiert auf der KI-Analyse deiner Reflexion und bietet personalisierte Hinweise zur Verbesserung.",
                                    "Dieses algorithmisch generierte Feedback basiert auf einer detaillierten Analyse der Stärken und Verbesserungspotenziale deiner Reflexion und bietet spezifische Hinweise zur Weiterentwicklung deiner Reflexionspraxis."
                                  )}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </h3>
                        <p className="text-sm whitespace-pre-wrap">
                          {reflection.ai_feedback || "Keine Feedback-Informationen verfügbar."}
                        </p>
                      </div>
                      
                      {/* Reanalyze Button */}
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={analyzeReflection} 
                          disabled={analyzing}
                          className="gap-2"
                        >
                          {analyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Analysiere...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4" />
                              Erneut analysieren
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* AI Insights */}
                  {reflection.ai_insights && reflection.ai_insights.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-primary" />
                          KI-Erkenntnisse
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">
                                  {getTooltipContent(
                                    "Wichtige Erkenntnisse aus deiner Reflexion.",
                                    "Diese Erkenntnisse wurden von der KI aus deiner Reflexion extrahiert und helfen dir, die Hauptpunkte zu identifizieren.",
                                    "Diese algorithmisch identifizierten Kernaussagen repräsentieren die wichtigsten Erkenntnisse und Schlüsselkonzepte aus deiner Reflexion, extrahiert durch semantische Textanalyse."
                                  )}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {reflection.ai_insights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-5 w-5 mt-0.5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs text-primary font-medium">{index + 1}</span>
                              </div>
                              <span className="text-sm">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar with KPI Dashboard */}
        <div className="space-y-6">
          <ReflectionKPIDashboard 
            reflection={reflection} 
            feedbackDepth={(settings?.feedbackDepth || 'standard') as 'basic' | 'standard' | 'detailed'} 
          />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Dein Fortschritt
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {getTooltipContent(
                          "Dein Fortschritt bei der Reflexionsfähigkeit.",
                          "Diese Grafik zeigt deinen Fortschritt bei der Entwicklung deiner Reflexionsfähigkeiten im Vergleich zu deinen früheren Reflexionen.",
                          "Diese Visualisierung stellt die Entwicklung deiner Reflexionskompetenz über Zeit dar, basierend auf aggregierten Daten aus all deinen Reflexionen und deren KI-Analysen."
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/analytics" className="flex items-center justify-center gap-2">
                    <BarChart4 className="h-4 w-4" />
                    <span>Zur detaillierten Analyse</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 