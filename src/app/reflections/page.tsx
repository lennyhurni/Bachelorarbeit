"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { FileText, Plus, Search, Calendar, Tag, ArrowUpDown, Filter, PieChart, Sparkles, Brain, Lightbulb, Target, Clock, CheckCircle, TrendingUp, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  
  // Enhanced example data with Moon's reflection levels
  const reflections = [
    {
      id: 1,
      title: "Projektarbeit Reflexion",
      excerpt: "Heute habe ich über meine Erfahrungen im letzten Gruppenprojekt reflektiert und tiefere Einsichten über meine Rolle im Team gewonnen. Die Herausforderungen haben mich gelehrt, besser zu kommunizieren...",
      date: "2023-11-15",
      category: "Studium",
      avgScore: 78,
      kpis: {
        depth: 75,
        coherence: 80,
        metacognition: 85,
        actionable: 72
      },
      moonLevel: "Analytical"
    },
    {
      id: 2,
      title: "Lernfortschritt Analyse",
      excerpt: "Meine Fortschritte in den letzten Wochen zeigen eine deutliche Verbesserung in meinem analytischen Denken. Ich hinterfrage jetzt Konzepte tiefer und verbinde sie mit bestehenden Wissensstrukturen...",
      date: "2023-11-10",
      category: "Persönlich",
      avgScore: 85,
      kpis: {
        depth: 88,
        coherence: 82,
        metacognition: 90,
        actionable: 80
      },
      moonLevel: "Critical"
    },
    {
      id: 3,
      title: "Teamkommunikation verbessern",
      excerpt: "Nach der letzten Teambesprechung habe ich festgestellt, dass wir unsere Kommunikation verbessern müssen. Die Missverständnisse führten zu Verzögerungen im Projektfortschritt...",
      date: "2023-11-08",
      category: "Arbeit",
      avgScore: 65,
      kpis: {
        depth: 60,
        coherence: 70,
        metacognition: 62,
        actionable: 68
      },
      moonLevel: "Descriptive"
    },
    {
      id: 4,
      title: "Feedback zur Präsentation",
      excerpt: "Das Feedback zur meiner letzten Präsentation hat mir wichtige Einsichten gegeben. Ich muss an meinem Tempo und der visuellen Darstellung komplexer Informationen arbeiten...",
      date: "2023-11-05",
      category: "Arbeit",
      avgScore: 72,
      kpis: {
        depth: 70,
        coherence: 75,
        metacognition: 68,
        actionable: 75
      },
      moonLevel: "Analytical"
    },
    {
      id: 5,
      title: "Selbstlernstrategien",
      excerpt: "Ich habe verschiedene Lernmethoden ausprobiert und reflektiert, welche für mich am besten funktionieren. Die Pomodoro-Technik verbessert meine Konzentration erheblich...",
      date: "2023-11-01",
      category: "Persönlich",
      avgScore: 80,
      kpis: {
        depth: 78,
        coherence: 82,
        metacognition: 85,
        actionable: 75
      },
      moonLevel: "Analytical"
    },
  ]
  
  // Filter and sort reflections
  const getFilteredAndSortedReflections = () => {
    let result = [...reflections]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        r => r.title.toLowerCase().includes(query) || 
             r.excerpt.toLowerCase().includes(query) ||
             r.category.toLowerCase().includes(query)
      )
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(r => r.category === selectedCategory)
    }
    
    // Apply sorting
    switch (sortBy) {
      case "date-desc":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "date-asc":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "score-desc":
        result.sort((a, b) => b.avgScore - a.avgScore)
        break
      case "score-asc":
        result.sort((a, b) => a.avgScore - b.avgScore)
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
  
  const categories = ["Studium", "Persönlich", "Arbeit"]
  const filteredReflections = getFilteredAndSortedReflections()
  
  return (
    <div className="py-6 space-y-6">
      <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meine Reflexionen</h1>
          <p className="text-muted-foreground mt-1">Verwalten und analysieren Sie Ihre Reflexionen</p>
        </div>
        <Button asChild>
          <Link href="/reflections/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Neue Reflexion
          </Link>
        </Button>
      </div>

      {/* Enhanced filter bar */}
      <div className="px-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Reflexionen durchsuchen..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className={showFilters ? "bg-primary/10 text-primary border-primary/30" : ""}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        <span>Sortieren</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Neueste zuerst</SelectItem>
                      <SelectItem value="date-asc">Älteste zuerst</SelectItem>
                      <SelectItem value="score-desc">Höchster Score</SelectItem>
                      <SelectItem value="score-asc">Niedrigster Score</SelectItem>
                      <SelectItem value="title-asc">Titel (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Titel (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {showFilters && (
                <div className="flex flex-wrap gap-3 pt-3 border-t">
                  <div>
                    <span className="text-sm font-medium mr-2">Kategorien:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge 
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory("all")}
                      >
                        Alle
                      </Badge>
                      {categories.map(category => (
                        <Badge 
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm font-medium">Reflexionsstufen:</span>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <ReflectionLevelBadge level="Descriptive" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">Beschreibende Reflexion: Beobachtungen und Erfahrungen werden beschrieben</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <ReflectionLevelBadge level="Analytical" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">Analytische Reflexion: Gründe und Zusammenhänge werden untersucht</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <ReflectionLevelBadge level="Critical" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">Kritische Reflexion: Tiefere Analyse mit Berücksichtigung verschiedener Perspektiven</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reflections grid with improvements */}
      <div className="px-6">
        {filteredReflections.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Keine Reflexionen gefunden</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Es wurden keine Reflexionen gefunden, die Ihren Filterkriterien entsprechen. Versuchen Sie, andere Filter anzuwenden oder erstellen Sie eine neue Reflexion.
            </p>
            <Button asChild>
              <Link href="/reflections/new">
                <Plus className="mr-2 h-4 w-4" />
                Neue Reflexion erstellen
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReflections.map((reflection) => (
              <Card key={reflection.id} className="hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="line-clamp-1">{reflection.title}</CardTitle>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {reflection.category}
                    </Badge>
                  </div>
                  <CardDescription className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(reflection.date).toLocaleDateString('de-DE')}
                    </span>
                    <ReflectionLevelBadge level={reflection.moonLevel} />
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <ScrollArea className="h-24">
                    <p className="text-sm text-muted-foreground">
                      {reflection.excerpt}
                    </p>
                  </ScrollArea>
                </CardContent>
                <div className="px-6 pb-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">KPI-Score</span>
                      <span className="font-medium">{reflection.avgScore}%</span>
                    </div>
                    <Progress value={reflection.avgScore} className="h-1.5" />
                  </div>
                </div>
                <CardFooter className="pt-2 flex justify-between">
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm bg-blue-50 dark:bg-blue-900/20">
                            <Brain className="h-3 w-3 text-blue-500" />
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{reflection.kpis.depth}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">Reflexionstiefe: {reflection.kpis.depth}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm bg-green-50 dark:bg-green-900/20">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">{reflection.kpis.coherence}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">Kohärenz: {reflection.kpis.coherence}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm bg-amber-50 dark:bg-amber-900/20">
                            <Lightbulb className="h-3 w-3 text-amber-500" />
                            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">{reflection.kpis.metacognition}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">Metakognition: {reflection.kpis.metacognition}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm bg-red-50 dark:bg-red-900/20">
                            <Target className="h-3 w-3 text-red-500" />
                            <span className="text-xs font-medium text-red-700 dark:text-red-300">{reflection.kpis.actionable}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">Handlungsorientierung: {reflection.kpis.actionable}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs" asChild>
                    <Link href={`/reflections/${reflection.id}`}>
                      Lesen
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* "Create new" card */}
            <Card className="border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors flex flex-col justify-center">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Sparkles className="h-10 w-10 text-primary/40 mb-4" />
                <h3 className="text-lg font-medium text-center mb-2">Erstelle eine neue Reflexion</h3>
                <p className="text-sm text-muted-foreground text-center mb-4 max-w-xs">
                  Dokumentiere deine Gedanken und erhalte wertvolle KI-Einsichten
                </p>
                <Button asChild>
                  <Link href="/reflections/new">
                    <FileText className="mr-2 h-4 w-4" />
                    Reflexion beginnen
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 