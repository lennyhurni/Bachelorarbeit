"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { 
  FileText, Plus, Search, Calendar, Tag, ArrowUpDown, Filter, PieChart, 
  Sparkles, Brain, Lightbulb, Target, Clock, CheckCircle, TrendingUp, 
  HelpCircle, Settings, Loader2, BarChart, MessageCircle, Layers,
  LayoutGrid, LayoutList, BookOpen, Star, AlertCircle, Trash2
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import RequireAuth from "@/components/RequireAuth"
import { createClient } from "@/utils/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { UserSettings as UserSettingsType } from "@/utils/user-settings"
import { useUserSettings } from "@/hooks/useUserSettings"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "@/contexts/SessionContext"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
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

// Types
interface UserSettings {
  feedbackDepth: string
  theme: string
  language: string
  notifications: boolean
  aiSuggestions: boolean
}

interface UserProfile {
  id: string
  settings?: UserSettingsType
}

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

// Moon's Reflection Levels Badge Component
const ReflectionLevelBadge = ({ level }: { level: string }) => {
  const getLevelColor = () => {
    switch (level) {
      case "Descriptive":
      case "Beschreibend":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "Analytical":
      case "Analytisch":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      case "Critical":
      case "Kritisch":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
  }
  
  const getIcon = () => {
    switch (level) {
      case "Descriptive":
      case "Beschreibend":
        return <FileText className="h-3 w-3 mr-1" />
      case "Analytical":
      case "Analytisch":
        return <Brain className="h-3 w-3 mr-1" />
      case "Critical":
      case "Kritisch":
        return <Lightbulb className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor()}`}>
      {getIcon()}
      {level}
    </span>
  )
}

export default function ReflectionsPage() {
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [reflectionToDelete, setReflectionToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Reflections state
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get session from context
  const { user, loading: sessionLoading } = useSession()
  
  // Use settings hook
  const { settings } = useUserSettings()
  const { toast } = useToast()

  // Fetch reflections using API
  const fetchReflections = async () => {
      try {
        setLoading(true)
      setError(null)
      
      // Build the query URL with parameters
      const queryParams = new URLSearchParams()
      if (selectedCategory !== "all") {
        queryParams.append("category", selectedCategory)
      }
      if (searchQuery) {
        queryParams.append("search", searchQuery)
      }
      queryParams.append("sortBy", sortBy)
      
      // Call the API
      const response = await fetch(`/api/reflections?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Error fetching reflections: ${response.status}`)
        }
        
      const data = await response.json()
      setReflections(data.reflections || [])
      setAvailableCategories(data.categories || [])
    } catch (err: any) {
      console.error("Failed to fetch reflections:", err)
      setError(err.message || "Failed to load reflections")
      toast({
        title: "Error",
        description: "Failed to load reflections. Please try again.",
        variant: "destructive",
      })
      } finally {
        setLoading(false)
      }
    }
    
  // Handle delete reflection
  const handleDeleteReflection = async (id: string) => {
    if (!id) return
    
    try {
      setDeleteLoading(true)
      
      const response = await fetch(`/api/reflections/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Fehler beim Löschen der Reflexion')
      }
      
      toast({
        title: "Reflexion gelöscht",
        description: "Deine Reflexion wurde erfolgreich gelöscht."
      })
      
      // Refresh the reflections list
      fetchReflections()
    } catch (error) {
      console.error('Error deleting reflection:', error)
      toast({
        title: "Fehler",
        description: "Die Reflexion konnte nicht gelöscht werden.",
        variant: "destructive"
      })
    } finally {
      setDeleteLoading(false)
      setReflectionToDelete(null)
    }
  }
  
  // Load reflections initially and when filters change
  useEffect(() => {
    if (!sessionLoading && user) {
      fetchReflections()
    }
  }, [user, sessionLoading, selectedCategory, sortBy, searchQuery])

  // Handle search input with debouncing
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  // Calculate Moon's reflection level based on KPIs
  const getMoonLevel = (reflection: Reflection) => {
    const avgScore = (reflection.kpi_depth + reflection.kpi_coherence + reflection.kpi_metacognition + reflection.kpi_actionable) / 4
    
    if (avgScore >= 8) return "Kritisch"
    if (avgScore >= 6) return "Analytisch"
    return "Beschreibend"
  }
  
  // Calculate average score
  const getAvgScore = (reflection: Reflection) => {
    return Math.round((reflection.kpi_depth + reflection.kpi_coherence + reflection.kpi_metacognition + reflection.kpi_actionable) / 4)
  }
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }
    return new Date(dateString).toLocaleDateString('de-DE', options)
  }
  
  // Get content preview
  const getContentPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }
  
  // Get visual indicator of reflection quality
  const getQualityIndicator = (reflection: Reflection) => {
    const avgScore = getAvgScore(reflection)
    
    if (avgScore >= 8) return "bg-emerald-500"
    if (avgScore >= 6) return "bg-blue-500"
    if (avgScore >= 4) return "bg-amber-500"
    return "bg-red-500"
  }

  // Loading state
  if (sessionLoading || loading) {
    return (
      <div className="py-6 space-y-6">
        <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-56 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="px-6">
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <RequireAuth>
      <div className="py-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meine Reflexionen</h1>
            <p className="text-muted-foreground mt-1">Verwalten und analysieren Sie Ihre Reflexionen</p>
          </div>
          <Button asChild className="sm:w-auto w-full">
              <Link href="/reflections/new" className="gap-2">
                <Plus className="h-4 w-4" />
                Neue Reflexion
              </Link>
            </Button>
        </div>
        
        {/* Advanced Filters */}
        <div className="px-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Reflexionen" 
                className="pl-9" 
                value={searchQuery}
                onChange={handleSearchInput}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <SelectValue placeholder="Alle Kategorien" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  {availableCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Neueste zuerst" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Neueste zuerst</SelectItem>
                  <SelectItem value="date-asc">Älteste zuerst</SelectItem>
                  <SelectItem value="title-asc">Titel (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Titel (Z-A)</SelectItem>
                  <SelectItem value="score-desc">Beste Bewertung</SelectItem>
                  <SelectItem value="score-asc">Niedrigste Bewertung</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="border rounded-md p-0.5 flex">
              <Button 
                  variant={viewMode === "list" ? "default" : "ghost"}
                size="icon" 
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
              >
                  <LayoutList className="h-4 w-4" />
              </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
        <div className="px-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Card layouts */}
        <div className={`px-6 overflow-y-auto`}>
          {reflections.length === 0 ? (
            <div className="bg-muted rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Keine Reflexionen gefunden</h3>
              <p className="text-muted-foreground mb-6">
                Du hast noch keine Reflexionen erstellt oder sie entsprechen nicht den Filterkriterien.
              </p>
                <Button asChild>
                <Link href="/reflections/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Erste Reflexion erstellen
                </Link>
                </Button>
            </div>
          ) : (
            <>
              {viewMode === "list" ? (
                <div className="space-y-4">
                  {reflections.map(reflection => (
                    <Card key={reflection.id} className="overflow-hidden transition-all hover:shadow-md">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-2 md:h-auto bg-primary h-2 md:w-1.5 flex-shrink-0">
                          <div className={`h-full w-full ${getQualityIndicator(reflection)}`}></div>
                        </div>
                        <div className="flex-1 p-4 md:p-6">
                          <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
                            <div className="flex-1">
                              <Link href={`/reflections/${reflection.id}`} className="hover:underline">
                                <h3 className="text-xl font-semibold mb-2">{reflection.title}</h3>
                              </Link>
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <div className="flex items-center text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(reflection.created_at)}
                                </div>
                            {reflection.category && (
                                  <Badge variant="outline" className="px-2 py-0.5 text-xs">{reflection.category}</Badge>
                                )}
                                {reflection.is_public && (
                                  <Badge className="px-2 py-0.5 text-xs">Öffentlich</Badge>
                                )}
                                {reflection.analyzed_at && (
                                  <ReflectionLevelBadge level={reflection.reflection_level || getMoonLevel(reflection)} />
                            )}
                          </div>
                              <p className="text-muted-foreground line-clamp-2 text-sm">
                                {getContentPreview(reflection.content)}
                              </p>
                            </div>
                            
                            <div className="flex flex-row md:flex-col items-center md:items-end gap-3 mt-2 md:mt-0">
                              {reflection.analyzed_at && (
                                <div className="flex items-center gap-2">
                                  <Progress
                                    value={getAvgScore(reflection) * 10}
                                    className="h-2 w-24"
                                    style={{
                                      color: getAvgScore(reflection) >= 8 ? 'rgb(16, 185, 129)' : 
                                            getAvgScore(reflection) >= 6 ? 'rgb(59, 130, 246)' : 
                                            getAvgScore(reflection) >= 4 ? 'rgb(245, 158, 11)' : 
                                            'rgb(239, 68, 68)'
                                    }}
                                  />
                                  <span className="text-sm font-semibold">{getAvgScore(reflection)}/10</span>
                                </div>
                              )}
                              
                              <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/reflections/${reflection.id}`}>
                                    <FileText className="h-4 w-4 mr-1" />
                                    Ansehen
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/reflections/${reflection.id}/edit`}>
                                    <PieChart className="h-4 w-4 mr-1" />
                                    Bearbeiten
                                  </Link>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => setReflectionToDelete(reflection.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reflections.map(reflection => (
                    <Card key={reflection.id} className="overflow-hidden transition-all hover:shadow-md flex flex-col">
                      <div className="h-1.5 w-full bg-primary">
                        <div className={`h-full w-full ${getQualityIndicator(reflection)}`}></div>
                      </div>
                      <CardHeader className="pb-3">
                        <Link href={`/reflections/${reflection.id}`} className="hover:underline">
                          <CardTitle className="truncate">{reflection.title}</CardTitle>
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <div className="flex items-center text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(reflection.created_at)}
                          </div>
                          {reflection.category && (
                            <Badge variant="outline" className="px-2 py-0.5 text-xs">{reflection.category}</Badge>
                          )}
                          {reflection.analyzed_at && (
                            <ReflectionLevelBadge level={reflection.reflection_level || getMoonLevel(reflection)} />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3 flex-1">
                        <p className="text-muted-foreground line-clamp-3 text-sm">
                          {getContentPreview(reflection.content, 100)}
                        </p>
                      </CardContent>
                      <CardFooter className="flex-col items-stretch pt-0">
                        <Separator className="mb-3" />
                        <div className="flex items-center justify-between mb-3">
                          {reflection.analyzed_at ? (
                            <div className="flex items-center gap-2">
                              <Progress
                                value={getAvgScore(reflection) * 10}
                                className="h-2 w-16"
                                style={{
                                  color: getAvgScore(reflection) >= 8 ? 'rgb(16, 185, 129)' : 
                                        getAvgScore(reflection) >= 6 ? 'rgb(59, 130, 246)' : 
                                        getAvgScore(reflection) >= 4 ? 'rgb(245, 158, 11)' : 
                                        'rgb(239, 68, 68)'
                                }}
                              />
                              <span className="text-sm font-semibold">{getAvgScore(reflection)}/10</span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="px-2 py-0.5 text-xs">Nicht analysiert</Badge>
                          )}
                          {reflection.is_public && (
                            <Badge className="px-2 py-0.5 text-xs">Öffentlich</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm" className="h-9 px-2" asChild>
                            <Link href={`/reflections/${reflection.id}`}>
                              <FileText className="h-4 w-4 mr-1" />
                              Ansehen
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 px-2" asChild>
                            <Link href={`/reflections/${reflection.id}/edit`}>
                              <PieChart className="h-4 w-4 mr-1" />
                              Bearbeiten
                      </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-0 text-destructive hover:bg-destructive/10"
                            onClick={() => setReflectionToDelete(reflection.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                      </div>
                    </CardFooter>
                  </Card>
                  ))}
            </div>
              )}
            </>
          )}
        </div>
        
        {/* Delete confirmation dialog */}
        <AlertDialog open={!!reflectionToDelete} onOpenChange={() => setReflectionToDelete(null)}>
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
                onClick={() => reflectionToDelete && handleDeleteReflection(reflectionToDelete)} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Wird gelöscht..." : "Löschen"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RequireAuth>
  )
} 