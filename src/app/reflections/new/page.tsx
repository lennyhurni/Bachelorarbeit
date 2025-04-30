"use client"

export const dynamic = 'force-dynamic'

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
import { useState, useEffect, FormEvent } from "react"
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
  Lock,
  Loader2,
  RefreshCw
} from "lucide-react"
import { TransparencyInfo, TransparencyInfoGroup } from "@/components/transparency-info"
import RequireAuth from "@/components/RequireAuth"
import { useUserSettings } from "@/hooks/useUserSettings"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { createClientBrowser } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"

// Komplett überarbeitetes RadarChart mit korrekter Visualisierung
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
  
  return (
    <div className="w-full h-[280px] flex items-center justify-center">
      <div className="w-full h-full relative">
        {/* Hintergrundkreise */}
        <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
          <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.7" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
          <circle cx="100" cy="100" r="35" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.5" />
      
          {/* Achsenlinien für die KPIs */}
          {data.map((kpi, i) => {
            const angle = (Math.PI * 2 * i) / data.length;
            const x2 = 100 + Math.cos(angle) * 85;
            const y2 = 100 + Math.sin(angle) * 85;
        return (
              <line 
            key={`axis-${kpi.name}`} 
                x1="100" 
                y1="100" 
                x2={x2} 
                y2={y2} 
                stroke="hsl(var(--border))" 
                strokeWidth="0.5" 
                strokeDasharray="2,2"
                opacity="0.6" 
          />
        );
      })}
      
          {/* Polygon für die KPI-Werte */}
        <polygon 
            points={data.map((kpi, i) => {
              const angle = (Math.PI * 2 * i) / data.length;
              const value = Math.max(5, kpi.value); // Mindestens 5% für sichtbare Punkte
              const radius = (value / 100) * 85;
              const x = 100 + Math.cos(angle) * radius;
              const y = 100 + Math.sin(angle) * radius;
            return `${x},${y}`;
          }).join(' ')}
          fill="rgba(59, 130, 246, 0.15)"
            stroke="rgb(59, 130, 246)"
          strokeWidth="1.5"
            className="transition-all duration-500 ease-in-out"
        />
      
          {/* KPI-Punkte */}
          {data.map((kpi, i) => {
            const angle = (Math.PI * 2 * i) / data.length;
            const value = Math.max(5, kpi.value); // Mindestens 5% für sichtbare Punkte
            const radius = (value / 100) * 85;
            const x = 100 + Math.cos(angle) * radius;
            const y = 100 + Math.sin(angle) * radius;
        
        return (
              <g key={`point-${kpi.name}`} className="transition-all duration-500 ease-in-out">
                <circle 
                  cx={x} 
                  cy={y} 
                  r="3" 
                  fill={kpi.color}
                  stroke="white"
                  strokeWidth="1"
                  className="cursor-help hover:r-4 transition-all duration-300"
                />
                
                {/* Labels */}
                <foreignObject
                  x={100 + Math.cos(angle) * 95 - 20}
                  y={100 + Math.sin(angle) * 95 - 10}
                  width="40"
                  height="20"
                  className="overflow-visible pointer-events-none"
                >
                  <div className="flex items-center justify-center bg-background border border-border/50 px-1.5 py-0.5 rounded text-xs whitespace-nowrap shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: kpi.color }}></div>
                    {dimensionLabels[kpi.name] || kpi.name}
            </div>
                </foreignObject>
              </g>
            );
      })}
      
          {/* Zentrales Label mit Durchschnittswert */}
          <circle 
            cx="100" 
            cy="100" 
            r="17" 
            fill="hsl(var(--muted))" 
            fillOpacity="0.3" 
            stroke="hsl(var(--border))" 
            strokeWidth="1"
          />
          <text 
            x="100" 
            y="98" 
            textAnchor="middle" 
            dominantBaseline="central" 
            className="fill-current text-lg font-bold" 
            fontSize="14"
          >
            {avgValue}%
          </text>
          <text 
            x="100" 
            y="110" 
            textAnchor="middle" 
            dominantBaseline="central" 
            className="fill-muted-foreground" 
            fontSize="8"
          >
            Gesamt
          </text>
        </svg>
      </div>
    </div>
  );
};

// Neue Funktion zum Aktualisieren der adaptiven Fragen
const updateAdaptivePrompts = (text: string) => {
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
  const [showTransparency, setShowTransparency] = useState(false)
  const [KPIs, setKPIs] = useState([
    { name: "Reflexionstiefe", value: 0, color: "#3b82f6" },
    { name: "Kohärenz", value: 0, color: "#10b981" },
    { name: "Metakognition", value: 0, color: "#8b5cf6" },
    { name: "Handlungsorientierung", value: 0, color: "#f59e0b" }
  ])
  
  // Add new state variables for the form
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Allgemein")
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [refreshingQuestions, setRefreshingQuestions] = useState(false)
  const [analyzingFeedback, setAnalyzingFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  
  // Add router for navigation
  const router = useRouter()
  const supabase = createClientBrowser()
  const { toast } = useToast()
  
  // Add settings hook
  const { settings, updateSetting } = useUserSettings()
  
  // Create a function to handle feedback depth change
  const handleFeedbackDepthChange = (value: string) => {
    updateSetting('feedbackDepth', value)
  }
  
  // Fallback-Funktion für Fragen wenn die API nicht verfügbar ist
  const generateFallbackPrompts = (text: string) => {
    // Basis-Prompts für unterschiedliche Reflexionsphasen
    const descriptionPrompts = [
      "Beschreiben Sie die Situation genauer. Was ist passiert?",
      "Wer war an dieser Situation beteiligt?",
      "Wann und wo hat sich diese Situation ereignet?"
    ];
    
    const analysisPrompts = [
      "Warum ist das passiert? Welche Ursachen können Sie identifizieren?",
      "Welche Faktoren haben zu dieser Situation beigetragen?",
      "Wie haben Sie in dieser Situation gehandelt und warum?"
    ];
    
    const reflectionPrompts = [
      "Was haben Sie aus dieser Erfahrung gelernt?",
      "Wie hat diese Erfahrung Ihre Sichtweise verändert?",
      "Welche Erkenntnisse über sich selbst haben Sie gewonnen?"
    ];
    
    const actionPrompts = [
      "Wie werden Sie diese Erkenntnisse in Zukunft anwenden?",
      "Welche konkreten Schritte planen Sie aufgrund dieser Reflexion?",
      "Was würden Sie beim nächsten Mal anders machen?"
    ];
    
    // Prompt-Auswahl basierend auf Textanalyse
    const prompts = [];
    
    // Zufällig eine Frage aus jeder Kategorie auswählen, die zum Text passt
    if (text.length < 100 || !text.includes("weil") && !text.includes("daher")) {
      prompts.push(descriptionPrompts[Math.floor(Math.random() * descriptionPrompts.length)]);
    }
    
    if (!text.includes("gelernt") && !text.includes("erkannt")) {
      prompts.push(reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]);
    }
    
    if (!text.includes("nächst") && !text.includes("zukunft") && !text.includes("werde")) {
      prompts.push(actionPrompts[Math.floor(Math.random() * actionPrompts.length)]);
    } else {
      prompts.push(analysisPrompts[Math.floor(Math.random() * analysisPrompts.length)]);
    }
    
    // Stelle sicher, dass wir mindestens 3 unterschiedliche Fragen haben
    while (prompts.length < 3) {
      const allPrompts = [...descriptionPrompts, ...analysisPrompts, ...reflectionPrompts, ...actionPrompts];
      const randomPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)];
      
      if (!prompts.includes(randomPrompt)) {
        prompts.push(randomPrompt);
      }
    }
    
    return prompts.slice(0, 3);
  };
  
  // Verbesserte Funktion zum Aktualisieren der adaptiven Fragen
  const refreshAdaptivePrompts = () => {
    setRefreshingQuestions(true)
    
    // Kurze Verzögerung für visuelles Feedback
    setTimeout(() => {
      // Verwende direkteren Ansatz für die KI-basierte Analyse
      if (reflectionText.trim()) {
        // Neue Fragen generieren
        fetch('/api/reflections/analyze/live', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: reflectionText,
            title,
            category
          }),
        })
        .then(response => {
          if (!response.ok) throw new Error('Analyse konnte nicht durchgeführt werden');
          return response.json();
        })
        .then(data => {
          if (data.success && data.analysis && data.analysis.adaptive_prompts) {
            setAdaptivePrompts(data.analysis.adaptive_prompts);
            toast({
              title: "Fragen aktualisiert",
              description: "Die hilfreichen Fragen wurden basierend auf Ihrer Reflexion aktualisiert.",
              duration: 2000
            });
          } else {
            throw new Error('Keine Fragen erhalten');
          }
        })
        .catch(error => {
          console.error("Fehler beim Aktualisieren der Fragen:", error);
          
          // Fallback: Verwende die lokale Funktion für Fragen
          const newPrompts = generateFallbackPrompts(reflectionText);
          setAdaptivePrompts(newPrompts);
          
          toast({
            title: "Lokale Fragen generiert",
            description: "Es wurden neue Fragen basierend auf einfachen Mustern erstellt.",
            duration: 2000
          });
        })
        .finally(() => {
          setRefreshingQuestions(false);
        });
      } else {
        // Falls kein Text vorhanden ist
        setRefreshingQuestions(false);
        toast({
          title: "Fehler",
          description: "Bitte geben Sie zuerst einen Reflexionstext ein.",
          variant: "destructive",
          duration: 2000
        });
      }
    }, 300);
  };
  
  // Add a function to save the reflection
  const saveReflection = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setErrorMessage("Bitte geben Sie einen Titel ein")
      return
    }
    
    if (!reflectionText.trim()) {
      setErrorMessage("Bitte geben Sie einen Reflexionstext ein")
      return
    }
    
    try {
      setSubmitting(true)
      setErrorMessage("")
      
      // Extract KPI values
      const kpiDepth = KPIs.find(k => k.name === "Reflexionstiefe")?.value || 0
      const kpiCoherence = KPIs.find(k => k.name === "Kohärenz")?.value || 0
      const kpiMetacognition = KPIs.find(k => k.name === "Metakognition")?.value || 0
      const kpiActionable = KPIs.find(k => k.name === "Handlungsorientierung")?.value || 0
      
      // Convert percentage values to 0-10 scale for database
      const toTenScale = (value: number) => Math.round((value / 100) * 10)
      
      // Submit to API
      const response = await fetch('/api/reflections/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: reflectionText,
          category,
          is_public: false, // Immer auf false setzen
          kpi_depth: toTenScale(kpiDepth),
          kpi_coherence: toTenScale(kpiCoherence),
          kpi_metacognition: toTenScale(kpiMetacognition),
          kpi_actionable: toTenScale(kpiActionable)
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Speichern der Reflexion")
      }
      
      // Navigate to the reflections page
      router.push('/reflections')
      
    } catch (error) {
      console.error('Error saving reflection:', error)
      setErrorMessage(error instanceof Error ? error.message : "Unbekannter Fehler")
    } finally {
      setSubmitting(false)
    }
  }
  
  // Funktion zum Analysieren des Textes mit dem NLP-Backend
  const analyzeWithNLP = async () => {
    if (!reflectionText.trim()) {
      toast({
        title: "Fehlender Text",
        description: "Bitte geben Sie einen Reflexionstext ein, bevor Sie ihn analysieren.",
        variant: "destructive",
        duration: 3000
      })
      return
    }
    
    try {
      setAnalyzingFeedback(true)
      setFeedbackMessage(null)
      
      // API-Aufruf zur Live-Analyse
      const response = await fetch('/api/reflections/analyze/live', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: reflectionText,
          title,
          category
        }),
      })
      
      if (!response.ok) {
        throw new Error("Die Analyse konnte nicht durchgeführt werden.")
      }
      
      const data = await response.json()
      
      if (data.success && data.analysis) {
        // KPIs aktualisieren (0-10 Skala zu Prozent konvertieren)
        const convertToPercentage = (value: number) => Math.round(value * 10)
        
      setKPIs([
          { name: "Reflexionstiefe", value: convertToPercentage(data.analysis.kpi_depth), color: "#3b82f6" },
          { name: "Kohärenz", value: convertToPercentage(data.analysis.kpi_coherence), color: "#10b981" },
          { name: "Metakognition", value: convertToPercentage(data.analysis.kpi_metacognition), color: "#8b5cf6" },
          { name: "Handlungsorientierung", value: convertToPercentage(data.analysis.kpi_actionable), color: "#f59e0b" }
      ])
        
        // Feedback-Nachricht setzen
        if (data.analysis.quick_feedback) {
          setFeedbackMessage(data.analysis.quick_feedback)
        }
        
        toast({
          title: "Analyse abgeschlossen",
          description: "Die KI-Analyse wurde erfolgreich durchgeführt.",
          duration: 3000
        })
      }
    } catch (error) {
      console.error("Fehler bei der NLP-Analyse:", error)
      
      toast({
        title: "Analysefehler",
        description: error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setAnalyzingFeedback(false)
    }
  }

  // Update adaptive prompts based on reflection content with enhanced metakognition detection
  useEffect(() => {
    const newPrompts = updateAdaptivePrompts(reflectionText)
    setAdaptivePrompts(newPrompts)
  }, [reflectionText])

  // Verbesserte Metakognition-Analyse im Frontend
  const analyzeMetacognition = (text: string) => {
    // Erweiterte Liste metakognitiver Begriffe
    const metacognitiveTerms = [
      "ich denke", "ich fühle", "ich bemerke", "ich erkenne", "ich verstehe",
      "mir ist aufgefallen", "ich habe gelernt", "ich weiss nun", "ich bin mir bewusst",
      "reflektiere", "bewusstwerden", "nachdenken über", "mein denken", "meine gedanken",
      "selbstreflexion", "mir bewusst", "erkenntnis", "erkannt", "bewusstsein",
      "metakognitiv", "denkprozess", "meine perspektive", "meine sichtweise", "selbstkritisch",
      "hinterfragen", "ich realisiere", "bewusstwerdung", "mental", "kognitiv"
    ];
    
    // Stärkere metakognitive Muster
    const strongMetacognitivePatterns = [
      /über mein(e)?\s+.+\s+nachgedacht/i,
      /selbstreflexion/i,
      /mein(e)?\s+denkprozess(e)?/i,
      /mein(e)?\s+lernprozess(e)?/i,
      /bewusst(er)?\s+geworden/i,
      /metakognitiv/i,
      /reflektiere über/i
    ];
    
    // Zähle exakte Begriffe
    const matches = metacognitiveTerms.filter(term => 
      text.toLowerCase().includes(term.toLowerCase())
    ).length;
    
    // Zähle stärkere Muster
    const strongMatches = strongMetacognitivePatterns.filter(pattern => 
      pattern.test(text.toLowerCase())
    ).length;
    
    // Berechne Score mit verbesserter Gewichtung
    const score = Math.min(matches * 15 + strongMatches * 25, 100);
    
    return score;
  }

  // Completely reimagined feedback UI system based on depth level
  const renderFeedbackUI = () => {
    const feedbackDepth = settings.feedbackDepth || "standard"
    
    // Evaluate the reflection's quality
    const avgScore = KPIs.reduce((sum, kpi) => sum + kpi.value, 0) / KPIs.length || 0
    const qualityLevel = avgScore < 40 ? "low" : avgScore < 70 ? "medium" : "high"
    
    return (
      <div className="space-y-6">
        {/* Analyse-Button für NLP-basierte Ergebnisse */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={analyzeWithNLP}
            disabled={analyzingFeedback || !reflectionText.trim()}
            className="w-full bg-primary/5 border-primary/20 hover:bg-primary/10"
          >
            {analyzingFeedback ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyse läuft...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Mit KI analysieren
              </>
            )}
          </Button>
        </div>
        
        {/* KI-Feedback-Bereich */}
        {feedbackMessage && (
          <div className={`p-3 rounded-md border ${
            qualityLevel === "low" ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30" :
            qualityLevel === "medium" ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/30" :
            "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30"
          }`}>
            <div className={`flex items-center gap-2 ${
              qualityLevel === "low" ? "text-amber-800 dark:text-amber-300" :
              qualityLevel === "medium" ? "text-blue-800 dark:text-blue-300" :
              "text-emerald-800 dark:text-emerald-300"
            }`}>
              {qualityLevel === "low" ? <AlertCircle className="h-4 w-4" /> :
               qualityLevel === "medium" ? <Info className="h-4 w-4" /> :
               <Sparkles className="h-4 w-4" />}
              <p className="text-sm">{feedbackMessage}</p>
            </div>
          </div>
        )}
        
        {/* Feedback entsprechend der ausgewählten Tiefe */}
        {feedbackDepth === "basic" && (
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
              <List className="h-4 w-4 text-primary" />
              Reflexionsqualität: {avgScore < 40 ? "Anfänger" : avgScore < 70 ? "Fortgeschritten" : "Fortgeschritten"}
            </h3>
            
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500" 
                style={{ width: `${avgScore}%` }} 
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Schreiben Sie weiter an Ihrer Reflexion. Die detaillierte Analyse wird nach dem Speichern verfügbar sein.
            </p>
          </div>
        )}
        
        {feedbackDepth === "standard" && (
          <div className="space-y-3">
            {KPIs.map(kpi => (
              <div key={kpi.name} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: kpi.color }}></div>
                    <span className="text-sm font-medium">{kpi.name}</span>
                  </div>
                  <span className="text-sm font-medium">{kpi.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${kpi.value}%`,
                      backgroundColor: kpi.color
                    }} 
                  />
                </div>
              </div>
            ))}
            
            {/* Reflection progress indicator */}
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Gesamtfortschritt</span>
                <span className="text-sm font-semibold">{avgScore.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    qualityLevel === "low" ? "bg-amber-500" :
                    qualityLevel === "medium" ? "bg-blue-500" :
                    "bg-emerald-500"
                  }`}
                  style={{ width: `${avgScore}%` }} 
                />
              </div>
            </div>
          </div>
        )}
        
        {feedbackDepth === "detailed" && (
          <>
            <RadarChart data={KPIs} />
            
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
                          
                          {/* Enhancement tips per dimension */}
                          {kpi.value < 60 && (
                            <div className={`p-2 rounded-sm mt-1 text-xs ${
                              kpi.name === "Reflexionstiefe" ? "bg-blue-50 dark:bg-blue-950/30" :
                              kpi.name === "Kohärenz" ? "bg-amber-50 dark:bg-amber-950/30" :
                              kpi.name === "Metakognition" ? "bg-purple-50 dark:bg-purple-950/30" :
                              "bg-emerald-50 dark:bg-emerald-950/30"
                            }`}>
                              <strong>Tipp:</strong> {
                                kpi.name === "Reflexionstiefe" ? "Fragen Sie sich 'Warum?' und analysieren Sie die Gründe hinter Ereignissen und Reaktionen." :
                                kpi.name === "Kohärenz" ? "Verbinden Sie Ihre Gedanken mit klaren Übergängen und logischen Verbindungen." :
                                kpi.name === "Metakognition" ? "Reflektieren Sie darüber, wie sich Ihr Denken durch diese Erfahrung verändert hat." :
                                "Formulieren Sie konkrete nächste Schritte, die Sie aufgrund Ihrer Erkenntnisse unternehmen werden."
                              }
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
            
            {showTransparency && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border mt-4">
                <div className="flex items-center mb-2">
                  <Info className="h-4 w-4 text-primary mr-2" />
                  <h4 className="text-sm font-medium">KI-Analyse Erklärung</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Diese Analyse nutzt NLP-Algorithmen, um Ihre Reflexion zu bewerten.
                  Die vier Dimensionen werden anhand linguistischer Muster und semantischer Strukturen gemessen.
                </p>
              </div>
            )}
            
            {/* Reflexionsebenen-Status */}
            <div className="p-3 rounded-lg border border-border bg-muted/20">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4 text-primary" />
                Reflexionsebene
              </h3>
              
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  avgScore < 40 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" :
                  avgScore < 70 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" :
                  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                }`}>
                  {avgScore < 40 ? "Beschreibend" : avgScore < 70 ? "Analytisch" : "Kritisch"}
                </div>
                
                <span className="text-xs text-muted-foreground">basierend auf Moon's Reflexionsmodell</span>
              </div>
              
              <div className="grid grid-cols-3 gap-1">
                <div className={`px-1 py-0.5 text-center text-xs rounded ${avgScore < 40 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" : "bg-muted/50 text-muted-foreground"}`}>
                  Beschreibend
                </div>
                <div className={`px-1 py-0.5 text-center text-xs rounded ${avgScore >= 40 && avgScore < 70 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" : "bg-muted/50 text-muted-foreground"}`}>
                  Analytisch
                </div>
                <div className={`px-1 py-0.5 text-center text-xs rounded ${avgScore >= 70 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-muted/50 text-muted-foreground"}`}>
                  Kritisch
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <RequireAuth>
      <form onSubmit={saveReflection} className="overflow-auto h-full">
        {/* Header mit verbessertem Feedback-Tiefe-Schalter */}
        <div className="border-b bg-background">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/reflections" className="hover:text-foreground">
                  Reflexionen
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Neue Reflexion</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 border rounded-lg p-0.5 pl-2 bg-background">
                <Label htmlFor="feedback-depth" className="text-xs font-medium whitespace-nowrap">
                  Feedback-Tiefe:
                </Label>
                      <Select 
                        value={settings.feedbackDepth} 
                        onValueChange={handleFeedbackDepthChange}
                      >
                  <SelectTrigger className="h-8 min-h-8 border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="Standard" />
                        </SelectTrigger>
                  <SelectContent align="end" side="bottom" avoidCollisions={true}>
                    <SelectItem value="basic" className="text-sm">
                      <div className="flex items-center gap-2">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Einfach</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="standard" className="text-sm">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Standard</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="detailed" className="text-sm">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Detailliert</span>
                      </div>
                    </SelectItem>
                        </SelectContent>
                      </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={showTransparency} 
                  onCheckedChange={setShowTransparency}
                  aria-label="Transparenz-Modus umschalten"
                />
                <Label htmlFor="transparency" className="text-sm">Details</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-6">
          {/* Title input and actions */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="title" className="text-base font-medium mb-2 block">Titel der Reflexion</Label>
              <Input 
                id="title"
                placeholder="Geben Sie einen aussagekräftigen Titel ein..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="flex items-center space-x-2 mt-8">
              <Button variant="outline" type="button" onClick={() => router.push('/reflections')}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Speichern
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Show error message if any */}
          {errorMessage && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}
          
          {/* Additional settings */}
          <div className="mb-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">Kategorie</Label>
              <Select 
                value={category} 
                onValueChange={setCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kategorie wählen" />
                </SelectTrigger>
                <SelectContent>
                  <div className="flex justify-between items-center px-2 pt-1.5 pb-2 mb-1 border-b">
                    <span className="text-xs text-muted-foreground">Wählen Sie eine Kategorie für Ihre Reflexion</span>
            </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SelectItem value="Allgemein" className="cursor-help">Allgemein</SelectItem>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Für allgemeine Reflexionen, die keiner spezifischen Kategorie entsprechen.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SelectItem value="Beruf" className="cursor-help">Beruf</SelectItem>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Reflexionen über Erfahrungen, Herausforderungen und Erkenntnisse im Berufsleben.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                        <SelectItem value="Ausbildung" className="cursor-help">Ausbildung</SelectItem>
                        </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Reflexionen über Ausbildungsphase, Lehre oder Berufsausbildung.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                        <SelectItem value="Studium" className="cursor-help">Studium</SelectItem>
                            </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Reflexionen über akademische Erfahrungen, Kurse und Lernprozesse.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                  
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                        <SelectItem value="Persönlich" className="cursor-help">Persönlich</SelectItem>
                        </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Private Reflexionen über persönliche Erfahrungen und Entwicklungen.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                        <SelectItem value="Selbstentwicklung" className="cursor-help">Selbstentwicklung</SelectItem>
                              </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Reflexionen über persönliches Wachstum, neue Fähigkeiten und Selbstverbesserung.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SelectItem value="Projekterfahrung" className="cursor-help">Projekterfahrung</SelectItem>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Reflexionen über die Arbeit an spezifischen Projekten und deren Ergebnissen.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SelectItem value="Teamarbeit" className="cursor-help">Teamarbeit</SelectItem>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Reflexionen über Zusammenarbeit, Gruppenprozesse und Kommunikation im Team.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                        <SelectItem value="Führung" className="cursor-help">Führung</SelectItem>
                            </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Reflexionen über Führungserfahrungen, Mentoring oder Leitung von Teams.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                  
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                        <SelectItem value="Lernen" className="cursor-help">Lernen</SelectItem>
                                </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Reflexionen über Lernprozesse, neue Erkenntnisse und Wissenserwerb.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                  
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                        <SelectItem value="Herausforderung" className="cursor-help">Herausforderung</SelectItem>
                            </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Reflexionen über das Überwinden von Schwierigkeiten und Bewältigen von Problemen.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                  
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                        <SelectItem value="Erfolg" className="cursor-help">Erfolg</SelectItem>
                                </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[260px]">
                        <p className="text-xs">Reflexionen über Erfolge, Errungenschaften und positive Ergebnisse.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Die Kategorie ermöglicht eine bessere Organisation und präzisere KI-Analysen Ihrer Reflexionen.
              </p>
                          </div>
                        </div>
          
          {/* Main Content */}
          <div className="py-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Reflexionsformular */}
              <Card className="shadow-md">
                <CardHeader className="border-b pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <CardTitle>Reflexion schreiben</CardTitle>
                    </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full cursor-help">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>KI-Analyse</span>
                          </div>
                                </TooltipTrigger>
                                <TooltipContent align="end" className="max-w-xs">
                          <p className="text-xs">Das System analysiert Ihren Text und bietet personalisiertes Feedback sowie hilfreiche Fragen für die Reflexion.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <Label htmlFor="reflection">Reflexion</Label>
                    <Textarea
                      id="reflection"
                      placeholder="Beschreiben Sie Ihre Erfahrungen und Erkenntnisse..."
                      className="min-h-[300px] resize-none"
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                    />
                          </div>
                          
                  {/* Hilfreiche Fragen als separate Karte */}
                  <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50 mt-4">
                    <CardHeader className="p-3 pb-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <CardTitle className="text-sm">Hilfreiche Fragen</CardTitle>
                                  </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={refreshAdaptivePrompts}
                          disabled={refreshingQuestions || !reflectionText.trim()}
                          className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-100"
                        >
                          {refreshingQuestions ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3 mr-1" />
                          )}
                          {refreshingQuestions ? "Aktualisiere..." : "Aktualisieren"}
                        </Button>
                              </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      {adaptivePrompts.length > 0 ? (
                        <ul className="space-y-2">
                          {adaptivePrompts.map((prompt, index) => (
                            <li key={index} className="text-sm text-blue-800 dark:text-blue-200 pl-4 relative">
                              <span className="absolute left-0 top-2 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                              {prompt}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Beginnen Sie mit dem Schreiben, um personalisierte Fragen zu erhalten.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="mt-4 flex justify-end">
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Speichern...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Reflexion speichern
                        </>
                                )}
                    </Button>
                              </div>
                </CardContent>
              </Card>

              {/* KI-Analyse Card */}
              <Card className="shadow-md">
                <CardHeader className="border-b pb-3">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <CardTitle>KI-Feedback</CardTitle>
                        </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {renderFeedbackUI()}
                  </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </form>
    </RequireAuth>
  )
} 