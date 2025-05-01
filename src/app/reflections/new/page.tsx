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
import { createClient } from "@/utils/supabase/client"
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
  const supabase = createClient()
  const { toast } = useToast()
  
  // Add settings hook
  const { settings, updateSetting } = useUserSettings()
  
  // Add helper function for tooltip content based on feedback depth
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
      "Welche Erkenntnisse über sich haben Sie gewonnen?"
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
          <div className="space-y-4">
            {/* Sehr einfache KI-Bewertung - deutlich reduziert */}
            <div className="p-4 border rounded-lg flex flex-col items-center">
              <div className="flex items-center justify-center mb-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  !KPIs[0].value ? "bg-muted text-muted-foreground" :
                  avgScore < 40 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" :
                  avgScore < 70 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" :
                  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                }`}>
                  {!KPIs[0].value ? "Noch nicht analysiert" :
                   avgScore < 40 ? "Beschreibend" :
                   avgScore < 70 ? "Analytisch" :
                   "Kritisch"}
                </div>
              </div>
              
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    !KPIs[0].value ? "w-0" :
                    avgScore < 40 ? "bg-amber-500 dark:bg-amber-500/70" : 
                    avgScore < 70 ? "bg-blue-500 dark:bg-blue-500/70" : 
                    "bg-emerald-500 dark:bg-emerald-500/70"
                  }`}
                  style={{ width: KPIs[0].value ? `${avgScore}%` : '0%' }} 
                />
              </div>
              
              {!KPIs[0].value ? (
                <p className="text-sm text-center text-muted-foreground">
                  Klicke auf "Mit KI analysieren", um Feedback zu erhalten.
                </p>
              ) : (
                <p className="text-sm text-center">
                  {avgScore < 40 ? "Deine Reflexion ist überwiegend beschreibend." : 
                   avgScore < 70 ? "Deine Reflexion zeigt gute analytische Elemente." : 
                   "Deine Reflexion erreicht ein kritisch-reflektierendes Niveau."}
                </p>
              )}
            </div>

            {/* Nur zeigen, wenn bereits analysiert wurde */}
            {KPIs[0].value > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Wichtigster Verbesserungstipp
                </h3>
                
                <p className="text-sm">
                  {avgScore < 40 ? 
                    "Gehe über die reine Beschreibung hinaus - frage dich öfter \"Warum?\"" : 
                   avgScore < 70 ? 
                    "Betrachte die Situation aus verschiedenen Perspektiven" : 
                    "Verknüpfe deine Reflexion mit theoretischen Konzepten"}
                </p>
              </div>
            )}
          </div>
        )}
        
        {feedbackDepth === "standard" && (
          <div className="space-y-4">
            {/* Erweitertes Standard-Feedback mit besseren Erklärungen */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  Reflexionsebene
                </h3>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  avgScore < 40 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" :
                  avgScore < 70 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300" :
                  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                }`}>
                  {avgScore < 40 ? "Beschreibend" : avgScore < 70 ? "Analytisch" : "Kritisch"}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {avgScore < 40 ? 
                  "Deine Reflexion ist überwiegend beschreibend - du erklärst, was passiert ist, aber analysierst weniger die tieferen Gründe oder Bedeutungen." : 
                avgScore < 70 ? 
                  "Deine Reflexion ist analytisch - du untersuchst Ursachen und Zusammenhänge und bietest Erklärungen für das Geschehene." : 
                  "Deine Reflexion ist kritisch - du betrachtest das Thema aus verschiedenen Blickwinkeln, hinterfragst Annahmen und ziehst tiefere Schlüsse."}
              </p>
            </div>

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
                  <p className="text-xs text-muted-foreground">
                    {kpi.name === "Reflexionstiefe" && 
                      (kpi.value < 40 ? 
                        "Hauptsächlich beschreibend, wenig Analyse" : 
                      kpi.value < 70 ? 
                        "Gute Analyse der Situation und Ursachen" : 
                        "Tiefgehende Betrachtung mit mehreren Ebenen")}
                    
                    {kpi.name === "Kohärenz" && 
                      (kpi.value < 40 ? 
                        "Die Struktur könnte klarer sein" : 
                      kpi.value < 70 ? 
                        "Gut strukturiert mit logischem Aufbau" : 
                        "Exzellente Struktur mit klarem rotem Faden")}
                    
                    {kpi.name === "Metakognition" && 
                      (kpi.value < 40 ? 
                        "Wenig Reflexion über eigene Denkprozesse" : 
                      kpi.value < 70 ? 
                        "Gute Betrachtung eigener Denkmuster" : 
                        "Tiefe Erkundung eigener Denkweisen und Annahmen")}
                    
                    {kpi.name === "Handlungsorientierung" && 
                      (kpi.value < 40 ? 
                        "Wenig konkrete Schlussfolgerungen" : 
                      kpi.value < 70 ? 
                        "Einige praktische Erkenntnisse vorhanden" : 
                        "Klare, umsetzbare Handlungsschritte abgeleitet")}
                  </p>
                </div>
              ))}
            </div>
            
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
            
            {/* Erweiterte Tipps */}
            <div className={`p-3 rounded-md border mt-4 ${
              qualityLevel === "low" ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10" :
              qualityLevel === "medium" ? "border-blue-200 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-950/10" :
              "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/10"
            }`}>
              <h3 className="text-sm font-medium mb-1.5">So kannst du deine Reflexion verbessern:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {avgScore < 40 && (
                  <>
                    <li className="flex items-start gap-1.5">
                      <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-amber-500" />
                      <span>Stelle öfter die Frage "Warum?" statt nur "Was?"</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-amber-500" />
                      <span>Verbinde die Erfahrung mit deinen Gefühlen und Gedanken</span>
                    </li>
                  </>
                )}
                
                {avgScore >= 40 && avgScore < 70 && (
                  <>
                    <li className="flex items-start gap-1.5">
                      <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-blue-500" />
                      <span>Betrachte die Situation aus anderen Perspektiven</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-blue-500" />
                      <span>Verknüpfe deine Erkenntnisse stärker mit konkreten Handlungsschritten</span>
                    </li>
                  </>
                )}
                
                {avgScore >= 70 && (
                  <>
                    <li className="flex items-start gap-1.5">
                      <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-emerald-500" />
                      <span>Verbinde deine Erkenntnisse mit theoretischen Konzepten</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-emerald-500" />
                      <span>Reflektiere tiefer über Veränderungen in deinen Annahmen und Denkweisen</span>
                    </li>
                  </>
                )}
              </ul>
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
                      <TooltipContent side="right" align="start" className="w-72">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            {kpi.name === "Reflexionstiefe" && "Tiefe deiner Analyse"}
                            {kpi.name === "Kohärenz" && "Klarheit & Struktur"}
                            {kpi.name === "Metakognition" && "Reflexion über dein Denken"}
                            {kpi.name === "Handlungsorientierung" && "Konkrete nächste Schritte"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {kpi.name === "Reflexionstiefe" && "Misst, wie tiefgehend du über Erfahrungen reflektierst - von beschreibend bis kritisch-analysierend."}
                            
                            {kpi.name === "Kohärenz" && "Bewertet die Klarheit, logische Struktur und den Zusammenhang in deinem Text."}
                            
                            {kpi.name === "Metakognition" && "Erfasst, wie bewusst du über dein eigenes Denken und deine eigenen Lernprozesse reflektierst."}
                            
                            {kpi.name === "Handlungsorientierung" && "Bewertet, ob du konkrete nächste Schritte oder Anwendungsmöglichkeiten aus deinen Erkenntnissen ableitest."}
                          </p>
                          
                          {/* Verbesserte Tipps bei Werten unter 60% */}
                          {kpi.value < 60 && (
                            <div className={`p-2 mt-2 rounded-md ${
                              qualityLevel === "low" ? "bg-amber-50/70 dark:bg-amber-900/20" :
                              qualityLevel === "medium" ? "bg-blue-50/70 dark:bg-blue-900/20" :
                              "bg-emerald-50/70 dark:bg-emerald-900/20"
                            }`}>
                              <p className="text-xs font-medium mb-1">Tipps zur Verbesserung:</p>
                              {kpi.name === "Reflexionstiefe" && (
                                <ul className="text-xs space-y-1 pl-2">
                                  <li className="flex items-start gap-1.5">
                                    <ArrowRight className="h-3 w-3 mt-px text-amber-500" />
                                    <span>Stelle mehrfach die Frage "Warum?" zu jeder Beobachtung</span>
                                  </li>
                                  <li className="flex items-start gap-1.5">
                                    <ArrowRight className="h-3 w-3 mt-px text-amber-500" />
                                    <span>Betrachte das Thema aus verschiedenen Blickwinkeln</span>
                                  </li>
                                </ul>
                              )}
                              
                              {kpi.name === "Kohärenz" && (
                                <ul className="text-xs space-y-1 pl-2">
                                  <li className="flex items-start gap-1.5">
                                    <ArrowRight className="h-3 w-3 mt-px text-amber-500" />
                                    <span>Strukturiere deinen Text mit Einleitung, Hauptteil und Schluss</span>
                                  </li>
                                  <li className="flex items-start gap-1.5">
                                    <ArrowRight className="h-3 w-3 mt-px text-amber-500" />
                                    <span>Verwende Übergangsphrasen zwischen Absätzen</span>
                                  </li>
                                </ul>
                              )}
                              
                              {kpi.name === "Metakognition" && (
                                <ul className="text-xs space-y-1 pl-2">
                                  <li className="flex items-start gap-1.5">
                                    <ArrowRight className="h-3 w-3 mt-px text-amber-500" />
                                    <span>Reflektiere explizit über deine eigenen Denkprozesse</span>
                                  </li>
                                  <li className="flex items-start gap-1.5">
                                    <ArrowRight className="h-3 w-3 mt-px text-amber-500" />
                                    <span>Beschreibe, wie sich deine Gedanken verändert haben</span>
                                  </li>
                                </ul>
                              )}
                              
                              {kpi.name === "Handlungsorientierung" && (
                                <ul className="text-xs space-y-1 pl-2">
                                  <li className="flex items-start gap-1.5">
                                    <ArrowRight className="h-3 w-3 mt-px text-amber-500" />
                                    <span>Leite konkrete, spezifische Handlungsschritte ab</span>
                                  </li>
                                  <li className="flex items-start gap-1.5">
                                    <ArrowRight className="h-3 w-3 mt-px text-amber-500" />
                                    <span>Beschreibe, wie du das Gelernte anwenden wirst</span>
                                  </li>
                                </ul>
                              )}
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
                  Diese Analyse nutzt NLP-Algorithmen, um deine Reflexion zu bewerten.
                  Die vier Dimensionen werden anhand linguistischer Muster und semantischer Beziehungen gemessen.
                </p>
              </div>
            )}
            
            {/* Vereinfachte Reflexionsebenen-Analyse */}
            <div className="p-4 rounded-lg border border-border bg-muted/20 mt-4">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4 text-primary" />
                Reflexionsebene
              </h3>
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className={`p-2 text-center text-xs rounded border ${
                  avgScore < 40 
                  ? "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800/30" 
                  : "bg-muted/30 text-muted-foreground border-muted/50"
                }`}>
                  <div className="font-medium mb-1">Beschreibend</div>
                  <p className="text-[10px] leading-tight">Was ist passiert?</p>
                </div>
                
                <div className={`p-2 text-center text-xs rounded border ${
                  avgScore >= 40 && avgScore < 70 
                  ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800/30" 
                  : "bg-muted/30 text-muted-foreground border-muted/50"
                }`}>
                  <div className="font-medium mb-1">Analytisch</div>
                  <p className="text-[10px] leading-tight">Warum ist es passiert?</p>
                </div>
                
                <div className={`p-2 text-center text-xs rounded border ${
                  avgScore >= 70 
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800/30" 
                  : "bg-muted/30 text-muted-foreground border-muted/50"
                }`}>
                  <div className="font-medium mb-1">Kritisch</div>
                  <p className="text-[10px] leading-tight">Was bedeutet es?</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p><span className="font-medium">Nächste Entwicklung:</span> {
                  avgScore < 40 
                  ? "Stelle mehr 'Warum'-Fragen, um auf die analytische Ebene zu gelangen." 
                  : avgScore < 70 
                  ? "Betrachte verschiedene Perspektiven für die kritische Ebene."
                  : "Vertiefe deine kritische Reflexion durch theoretische Konzepte."
                }</p>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        {getTooltipContent(
                          "Hier kannst du eine neue Reflexion erstellen und automatisches Feedback erhalten.",
                          "Auf dieser Seite kannst du eine neue Reflexion erstellen und KI-basierte Analysen und Feedback erhalten, um deine Reflexionsfähigkeiten zu verbessern.",
                          "Diese Seite ermöglicht die Erstellung einer neuen Reflexion mit automatisierter KI-Analyse, die deine metakognitiven Prozesse evaluiert und personalisiertes Feedback zu verschiedenen Qualitätsdimensionen wie Tiefe, Kohärenz, Metakognition und Handlungsorientierung bietet."
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {getTooltipContent(
                          "Zeigt mehr Details zur KI-Analyse an.",
                          "Aktiviere diese Option, um detaillierte Informationen zur KI-Analyse und zum Bewertungsprozess anzuzeigen.",
                          "Diese Option zeigt erweiterte Informationen zum algorithmischen Analyseprozess, einschliesslich der verwendeten Kriterien, Gewichtungen und metakognitiven Parameter, die zur Bewertung deiner Reflexion herangezogen werden."
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-6">
          {/* Title input and actions */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="title" className="text-base font-medium block">Titel der Reflexion</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">Ein prägnanter Titel für deine Reflexion, der das Hauptthema zusammenfasst.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="flex items-center gap-2">
                <Label htmlFor="category" className="text-sm font-medium">Kategorie</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {getTooltipContent(
                          "Wähle eine passende Kategorie für deine Reflexion.",
                          "Kategorien helfen dir, deine Reflexionen zu organisieren und Muster in verschiedenen Lebensbereichen zu erkennen.",
                          "Die Kategorisierung deiner Reflexionen ermöglicht eine systematische Analyse deiner Denkmuster über verschiedene Lebensbereiche hinweg und hilft, spezifische Entwicklungstrends in bestimmten Kontexten zu identifizieren."
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p className="text-sm">
                              {getTooltipContent(
                                "Schreib hier deine Reflexion auf.",
                                "Hier kannst du deine Reflexion eingeben. Versuche, tief und kritisch zu reflektieren, um besseres Feedback zu erhalten.",
                                "Eine qualitativ hochwertige Reflexion umfasst typischerweise mehrere Ebenen: (1) Beschreibung der Erfahrung oder Situation, (2) Analyse von Ursachen und Zusammenhängen, (3) Betrachtung eigener Gedanken, Gefühle und mentaler Modelle, (4) kritische Evaluation verschiedener Perspektiven, (5) Herstellung von Verbindungen zu Theorien oder früheren Erfahrungen und (6) Ableitung konkreter Handlungsschritte oder Erkenntnisse."
                              )}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                          <p className="text-xs">
                            {getTooltipContent(
                              "Das System analysiert deinen Text und gibt dir Feedback.",
                              "Das System analysiert deinen Text und bietet personalisiertes Feedback sowie hilfreiche Fragen für die Reflexion.",
                              "Die KI-Analyse verwendet fortschrittliche Textverarbeitungsmethoden, um die Qualität deiner Reflexion in mehreren Dimensionen zu evaluieren und bietet personalisierte Empfehlungen zur Weiterentwicklung."
                            )}
                          </p>
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
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-3.5 w-3.5 text-blue-600/70 dark:text-blue-400/70 ml-1 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">
                                  {getTooltipContent(
                                    "Diese Fragen helfen dir beim Reflektieren.",
                                    "Diese dynamisch generierten Fragen passen sich an den Inhalt deiner Reflexion an, um tiefere Einsichten zu fördern.",
                                    "Diese kontextabhängigen Prompts werden algorithmisch generiert, basierend auf einer Echtzeit-Analyse des Inhalts und der Struktur deiner Reflexion."
                                  )}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={analyzeWithNLP}
                      disabled={!reflectionText || reflectionText.length < 50 || analyzingFeedback}
                      className="gap-2"
                    >
                      {analyzingFeedback ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analysiere...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Feedback erhalten
                        </>
                      )}
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground mx-2 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-sm">
                            {getTooltipContent(
                              "Analysiere deine Reflexion, um Feedback zu erhalten.",
                              "Klicke hier, um eine KI-basierte Analyse deiner Reflexion zu erhalten. Die Analyse bewertet verschiedene Aspekte wie Tiefe, Kohärenz, Metakognition und Handlungsorientierung.",
                              "Die KI-Analyse identifiziert Stärken, Verbesserungspotenziale und bietet personalisierte Empfehlungen zur Weiterentwicklung deiner Reflexionspraxis."
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button type="submit" disabled={submitting} className="gap-2">
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Speichern...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Speichern
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">
                            {getTooltipContent(
                              "Hier siehst du das KI-Feedback zu deiner Reflexion.",
                              "Hier erhältst du detailliertes Feedback zu verschiedenen Aspekten deiner Reflexion, basierend auf KI-Analyse.",
                              "Dieser Bereich zeigt die Ergebnisse der KI-Textanalyse deiner Reflexion, einschliesslich quantitativer Bewertungen verschiedener Qualitätsdimensionen sowie qualitativer Erkenntnisse zu Stärken und Verbesserungspotenzialen."
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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