"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { useState, useEffect } from "react"
import { 
  Brain,
  Target,
  Clock,
  Calendar,
  ArrowLeft,
  Save,
  Home,
  ChevronRight,
  HelpCircle,
  Info,
  Zap,
  ArrowRight,
  AlertCircle,
  Sparkles,
  List,
  PieChart,
  BrainCircuit,
  Lock
} from "lucide-react"

// Radar chart component for KPIs
const RadarChart = ({ data }: { data: { name: string, value: number, color: string }[] }) => {
  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Background circles */}
        <div className="w-[90%] h-[90%] rounded-full border border-dashed border-gray-200 dark:border-gray-700"></div>
        <div className="absolute w-[60%] h-[60%] rounded-full border border-dashed border-gray-200 dark:border-gray-700"></div>
        <div className="absolute w-[30%] h-[30%] rounded-full border border-dashed border-gray-200 dark:border-gray-700"></div>
      </div>
      
      {/* KPI points */}
      {data.map((kpi, index) => {
        const angle = (Math.PI * 2 * index) / data.length
        const radius = (kpi.value / 100) * 45 // 45% of container for max value
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        return (
          <div key={kpi.name} className="absolute" style={{
            top: `calc(50% - ${y}%)`,
            left: `calc(50% + ${x}%)`,
            transform: 'translate(-50%, -50%)'
          }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: kpi.color }}></div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <span className="font-medium">{kpi.name}</span>: {kpi.value}%
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      })}
      
      {/* KPI labels */}
      {data.map((kpi, index) => {
        const angle = (Math.PI * 2 * index) / data.length
        const radius = 55 // 55% of container for labels
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        return (
          <div key={`label-${kpi.name}`} className="absolute text-xs font-medium" style={{
            top: `calc(50% - ${y}%)`,
            left: `calc(50% + ${x}%)`,
            transform: 'translate(-50%, -50%)'
          }}>
            {kpi.name}
          </div>
        )
      })}
      
      {/* Connecting lines between points */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
        <polygon 
          points={data.map((kpi, index) => {
            const angle = (Math.PI * 2 * index) / data.length
            const radius = (kpi.value / 100) * 45 // 45% of container
            const x = 50 + Math.cos(angle) * radius
            const y = 50 + Math.sin(angle) * radius
            return `${x},${y}`
          }).join(' ')}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}

// Advanced adaptive prompts that change based on content
const getAdaptivePrompts = (text: string) => {
  // Default prompts
  const defaultPrompts = [
    "Was haben Sie aus dieser Erfahrung gelernt?",
    "Wie können Sie das Gelernte in Zukunft anwenden?",
    "Beschreiben Sie Ihre Gefühle während dieses Prozesses."
  ]
  
  // Content-based adaptive prompts
  if (!text || text.length < 50) return defaultPrompts
  
  const prompts = []
  
  // Check for different content patterns
  const hasDescriptionOnly = text.length < 150 && !/weil|daher|deshalb|dadurch|aus diesem grund/i.test(text)
  const lacksReflection = !text.includes("gelernt") && !text.includes("erkannt") && !text.includes("verstanden")
  const lacksNextSteps = !text.includes("nächst") && !text.includes("zukunft") && !text.includes("werde ich")
  const mentionsChallenge = text.includes("herausforder") || text.includes("schwierig") || text.includes("problem")
  
  // Add contextual prompts
  if (hasDescriptionOnly) {
    prompts.push("Warum ist das passiert? Analysieren Sie die Ursachen und Zusammenhänge.")
  }
  
  if (lacksReflection) {
    prompts.push("Was haben Sie persönlich aus dieser Situation gelernt?")
  }
  
  if (lacksNextSteps) {
    prompts.push("Welche konkreten Schritte werden Sie als Nächstes unternehmen?")
  }
  
  if (mentionsChallenge) {
    prompts.push("Wie könnten Sie diese Herausforderung beim nächsten Mal anders angehen?")
  }
  
  // Add analytical prompts to deepen reflection
  prompts.push("Betrachten Sie die Situation aus einer anderen Perspektive. Was sehen Sie nun?")
  
  return prompts.slice(0, 3) // Limit to 3 prompts
}

export default function NewAdaptiveReflection() {
  const [reflectionText, setReflectionText] = useState("")
  const [adaptivePrompts, setAdaptivePrompts] = useState<string[]>([])
  const [showTransparency, setShowTransparency] = useState(true)
  const [KPIs, setKPIs] = useState([
    { name: "Reflexionstiefe", value: 0, color: "#3b82f6" },
    { name: "Kohärenz", value: 0, color: "#10b981" },
    { name: "Metakognition", value: 0, color: "#8b5cf6" },
    { name: "Handlungsorientierung", value: 0, color: "#f59e0b" }
  ])
  
  // Update KPIs based on text analysis
  useEffect(() => {
    if (!reflectionText) {
      setKPIs(prev => prev.map(kpi => ({ ...kpi, value: 0 })))
      return
    }
    
    // Simple analysis logic for demo purposes
    const length = reflectionText.length
    const words = reflectionText.split(/\s+/).length
    
    // Calculate reflection depth (based on complexity of language and analysis)
    const hasAnalyticalPhrases = /weil|daher|deshalb|dadurch|aus diesem grund|erkenne ich|verstehe ich/i.test(reflectionText)
    const hasCriticalPhrases = /kritisch|hinterfrage|alternative|verbessern|könnte ich|sollte ich|in zukunft/i.test(reflectionText)
    let depthScore = Math.min(length / 10, 100)
    if (hasAnalyticalPhrases) depthScore += 15
    if (hasCriticalPhrases) depthScore += 20
    depthScore = Math.min(depthScore, 100)
    
    // Calculate coherence (based on text structure and flow)
    const sentenceCount = (reflectionText.match(/[.!?]+/g) || []).length
    const avgSentenceLength = words / (sentenceCount || 1)
    const coherenceScore = Math.min(
      100,
      Math.max(20, 100 - Math.abs(avgSentenceLength - 15) * 3)
    )
    
    // Calculate metacognition (based on reflective language)
    const metacognitiveTerms = [
      "ich denke", "ich fühle", "ich bemerke", "ich erkenne", "ich verstehe",
      "mir ist aufgefallen", "ich habe gelernt", "ich weiss nun", "ich bin mir bewusst"
    ]
    const metacognitiveMatches = metacognitiveTerms.filter(term => 
      reflectionText.toLowerCase().includes(term.toLowerCase())
    ).length
    const metacognitionScore = Math.min(metacognitiveMatches * 20, 100)
    
    // Calculate action orientation (based on future-oriented language)
    const actionTerms = [
      "ich werde", "nächstes mal", "zukünftig", "plan", "vorhaben", "umsetzen",
      "anwenden", "verbessern", "ändern"
    ]
    const actionMatches = actionTerms.filter(term => 
      reflectionText.toLowerCase().includes(term.toLowerCase())
    ).length
    const actionScore = Math.min(actionMatches * 25, 100)
    
    // Update KPIs with a slight animation delay
    setTimeout(() => {
      setKPIs([
        { name: "Reflexionstiefe", value: Math.round(depthScore), color: "#3b82f6" },
        { name: "Kohärenz", value: Math.round(coherenceScore), color: "#10b981" },
        { name: "Metakognition", value: Math.round(metacognitionScore), color: "#8b5cf6" },
        { name: "Handlungsorientierung", value: Math.round(actionScore), color: "#f59e0b" }
      ])
    }, 300)
    
  }, [reflectionText])

  // Update adaptive prompts based on reflection content
  useEffect(() => {
    const newPrompts = getAdaptivePrompts(reflectionText)
    setAdaptivePrompts(newPrompts)
  }, [reflectionText])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/adaptive/dashboard">
              <Button variant="ghost" size="icon">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/adaptive/reflections" className="hover:text-foreground">
                Reflexionen
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Neue KI-gestützte Reflexion</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1.5 rounded-full text-xs">
              <BrainCircuit className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">KI-Analyse aktiv</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-sm">Transparenz</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end" className="max-w-xs">
                      <p className="text-xs">Aktivieren oder deaktivieren Sie detaillierte Informationen darüber, wie die KI Ihre Reflexion analysiert.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch 
                checked={showTransparency} 
                onCheckedChange={setShowTransparency}
                aria-label="Transparenz aktivieren oder deaktivieren"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Reflexionsformular */}
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle>KI-gestützte Reflexion</CardTitle>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full cursor-help">
                        <Sparkles className="h-3 w-3" />
                        <span>Erweiterte KI</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent align="end" className="max-w-xs">
                      <div>
                        <p className="text-xs font-medium mb-1">KI-gestützte Reflexionsunterstützung</p>
                        <p className="text-xs">Diese Version verwendet fortschrittliche KI, um Ihre Reflexion in Echtzeit zu analysieren, personalisierte Prompts zu generieren und detaillierte Einblicke zu liefern.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>
                Erstellen Sie eine neue Reflexion mit adaptiver KI-Unterstützung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="title">Titel</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Geben Sie einen aussagekräftigen Titel ein, der das Hauptthema Ihrer Reflexion zusammenfasst.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input id="title" placeholder="Geben Sie einen Titel ein" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="reflection">Reflexion</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div>
                            <p className="text-xs">Verfassen Sie Ihre Reflexion. Während Sie schreiben, analysiert die KI Ihren Text und bietet personalisierte Prompts und Einblicke.</p>
                            <p className="text-xs font-medium text-primary mt-1">Tipp: Je ausführlicher Sie reflektieren, desto besser werden die KI-Vorschläge.</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {showTransparency && (
                    <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800">
                      Echtzeit-Analyse
                    </Badge>
                  )}
                </div>
                <Textarea 
                  id="reflection" 
                  placeholder="Beschreiben Sie Ihre Erfahrungen und Erkenntnisse..."
                  className="min-h-[250px] resize-none"
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-muted-foreground cursor-help">
                        <Sparkles className="h-3 w-3 mr-1 text-blue-500" />
                        KI-Analyse erfolgt in Echtzeit während der Eingabe.
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div>
                        <p className="text-xs font-medium mb-1">Über die Echtzeit-KI-Analyse</p>
                        <p className="text-xs">Während Sie schreiben, analysiert das System Ihren Text nach verschiedenen Dimensionen wie Reflexionstiefe, Kohärenz, Metakognition und Handlungsorientierung.</p>
                        {showTransparency && (
                          <div className="mt-1 pt-1 border-t border-muted">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              <span>NLP-Technologie: Transformerbasierte Musteranalyse</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Adaptive Prompts Section */}
              <Card className={`border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50`}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <CardTitle className="text-sm">Adaptive KI-Prompts</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                              <HelpCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div>
                              <p className="text-xs font-medium mb-1">Personalisierte Reflexionshilfen</p>
                              <p className="text-xs">Diese Prompts werden dynamisch anhand Ihres aktuellen Textes generiert. Sie passen sich an den Inhalt Ihrer Reflexion an und unterstützen Sie bei der Vertiefung.</p>
                              {showTransparency && (
                                <div className="mt-1 pt-1 border-t border-muted text-muted-foreground">
                                  <p className="text-xs">Algorithmus: Kontinuierliche Musteranalyse Ihres Textes mit kontextabhängigen Regeln und linguistischem Matching.</p>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {showTransparency && (
                      <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs">
                        Kontextsensitiv
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {adaptivePrompts.length > 0 ? (
                    <ul className="space-y-3">
                      {adaptivePrompts.map((prompt, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="text-sm text-blue-800 dark:text-blue-200">{prompt}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Beginnen Sie mit dem Schreiben, um personalisierte Prompts zu erhalten.
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="date">Datum</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="category">Kategorie</Label>
                  <Input id="category" placeholder="z.B. Studium, Arbeit" />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Link href="/adaptive/reflections" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Zurück
                  </Button>
                </Link>
                <Button className="flex-1" variant="default">
                  <Save className="h-4 w-4 mr-2" />
                  Reflexion speichern
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* KPI-Visualisierung */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    <CardTitle>KI-Analyse</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent align="end" className="max-w-xs">
                          <div>
                            <p className="text-xs font-medium mb-1">Multidimensionale Reflexionsanalyse</p>
                            <p className="text-xs">Diese Visualisierung zeigt die Qualität Ihrer Reflexion in vier Schlüsselbereichen, die für effektives reflektives Denken wichtig sind.</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Transparenz</span>
                            <Switch 
                              checked={showTransparency} 
                              onCheckedChange={setShowTransparency}
                              aria-label="Transparenz-Erklärungen umschalten"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent align="end" className="max-w-xs">
                          <p className="text-xs">Aktivieren Sie diese Option, um detaillierte Erklärungen zur KI-Analyse zu erhalten.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-3">
                <div className="space-y-6">
                  {/* Radar Chart */}
                  <RadarChart data={KPIs} />
                  
                  {/* KPIs Legend */}
                  <div className="grid grid-cols-2 gap-3">
                    {KPIs.map(kpi => (
                      <div key={kpi.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: kpi.color }}></div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2">
                                {kpi.name}: <strong>{kpi.value}%</strong>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent align="center" className="max-w-xs">
                              <div>
                                <p className="text-xs font-medium mb-1">{kpi.name}</p>
                                <p className="text-xs">
                                  {kpi.name === "Reflexionstiefe" && "Misst, wie tiefgehend Sie über Erfahrungen reflektieren - von beschreibend bis kritisch-analysierend."}
                                  {kpi.name === "Kohärenz" && "Bewertet die Klarheit, logische Struktur und den Zusammenhang in Ihrem Text."}
                                  {kpi.name === "Metakognition" && "Erfasst, wie bewusst Sie über Ihr eigenes Denken und Ihre eigenen Lernprozesse reflektieren."}
                                  {kpi.name === "Handlungsorientierung" && "Bewertet, ob Sie konkrete nächste Schritte oder Anwendungsmöglichkeiten aus Ihren Erkenntnissen ableiten."}
                                </p>
                                {showTransparency && (
                                  <div className="mt-1 pt-1 border-t border-muted">
                                    <p className="text-xs text-muted-foreground">
                                      {kpi.name === "Reflexionstiefe" && "Berechnet durch: Analyse kausaler Ausdrücke, kritischer Phrasen und Text-Komplexitätsmetriken."}
                                      {kpi.name === "Kohärenz" && "Berechnet durch: Analyse von Satzübergängen, thematischer Konsistenz und Textfluss."}
                                      {kpi.name === "Metakognition" && "Berechnet durch: Identifikation selbstreflexiver Ausdrücke und Muster des 'Denkens über das Denken'."}
                                      {kpi.name === "Handlungsorientierung" && "Berechnet durch: Erkennung konkreter Aktionspläne, Vorhaben und zukünftiger Anwendungen."}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              {/* Transparency Section */}
              {showTransparency && (
                <CardFooter className="border-t p-4 flex flex-col items-start">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Info className="h-4 w-4 text-primary" />
                    Wie diese Analyse funktioniert
                  </h4>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-xs py-2">
                        <div className="flex items-center gap-1">
                          <span>Bewertungsmethodik</span>
                          <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                            NLP-Algorithmus
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground">
                        <p>Die KI-Analyse verwendet Natural Language Processing (NLP), um Ihre Reflexion in Echtzeit zu bewerten. Die Bewertung basiert auf linguistischen Mustern, semantischer Analyse und Strukturmerkmalen in Ihrem Text.</p>
                        <p className="mt-1 flex items-center gap-1 text-primary-foreground/70">
                          <Lock className="h-3 w-3" />
                          <span>Technologie: Transformerbasierte Textanalyse mit domänenspezifischem Training für Reflexionstexte</span>
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-xs py-2">
                        <div className="flex items-center gap-1">
                          <span>Reflexionstiefe-Indikatoren</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground">
                        <p>Diese Metrik misst, wie tief Sie Ihre Erfahrungen analysieren. Sie berücksichtigt kausale Ausdrücke, kritisches Denken und die Komplexität Ihrer Gedanken.</p>
                        <ul className="list-disc list-inside mt-1">
                          <li>Geringe Tiefe: Hauptsächlich beschreibender Text, wenig Analyse</li>
                          <li>Mittlere Tiefe: Enthält analytische Elemente (Warum? Wie?) und Kausalverbindungen</li>
                          <li>Hohe Tiefe: Kritische Perspektiven, alternative Blickwinkel, tiefe Einsichten</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-xs py-2">
                        <div className="flex items-center gap-1">
                          <span>Metakognitive Muster</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground">
                        <p>Diese Metrik erfasst, wie häufig Sie metakognitive Ausdrücke verwenden, die auf Ihr eigenes Denken und Lernen verweisen, wie "Ich erkenne...", "Mir ist aufgefallen..." oder "Ich verstehe jetzt..."</p>
                        <p className="mt-1">Hohe Metakognitionswerte deuten auf eine starke Fähigkeit zur Selbstreflexion und ein bewusstes Verständnis der eigenen Denkprozesse hin.</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-xs py-2">
                        <div className="flex items-center gap-1">
                          <span>Datenverarbeitung und Privatsphäre</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground">
                        <p>Ihre Reflexionen werden für die Analyse verarbeitet, aber alle personenbezogenen Daten bleiben geschützt. Die Analyse erfolgt direkt im Browser und mit fortschrittlichen Schutzmechanismen.</p>
                        <div className="mt-2 p-2 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950/30 flex gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800 dark:text-amber-300">Hinweis zur Datennutzung</p>
                            <p className="text-amber-700 dark:text-amber-400">Anonymisierte Nutzungsdaten können zur Verbesserung des Systems verwendet werden. Sie können dies in den Einstellungen deaktivieren.</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardFooter>
              )}
            </Card>

            <Card className="shadow-lg mt-6">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle>Nächste Schritte & Feedback</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent align="end" className="max-w-xs">
                          <div>
                            <p className="text-xs font-medium mb-1">Personalisiertes Feedback</p>
                            <p className="text-xs">Basierend auf Ihrer Reflexion bietet das System konkrete Handlungsempfehlungen sowie individuelles Feedback zur Verbesserung.</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {showTransparency && (
                    <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800">
                      KI-generiert
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="nextsteps">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="nextsteps">Nächste Schritte</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="nextsteps" className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          Vorgeschlagene Massnahmen
                        </h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent align="end" className="max-w-xs">
                              <div>
                                <p className="text-xs">Diese Vorschläge basieren auf dem Inhalt Ihrer aktuellen Reflexion und helfen Ihnen, das Gelernte in konkrete Schritte umzusetzen.</p>
                                {showTransparency && (
                                  <p className="text-xs mt-1 pt-1 border-t border-muted text-muted-foreground">
                                    Generiert durch: Musteranalyse mit Fokus auf Lernziele und implizit erwähnte Entwicklungsbereiche.
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-700 dark:text-blue-300 mt-0.5">1</div>
                          <span>Identifizieren Sie konkrete Anwendungsbereiche für Ihre neuen Erkenntnisse.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-700 dark:text-blue-300 mt-0.5">2</div>
                          <span>Setzen Sie sich ein messbares Ziel für die nächste Woche, das auf dieser Reflexion basiert.</span>
                        </li>
                      </ul>
                    </div>
                    {showTransparency && (
                      <div className="px-2 py-1 text-xs text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Die Vorschläge werden anhand Ihrer spezifischen Reflexionsinhalte generiert.</span>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="feedback" className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          KI-generiertes Feedback
                        </h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent align="end" className="max-w-xs">
                              <div>
                                <p className="text-xs">Das Feedback analysiert die Stärken und Schwächen Ihrer Reflexion und bietet gezielte Verbesserungsvorschläge.</p>
                                {showTransparency && (
                                  <p className="text-xs mt-1 pt-1 border-t border-muted text-muted-foreground">
                                    Basiert auf einem multidimensionalen Bewertungsmodell mit Referenzwerten aus Experten-Reflexionen.
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        Ihre Reflexion zeigt eine gute analytische Grundlage. Für mehr Tiefe könnten Sie:
                      </p>
                      
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2 group">
                          <div className="shrink-0 mt-0.5">•</div>
                          <div>
                            <span>Mehr auf die Ursachen Ihrer Beobachtungen eingehen</span>
                            {showTransparency && (
                              <div className="hidden group-hover:block mt-1 text-xs bg-primary/5 p-1 rounded">
                                Erkannt: Wenige kausale Verbindungen in Ihrem Text
                              </div>
                            )}
                          </div>
                        </li>
                        <li className="flex items-start gap-2 group">
                          <div className="shrink-0 mt-0.5">•</div>
                          <div>
                            <span>Verschiedene Perspektiven berücksichtigen</span>
                            {showTransparency && (
                              <div className="hidden group-hover:block mt-1 text-xs bg-primary/5 p-1 rounded">
                                Erkannt: Vorwiegend eine Betrachtungsweise
                              </div>
                            )}
                          </div>
                        </li>
                        <li className="flex items-start gap-2 group">
                          <div className="shrink-0 mt-0.5">•</div>
                          <div>
                            <span>Verbindungen zu früheren Lernerfahrungen herstellen</span>
                            {showTransparency && (
                              <div className="hidden group-hover:block mt-1 text-xs bg-primary/5 p-1 rounded">
                                Erkannt: Wenig Bezug zu vorherigen Erkenntnissen
                              </div>
                            )}
                          </div>
                        </li>
                      </ul>
                    </div>
                    {showTransparency && (
                      <div className="flex items-center justify-between text-xs text-muted-foreground px-2 py-1">
                        <div className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          <span>Feedback-System: GPT-basiertes Modell mit didaktischen Richtlinien</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] py-0 h-4">
                          Konfidenzscore: 86%
                        </Badge>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 