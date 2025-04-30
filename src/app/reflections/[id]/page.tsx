"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Brain, PieChart, Sparkles, Target, TrendingUp, Calendar, Clock, Edit, Trash2, FileText, Info, AlertTriangle, Loader2, Share2, Download, Printer, Lightbulb, MessageCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import React from "react"
import { useToast } from "@/components/ui/use-toast"
import ReflectionDashboard from "@/components/ReflectionDashboard"
import { useUserSettings } from "@/hooks/useUserSettings"
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
    <div className="container-fluid px-4 py-6 mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="mb-4 flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <Button variant="ghost" asChild className="mb-3 -ml-4 hover:bg-accent/50">
            <Link href="/reflections">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Alle Reflexionen
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{reflection.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(reflection.created_at).toLocaleDateString('de-DE')}
            </div>
            {reflection.category && (
              <Badge variant="outline" className="px-3 py-1 text-xs">{reflection.category}</Badge>
            )}
            {reflection.is_public && (
              <Badge className="px-3 py-1 text-xs">Öffentlich</Badge>
            )}
            {reflection.analyzed_at && (
              <Badge variant="secondary" className={`px-3 py-1 text-xs ${getReflectionLevelColor()}`}>
                <Brain className="h-3 w-3 mr-1" />
                {reflection.reflection_level || getReflectionLevelName()}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
          {needsAnalysis() && (
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-1 hover:bg-accent/50"
              onClick={analyzeReflection}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analysiere...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  KI-Analyse
                </>
              )}
            </Button>
          )}
          
          {reflection.analyzed_at && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 hover:bg-accent/50"
              onClick={analyzeReflection}
              disabled={analyzing}
            >
              <RefreshCw className="h-4 w-4" />
              Neu analysieren
            </Button>
          )}
          
          <Button variant="outline" size="sm" className="gap-1 hover:bg-accent/50" asChild>
            <Link href={`/reflections/${reflection.id}/edit`}>
              <Edit className="h-4 w-4" />
              Bearbeiten
            </Link>
          </Button>
          
          <Button variant="outline" size="sm" className="gap-1" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Drucken
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
                Löschen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reflexion löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bist du sicher, dass du diese Reflexion löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete} 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Wird gelöscht..." : "Löschen"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="content" className="gap-2">
            <FileText className="h-4 w-4" />
            Inhalt
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <Brain className="h-4 w-4" />
            KI-Analyse
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <Card className="shadow-sm border-border/60 overflow-hidden mb-4">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Reflexionsinhalt
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                {reflection.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < paragraph.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex flex-col space-y-6 w-full xl:w-3/5">
              <Card className="shadow-sm border-border/60">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    KI-Feedback
                  </CardTitle>
                  <CardDescription>
                    Analyse deiner Reflexion
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {reflection.ai_feedback ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{reflection.ai_feedback}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Info className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Keine KI-Analyse verfügbar. Klicke auf "KI-Analyse", um deine Reflexion zu analysieren.</p>
                      <Button 
                        onClick={analyzeReflection} 
                        disabled={analyzing} 
                        className="mt-4"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Analysiere...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            Jetzt analysieren
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {reflection.ai_insights && reflection.ai_insights.length > 0 && (
                <Card className="shadow-sm border-border/60">
                  <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Erkenntnisse & Einsichten
                    </CardTitle>
                    <CardDescription>
                      Wichtige Punkte aus deiner Reflexion
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {reflection.ai_insights.map((insight, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            {index + 1}
                          </div>
                          <p>{insight}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="w-full xl:w-2/5">
              <div className="h-full">
                <ReflectionKPIDashboard 
                  reflection={reflection} 
                  feedbackDepth={(settings?.feedbackDepth as 'basic' | 'standard' | 'detailed') || 'standard'} 
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 