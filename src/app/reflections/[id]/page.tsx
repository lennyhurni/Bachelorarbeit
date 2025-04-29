"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClientBrowser } from "@/utils/supabase/client"
import RequireAuth from "@/components/RequireAuth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Brain, PieChart, Sparkles, Target, TrendingUp, Calendar, Clock, Edit, Trash2, FileText, Info } from "lucide-react"
import Link from "next/link"
import React from "react"

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
  user_id: string
}

export default function ReflectionDetailPage() {
  const [reflection, setReflection] = useState<Reflection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const supabase = createClientBrowser()
  
  useEffect(() => {
    async function loadReflection() {
      try {
        setLoading(true)
        setError(null)
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          router.push('/login')
          return
        }
        
        // Get reflection by ID
        const { data, error } = await supabase
          .from('reflections')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (error) {
          console.error('Error fetching reflection:', error)
          setError('Die Reflexion konnte nicht geladen werden.')
          return
        }
        
        // Check if user has permission to view this reflection
        if (data.user_id !== session.user.id && !data.is_public) {
          setError('Sie haben keine Berechtigung, diese Reflexion anzusehen.')
          return
        }
        
        setReflection(data)
      } catch (error) {
        console.error('Error loading reflection:', error)
        setError('Ein unerwarteter Fehler ist aufgetreten.')
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id) {
      loadReflection()
    }
  }, [params.id, router, supabase])
  
  const calculateAvgScore = () => {
    if (!reflection) return 0
    return Math.round((reflection.kpi_depth + reflection.kpi_coherence + reflection.kpi_metacognition + reflection.kpi_actionable) / 4)
  }
  
  if (loading) {
    return (
      <RequireAuth>
        <div className="container py-8 max-w-4xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </RequireAuth>
    )
  }
  
  if (error || !reflection) {
    return (
      <RequireAuth>
        <div className="container py-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Fehler</CardTitle>
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
      </RequireAuth>
    )
  }
  
  const avgScore = calculateAvgScore()
  
  return (
    <RequireAuth>
      <div className="container py-8 max-w-4xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="mb-8 flex flex-col md:flex-row items-start justify-between gap-4">
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
            </div>
          </div>
          
          <div className="flex gap-2 mt-3 md:mt-0">
            <Button variant="outline" size="sm" className="gap-1 hover:bg-accent/50">
              <Edit className="h-4 w-4" />
              Bearbeiten
            </Button>
            <Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
              Löschen
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="shadow-sm border-border/60 overflow-hidden">
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
          </div>
          
          <div className="space-y-6">
            <Card className="shadow-sm border-border/60 overflow-hidden">
              <CardHeader className="pb-2 bg-muted/30 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-primary" />
                  KPI-Bewertung
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                        Reflexionstiefe
                      </span>
                      <span className="font-bold">{reflection.kpi_depth}/10</span>
                    </div>
                    <Progress value={reflection.kpi_depth * 10} className="h-2 bg-blue-100 dark:bg-blue-950/50" 
                      style={{color: 'rgb(59, 130, 246)'}} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                        Kohärenz
                      </span>
                      <span className="font-bold">{reflection.kpi_coherence}/10</span>
                    </div>
                    <Progress value={reflection.kpi_coherence * 10} className="h-2 bg-amber-100 dark:bg-amber-950/50"
                      style={{color: 'rgb(245, 158, 11)'}} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium flex items-center gap-1">
                        <Brain className="h-3.5 w-3.5 text-purple-500" />
                        Metakognition
                      </span>
                      <span className="font-bold">{reflection.kpi_metacognition}/10</span>
                    </div>
                    <Progress value={reflection.kpi_metacognition * 10} className="h-2 bg-purple-100 dark:bg-purple-950/50"
                      style={{color: 'rgb(139, 92, 246)'}} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium flex items-center gap-1">
                        <Target className="h-3.5 w-3.5 text-emerald-500" />
                        Handlungsorientierung
                      </span>
                      <span className="font-bold">{reflection.kpi_actionable}/10</span>
                    </div>
                    <Progress value={reflection.kpi_actionable * 10} className="h-2 bg-emerald-100 dark:bg-emerald-950/50"
                      style={{color: 'rgb(16, 185, 129)'}} />
                  </div>
                  
                  <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <PieChart className="h-3.5 w-3.5 text-primary" />
                      Gesamtbewertung
                    </span>
                    <span className="text-xl font-bold">{avgScore}/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-border/60 overflow-hidden">
              <CardHeader className="pb-2 bg-muted/30 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Metadaten
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Erstellt am</span>
                    <span className="font-medium">{new Date(reflection.created_at).toLocaleDateString('de-DE')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Kategorie</span>
                    <span className="font-medium">{reflection.category || 'Keine'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium">{reflection.is_public ? 'Öffentlich' : 'Privat'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
} 