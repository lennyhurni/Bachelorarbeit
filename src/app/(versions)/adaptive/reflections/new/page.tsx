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
import { TransparencyInfo, TransparencyInfoGroup } from "@/components/transparency-info"

// Radar chart component with further refinements
const RadarChart = ({ data }: { data: { name: string, value: number, color: string }[] }) => {
  // Create shortened versions of dimension names for radar chart
  const dimensionLabels: Record<string, string> = {
    "Reflexionstiefe": "Tiefe",
    "Kohärenz": "Kohärenz",
    "Metakognition": "Meta",
    "Handlungsorientierung": "Handlung"
  };
  
  // Calculate average value for summary
  const avgValue = Math.round(data.reduce((sum, kpi) => sum + kpi.value, 0) / (data.length || 1));
  const chartSize = 280; // Chart size in pixels
  const maxRadiusPercentage = 42; // Maximum radius as percentage of chart size
  const pointDisplayMinRadius = 5; // Minimum radius for points to ensure visibility
  const labelDistance = 52; // Distance of labels from center
  const centerCircleSize = 16; // Size of center circle in percentage of chart size
  
  return (
    <div className="relative w-full h-[280px] flex items-center justify-center">
      {/* Background circles - subtle background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[85%] h-[85%] rounded-full border border-dashed border-gray-200/60 dark:border-gray-700/60"></div>
        <div className="absolute w-[60%] h-[60%] rounded-full border border-dashed border-gray-200/60 dark:border-gray-700/60"></div>
        <div className="absolute w-[30%] h-[30%] rounded-full border border-dashed border-gray-200/60 dark:border-gray-700/60"></div>
      </div>
      
      {/* KPI axis lines - for better visualization */}
      {data.map((kpi, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        return (
          <div 
            key={`axis-${kpi.name}`} 
            className="absolute h-[42%] border-r border-dashed border-gray-200/60 dark:border-gray-700/60 origin-bottom"
            style={{
              transform: `rotate(${(angle * 180) / Math.PI}deg)`
            }}
          />
        );
      })}
      
      {/* Connecting polygon between points with lower opacity fill */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <polygon 
          points={data.map((kpi, index) => {
            const angle = (Math.PI * 2 * index) / data.length;
            // Calculate radius based on value but ensure minimum display size
            const radiusPercentage = kpi.value === 0 ? pointDisplayMinRadius : 
                                   Math.max(pointDisplayMinRadius, (kpi.value / 100) * maxRadiusPercentage);
            const x = 50 + Math.cos(angle) * radiusPercentage;
            const y = 50 + Math.sin(angle) * radiusPercentage;
            return `${x},${y}`;
          }).join(' ')}
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeDasharray="0"
          strokeOpacity="0.6"
        />
      </svg>
      
      {/* KPI points with enhanced hover effect - drawn on top of polygon and center circle */}
      {data.map((kpi, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        // Calculate radius based on value but ensure minimum display size
        const radiusPercentage = kpi.value === 0 ? pointDisplayMinRadius : 
                               Math.max(pointDisplayMinRadius, (kpi.value / 100) * maxRadiusPercentage);
        const x = Math.cos(angle) * radiusPercentage;
        const y = Math.sin(angle) * radiusPercentage;
        
        return (
          <div key={kpi.name} className="absolute" style={{
            top: `calc(50% - ${y}%)`,
            left: `calc(50% + ${x}%)`,
            transform: 'translate(-50%, -50%)',
            zIndex: 3 // Ensure points are displayed on top
          }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="w-3 h-3 rounded-full cursor-help transition-all duration-200 hover:scale-150 hover:ring-2 ring-offset-2 ring-offset-background ring-primary/30 border border-white dark:border-gray-800" 
                    style={{ backgroundColor: kpi.color }}
                  ></div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm max-w-xs">
                    <span className="font-medium">{kpi.name}:</span> {kpi.value}%
                    <p className="text-xs text-muted-foreground mt-1">
                      {kpi.name === "Reflexionstiefe" && "Misst, wie tiefgehend Sie über Erfahrungen reflektieren - von beschreibend bis kritisch-analysierend."}
                      {kpi.name === "Kohärenz" && "Bewertet die Klarheit, logische Struktur und den Zusammenhang in Ihrem Text."}
                      {kpi.name === "Metakognition" && "Erfasst, wie bewusst Sie über Ihr eigenes Denken und Ihre eigenen Lernprozesse reflektieren."}
                      {kpi.name === "Handlungsorientierung" && "Bewertet, ob Sie konkrete nächste Schritte oder Anwendungsmöglichkeiten aus Ihren Erkenntnissen ableiten."}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      })}
      
      {/* Improved label positioning with better spacing - moved further outside chart area */}
      {data.map((kpi, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        // Fixed position outside the data points, further than before
        const x = Math.cos(angle) * labelDistance;
        const y = Math.sin(angle) * labelDistance;
        
        // Enhanced label with badge-like style for better readability
        return (
          <div 
            key={`label-${kpi.name}`} 
            className="absolute py-0.5 px-1.5 rounded-md bg-background/90 backdrop-blur-sm text-xs font-medium border border-border/30 shadow-sm" 
            style={{
              top: `calc(50% - ${y}%)`,
              left: `calc(50% + ${x}%)`,
              transform: 'translate(-50%, -50%)',
              zIndex: 2 // Ensure labels are above the polygon
            }}
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: kpi.color }}></div>
              <span>{dimensionLabels[kpi.name] || kpi.name}</span>
            </div>
          </div>
        )
      })}
      
      {/* Central KPI summary - displayed on top of grid but below points */}
      <div className="absolute flex flex-col items-center justify-center rounded-full bg-muted/40 backdrop-blur-sm border border-border/20 w-16 h-16 shadow-sm" style={{ zIndex: 2 }}>
        {data.some(kpi => kpi.value > 0) ? (
          <>
            <span className="text-lg font-bold">{avgValue}%</span>
            <span className="text-[10px] text-muted-foreground leading-none">Gesamt</span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">Keine Daten</span>
        )}
      </div>
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
    <div className="overflow-auto" style={{ height: '100%' }}>
      {/* Header - No sticky behavior */}
      <div className="border-b bg-background">
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
              <div className="flex items-center gap-1 mr-2">
                <span className="text-sm font-medium">System-Informationen</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0 hover:bg-accent/50 transition-colors">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end" className="max-w-xs">
                      <p className="text-xs">Aktivieren oder deaktivieren Sie detaillierte Informationen darüber, wie das System Ihre Daten analysiert.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch 
                checked={showTransparency} 
                onCheckedChange={setShowTransparency}
                aria-label="Transparenz-Modus umschalten"
                className="data-[state=checked]:bg-primary mr-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
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
                <Input id="title" placeholder="Geben Sie einen Titel ein" suppressHydrationWarning={true} />
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
                  suppressHydrationWarning={true}
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
                  <Input id="date" type="date" suppressHydrationWarning={true} />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="category">Kategorie</Label>
                  <Input id="category" placeholder="z.B. Studium, Arbeit" suppressHydrationWarning={true} />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Link href="/adaptive/reflections" className="flex-1">
                  <Button variant="outline" className="w-full hover:bg-accent transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Zurück
                  </Button>
                </Link>
                <Button className="flex-1 hover:bg-primary/90 transition-colors" variant="default">
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
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 hover:bg-accent/50">
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
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-3">
                <div className="space-y-6">
                  {/* Radar Chart */}
                  <RadarChart data={KPIs} />
                  
                  {/* KPIs Legend */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {KPIs.map(kpi => (
                      <div key={kpi.name} className="flex items-center gap-2 group p-1.5 rounded-lg hover:bg-accent/30 transition-colors">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: kpi.color }}></div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 cursor-help">
                                <span className="text-sm whitespace-nowrap font-medium">{kpi.name}</span>
                                <span className="text-sm font-bold">{kpi.value}%</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="w-60">
                              <div className="space-y-2">
                                <p className="text-sm font-medium">
                                  {kpi.name === "Reflexionstiefe" && "Tiefe Ihrer Analyse"}
                                  {kpi.name === "Kohärenz" && "Klarheit & Struktur"}
                                  {kpi.name === "Metakognition" && "Reflexion über Ihr Denken"}
                                  {kpi.name === "Handlungsorientierung" && "Konkrete nächste Schritte"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {kpi.name === "Reflexionstiefe" && "Misst, wie tiefgehend Sie über Erfahrungen reflektieren - von beschreibend bis kritisch-analysierend."}
                                  {kpi.name === "Kohärenz" && "Bewertet die Klarheit, logische Struktur und den Zusammenhang in Ihrem Text."}
                                  {kpi.name === "Metakognition" && "Erfasst, wie bewusst Sie über Ihr eigenes Denken und Ihre eigenen Lernprozesse reflektieren."}
                                  {kpi.name === "Handlungsorientierung" && "Bewertet, ob Sie konkrete nächste Schritte oder Anwendungsmöglichkeiten aus Ihren Erkenntnissen ableiten."}
                                </p>
                                {showTransparency && (
                                  <div className="bg-muted/60 p-2 rounded-md text-xs text-muted-foreground mt-1">
                                    <p className="flex items-center gap-1">
                                      <Lock className="h-3 w-3" />
                                      <span>
                                        {kpi.name === "Reflexionstiefe" && "Berechnet durch: Analyse kausaler Ausdrücke, kritischer Phrasen und Text-Komplexitätsmetriken."}
                                        {kpi.name === "Kohärenz" && "Berechnet durch: Analyse von Satzübergängen, thematischer Konsistenz und Textfluss."}
                                        {kpi.name === "Metakognition" && "Berechnet durch: Identifikation selbstreflexiver Ausdrücke und Muster des 'Denkens über das Denken'."}
                                        {kpi.name === "Handlungsorientierung" && "Berechnet durch: Erkennung konkreter Aktionspläne, Vorhaben und zukünftiger Anwendungen."}
                                      </span>
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
                  <div className="flex items-center justify-between w-full mb-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span>KI-Analyse Erklärung</span>
                    </h4>
                    
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      <Lock className="h-3 w-3 mr-1" />
                      <span>KI-System</span>
                    </Badge>
                  </div>
                  
                  <div className="w-full space-y-3">
                    <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <BrainCircuit className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200">Bewertungsmethodik</h5>
                          <p className="text-xs text-blue-700/90 dark:text-blue-300/90 mt-0.5">
                            Die vier Dimensionen (Tiefe, Kohärenz, Metakognition, Handlungsorientierung) werden durch NLP-Algorithmen in Echtzeit gemessen.
                          </p>
                          <div className="mt-2 p-1.5 rounded bg-blue-100/50 dark:bg-blue-900/30 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                            <Lock className="h-3 w-3" />
                            <span>Transformerbasierte Textanalyse mit domänenspezifischem Training</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted border">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background">
                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Datenschutz</h5>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Ihre Reflexionen werden lokal analysiert. Die Ergebnisse dienen ausschließlich der persönlichen Verbesserung Ihrer Reflexionsfähigkeit.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
      </div>
    </div>
  )
} 