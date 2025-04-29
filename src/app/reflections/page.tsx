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
import { FileText, Plus, Search, Calendar, Tag, ArrowUpDown, Filter, PieChart, Sparkles, Brain, Lightbulb, Target, Clock, CheckCircle, TrendingUp, HelpCircle, Settings, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import RequireAuth from "@/components/RequireAuth"
import { createClientBrowser } from "@/utils/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { UserSettings as UserSettingsType } from "@/utils/user-settings"
import { useUserSettings } from "@/hooks/useUserSettings"
import { useToast } from "@/components/ui/use-toast"

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
}

// Moon's Reflection Levels Badge Component
const ReflectionLevelBadge = ({ level }: { level: string }) => {
  const getLevelColor = () => {
    switch (level) {
      case "Descriptive":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "Analytical":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      case "Critical":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
  }
  
  const getIcon = () => {
    switch (level) {
      case "Descriptive":
        return <FileText className="h-3 w-3 mr-1" />
      case "Analytical":
        return <Brain className="h-3 w-3 mr-1" />
      case "Critical":
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
  
  // User and settings state
  const [user, setUser] = useState<UserProfile | null>(null)
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientBrowser()
  
  // Use settings hook
  const { settings, updateSetting } = useUserSettings()
  const { toast } = useToast()

  // Load reflections
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true)
        
        // Get user session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          console.log('No user session found')
          setLoading(false)
          return
        }
        
        // Get user profile with settings
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (userError) {
          console.error('Error fetching user data:', userError)
        } else {
          setUser({
            id: session.user.id,
            settings: userData?.settings
          })
        }
        
        // Fetch reflections from Supabase
        const { data: reflectionsData, error: reflectionsError } = await supabase
          .from('reflections')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
        
        if (reflectionsError) {
          console.error('Error fetching reflections:', reflectionsError)
        } else {
          setReflections(reflectionsData || [])
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [supabase])

  // Handle change of feedback depth - use hook
  const handleFeedbackDepthChange = (value: string) => {
    updateSetting('feedbackDepth', value)
  }
  
  // Filter and sort reflections
  const getFilteredAndSortedReflections = () => {
    if (!reflections || reflections.length === 0) return []
    
    let result = [...reflections]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        r => r.title.toLowerCase().includes(query) || 
             r.content.toLowerCase().includes(query) ||
             (r.category && r.category.toLowerCase().includes(query))
      )
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(r => r.category === selectedCategory)
    }
    
    // Apply sorting
    switch (sortBy) {
      case "date-desc":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "date-asc":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "score-desc":
        result.sort((a, b) => (b.kpi_depth + b.kpi_coherence + b.kpi_metacognition + b.kpi_actionable) / 4 - 
                             (a.kpi_depth + a.kpi_coherence + a.kpi_metacognition + a.kpi_actionable) / 4)
        break
      case "score-asc":
        result.sort((a, b) => (a.kpi_depth + a.kpi_coherence + a.kpi_metacognition + a.kpi_actionable) / 4 - 
                             (b.kpi_depth + b.kpi_coherence + b.kpi_metacognition + b.kpi_actionable) / 4)
        break
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
    }
    
    return result
  }
  
  // Get unique categories from reflections
  const getCategories = () => {
    if (!reflections || reflections.length === 0) return []
    
    const categoriesSet = new Set<string>()
    reflections.forEach(r => {
      if (r.category) categoriesSet.add(r.category)
    })
    
    return Array.from(categoriesSet)
  }
  
  const categories = getCategories()
  const filteredReflections = getFilteredAndSortedReflections()
  
  // Calculate Moon's reflection level based on KPIs
  const getMoonLevel = (reflection: Reflection) => {
    const avgScore = (reflection.kpi_depth + reflection.kpi_coherence + reflection.kpi_metacognition + reflection.kpi_actionable) / 4
    
    if (avgScore >= 8) return "Critical"
    if (avgScore >= 6) return "Analytical"
    return "Descriptive"
  }

  if (loading) {
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
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
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
                  <p className="text-sm">Feedback-Tiefe einstellen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button asChild>
              <Link href="/reflections/new" className="gap-2">
                <Plus className="h-4 w-4" />
                Neue Reflexion
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground/70" />
              <Input
                placeholder="Suche nach Reflexionen..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sortieren nach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Neueste zuerst</SelectItem>
                  <SelectItem value="date-asc">Älteste zuerst</SelectItem>
                  <SelectItem value="score-desc">Höchste Bewertung</SelectItem>
                  <SelectItem value="score-asc">Niedrigste Bewertung</SelectItem>
                  <SelectItem value="title-asc">Titel (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Titel (Z-A)</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-muted" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="bg-muted/40 p-3 rounded-md mb-4 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Kategorie:</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Alle Kategorien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Kategorien</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSortBy("date-desc")
                }}>
                  Filter zurücksetzen
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Reflections List */}
        <div className="px-6">
          {filteredReflections.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">Keine Reflexionen gefunden</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {reflections.length === 0 ? 
                  "Du hast noch keine Reflexionen erstellt." : 
                  "Keine Reflexionen entsprechen deinen Filterkriterien."}
              </p>
              {reflections.length === 0 && (
                <Button asChild>
                  <Link href="/reflections/new">Erste Reflexion erstellen</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredReflections.map((reflection) => {
                // Calculate average score
                const avgScore = Math.round((reflection.kpi_depth + reflection.kpi_coherence + reflection.kpi_metacognition + reflection.kpi_actionable) / 4)
                
                // Determine Moon's reflection level
                const moonLevel = getMoonLevel(reflection)
                
                return (
                  <Card key={reflection.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Link href={`/reflections/${reflection.id}`} className="block">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="hover:text-primary transition-colors">{reflection.title}</CardTitle>
                            {reflection.category && (
                              <Badge variant="outline" className="w-fit mt-1">
                                {reflection.category}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <ReflectionLevelBadge level={moonLevel} />
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(reflection.created_at).toLocaleDateString('de-DE')}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Link>
                    <CardContent className="pb-1">
                      <Link href={`/reflections/${reflection.id}`} className="block">
                        <div className="line-clamp-2 text-sm text-muted-foreground mb-3">
                          {reflection.content.length > 150 
                            ? `${reflection.content.slice(0, 150)}...` 
                            : reflection.content}
                        </div>
                      </Link>
                      
                      <div className="flex items-center justify-between gap-2 text-xs mt-2 mb-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <PieChart className="h-3 w-3" />
                          <span>Durchschnittliche Bewertung:</span>
                        </div>
                        <span className="font-medium">{avgScore}/10</span>
                      </div>
                      <Progress 
                        value={avgScore * 10} 
                        className="h-1.5" 
                        data-state={avgScore >= 7 ? "high" : avgScore >= 5 ? "medium" : "low"}
                      />
                    </CardContent>
                    <CardFooter className="pt-3 flex flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-0.5 p-1 rounded bg-muted/50">
                        <Sparkles className="h-3 w-3 text-blue-500" />
                        <span>Tiefe: {reflection.kpi_depth}/10</span>
                      </div>
                      <div className="flex items-center gap-0.5 p-1 rounded bg-muted/50">
                        <TrendingUp className="h-3 w-3 text-amber-500" />
                        <span>Kohärenz: {reflection.kpi_coherence}/10</span>
                      </div>
                      <div className="flex items-center gap-0.5 p-1 rounded bg-muted/50">
                        <Brain className="h-3 w-3 text-purple-500" />
                        <span>Metakognition: {reflection.kpi_metacognition}/10</span>
                      </div>
                      <div className="flex items-center gap-0.5 p-1 rounded bg-muted/50">
                        <Target className="h-3 w-3 text-emerald-500" />
                        <span>Handlung: {reflection.kpi_actionable}/10</span>
                      </div>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  )
} 