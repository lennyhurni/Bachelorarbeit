"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { 
  Brain, 
  Target, 
  LineChart, 
  Calendar, 
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Sparkles,
  Lightbulb,
  Zap,
  BarChart,
  BookOpen,
  Info,
  HelpCircle,
  ArrowRight,
  MessageSquare,
  FileText,
  AlertCircle,
  Lock
} from "lucide-react"
import { useState } from "react"
import { TransparencyInfo, TransparencyInfoGroup } from "@/components/transparency-info"

// Radar chart component for KPIs visualization - completely redesigned
const RadarChart = ({ data }: { data: { name: string, value: number, color: string }[] }) => {
  // Create shortened versions of dimension names for radar chart
  const dimensionLabels: Record<string, string> = {
    "Reflexionstiefe": "Tiefe",
    "Kohärenz": "Kohärenz",
    "Metakognition": "Meta",
    "Handlungsorientierung": "Handlung"
  };
  
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
      
      {/* KPI points with enhanced hover effect */}
      {data.map((kpi, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        const radius = (kpi.value / 100) * 42; // Slightly reduced for better layout
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <div key={kpi.name} className="absolute" style={{
            top: `calc(50% - ${y}%)`,
            left: `calc(50% + ${x}%)`,
            transform: 'translate(-50%, -50%)'
          }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="w-3 h-3 rounded-full cursor-help transition-all duration-200 hover:scale-150 hover:ring-2 ring-offset-2 ring-offset-background ring-primary/30" 
                    style={{ backgroundColor: kpi.color }}
                  ></div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm max-w-xs">
                    <span className="font-medium">{kpi.name}:</span> {kpi.value}%
                    <p className="text-xs text-muted-foreground mt-1">
                      {kpi.name === "Reflexionstiefe" && "Misst, wie tiefgehend Sie über Erfahrungen reflektieren - von beschreibend bis kritisch."}
                      {kpi.name === "Kohärenz" && "Bewertet die Klarheit und logische Struktur Ihres Textes."}
                      {kpi.name === "Metakognition" && "Erfasst, wie sehr Sie Ihr eigenes Denken reflektieren und analysieren."}
                      {kpi.name === "Handlungsorientierung" && "Bewertet, ob Sie konkrete nächste Schritte oder Anwendungsmöglichkeiten formulieren."}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      })}
      
      {/* Improved label positioning with better spacing - moved outside chart area */}
      {data.map((kpi, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        const radius = 52; // Fixed position outside the data points
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        // Enhanced label with badge-like style for better readability
        return (
          <div 
            key={`label-${kpi.name}`} 
            className="absolute py-0.5 px-1.5 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium border border-border/30 shadow-sm" 
            style={{
              top: `calc(50% - ${y}%)`,
              left: `calc(50% + ${x}%)`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: kpi.color }}></div>
              <span>{dimensionLabels[kpi.name] || kpi.name}</span>
            </div>
          </div>
        )
      })}
      
      {/* Connecting lines between points with subtle fade effect */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
        <polygon 
          points={data.map((kpi, index) => {
            const angle = (Math.PI * 2 * index) / data.length;
            const radius = (kpi.value / 100) * 42; // Match the point positioning
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            return `${x},${y}`;
          }).join(' ')}
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeDasharray="0"
          strokeOpacity="0.6"
        />
      </svg>
      
      {/* Central KPI summary for quick overview */}
      <div className="absolute flex flex-col items-center justify-center rounded-full bg-muted/40 backdrop-blur-sm border border-border/20 w-16 h-16 shadow-sm">
        <span className="text-lg font-bold">
          {Math.round(data.reduce((sum, kpi) => sum + kpi.value, 0) / data.length)}%
        </span>
        <span className="text-[10px] text-muted-foreground leading-none">Gesamt</span>
      </div>
    </div>
  )
}

export default function AdaptiveDashboard() {
  // Beispiel KPI-Daten
  const kpiData = [
    { name: "Reflexionstiefe", value: 78, color: "#3b82f6" },
    { name: "Kohärenz", value: 65, color: "#10b981" },
    { name: "Metakognition", value: 89, color: "#8b5cf6" },
    { name: "Handlungsorientierung", value: 72, color: "#f59e0b" }
  ]
  
  // Beispiel für vergangene Reflexionen mit detaillierten KPIs
  const pastReflections = [
    { 
      id: 1, 
      title: "JavaScript Fortgeschrittene Konzepte", 
      date: "18. März 2024", 
      kpis: {
        depth: 85,
        coherence: 70,
        metacognition: 90,
        actionable: 65
      },
      snippet: "Ich erkenne nun, dass Closures ein entscheidendes Konzept in JavaScript sind. Durch ihre Verwendung kann ich..." 
    },
    { 
      id: 2, 
      title: "Projektmanagement-Methoden", 
      date: "12. März 2024", 
      kpis: {
        depth: 75,
        coherence: 80,
        metacognition: 65,
        actionable: 90
      },
      snippet: "Nach dem Vergleich verschiedener Methoden verstehe ich die Vorteile von Kanban für unser Team. Zukünftig werde ich..." 
    },
    { 
      id: 3, 
      title: "Effektive Teamkommunikation", 
      date: "7. März 2024", 
      kpis: {
        depth: 95,
        coherence: 85,
        metacognition: 88,
        actionable: 92
      },
      snippet: "Mir ist aufgefallen, dass meine Kommunikation oft zu vage ist. Ich habe erkannt, dass präzise Ausdrucksweise und aktives Zuhören..." 
    }
  ]

  // Beispiel für adaptive KI-Vorschläge
  const aiSuggestions = [
    {
      title: "Reflexionstiefe verbessern",
      description: "Ihre analytischen Fähigkeiten entwickeln sich gut, könnten aber durch tiefere Ursachenanalyse verstärkt werden.",
      icon: Brain,
      details: "Basierend auf der Analyse Ihrer letzten 5 Reflexionen fehlen teilweise tiefergehende Ursachenanalysen. Versuchen Sie häufiger 'Warum'-Fragen zu stellen.",
    },
    {
      title: "Handlungsorientierung verstärken",
      description: "Formulieren Sie in Ihren nächsten Reflexionen konkretere Aktionsschritte für die praktische Anwendung.",
      icon: Target,
      details: "In 70% Ihrer Reflexionen beschreiben Sie Erkenntnisse ohne spezifische Aktionsschritte. Die konkrete Formulierung nächster Schritte erhöht die Wahrscheinlichkeit der Umsetzung.",
    },
    {
      title: "Metakognitive Phrasen ausbauen",
      description: "Nutzen Sie häufiger Ausdrücke wie 'Ich erkenne...' oder 'Mir wird bewusst...' für stärkere Selbstreflexion.",
      icon: Lightbulb,
      details: "Ihre metakognitiven Ausdrücke erhöhten sich bereits um 40% in den letzten 3 Monaten. Mehr selbstreflektierende Formulierungen können diesen Wert weiter verbessern.",
    }
  ]

  // Zeitliche Entwicklung der KPIs
  const kpiTrends = {
    labels: ["Jan", "Feb", "März", "April"],
    datasets: [
      {
        name: "Reflexionstiefe",
        data: [45, 58, 65, 78],
        color: "#3b82f6"
      },
      {
        name: "Kohärenz",
        data: [50, 55, 60, 65],
        color: "#10b981"
      },
      {
        name: "Metakognition",
        data: [60, 72, 78, 89],
        color: "#8b5cf6"
      },
      {
        name: "Handlungsorientierung",
        data: [40, 52, 65, 72],
        color: "#f59e0b"
      }
    ]
  }

  // Neuer Toggle-State für "Transparenz aktivieren"
  const [showSystemInfo, setShowSystemInfo] = useState(true)

  return (
    <div className="overflow-auto" style={{ height: '100%' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">KI-Dashboard</h1>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-full text-xs">
              <Info className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">KI-gestützte Analyse aktiv</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-1">
                      <HelpCircle className="h-3 w-3 text-blue-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent align="end" className="max-w-xs">
                    <div>
                      <p className="text-xs font-medium mb-1">Über die KI-Analyse</p>
                      <p className="text-xs">Dieses Dashboard verwendet NLP (Natural Language Processing) Algorithmen, um Ihre Reflexionen automatisch zu analysieren und Ihnen personalisierte Einblicke zu geben.</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                checked={showSystemInfo} 
                onCheckedChange={setShowSystemInfo}
                aria-label="Transparenz-Modus umschalten"
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <Link href="/adaptive/reflections/new">
              <Button className="gap-2 hover:bg-primary/90 transition-colors">
                <Sparkles className="h-4 w-4" />
                Neue KI-Reflexion
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI-Karten */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-1">
                <CardTitle className="text-sm font-medium">Reflexionen</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">Gesamtzahl der von Ihnen erstellten Reflexionen mit diesem intelligenten Dashboard.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                +3 seit letztem Monat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-1">
                <CardTitle className="text-sm font-medium">Durchschnittliche KPI</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div>
                        <p className="text-xs font-medium mb-1">KPI-Durchschnittswert</p>
                        <p className="text-xs">Durchschnitt aller vier Haupt-KPIs (Reflexionstiefe, Kohärenz, Metakognition und Handlungsorientierung).</p>
                        {showSystemInfo && (
                          <div className="mt-1 pt-1 border-t border-border">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              <span>Berechnet durch gewichteten Durchschnitt mit ML-Analysemodell</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-muted-foreground">
                +8% seit letztem Monat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-1">
                <CardTitle className="text-sm font-medium">Lernfortschritt</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div>
                        <p className="text-xs font-medium mb-1">Wie wird der Lernfortschritt gemessen?</p>
                        <p className="text-xs">Diese Metrik berechnet, wie sehr sich Ihre Reflexionsfähigkeiten und die Tiefe Ihrer Einsichten im Zeitverlauf verbessert haben.</p>
                        {showSystemInfo && (
                          <div className="mt-1 pt-1 border-t border-border">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              <span>Basiert auf Vergleich der Reflexionen der letzten 30 Tage</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                +12% im Vergleich zum Vormonat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-1">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div>
                        <p className="text-xs font-medium mb-1">Engagement-Score</p>
                        <p className="text-xs">Misst Ihre Konsistenz bei Reflexionen, die Tiefe der Beteiligung und die Häufigkeit im Vergleich zu Ihren Zielen.</p>
                        {showSystemInfo && (
                          <div className="mt-1 pt-1 border-t border-border">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              <span>Berechnet durch Kombination aus Häufigkeit, Länge und Interaktionen</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <div className="flex items-center mt-1">
                <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-0">
                  Sehr gut
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hauptinhalt: 2-Spalten-Layout */}
        <div className="grid gap-6 md:grid-cols-7">
          {/* KPI-Radar-Chart (grösser) */}
          <Card className="md:col-span-4">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <LineChart className="h-5 w-5 text-primary" />
                  <CardTitle>Reflexions-KPIs</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent align="end" className="max-w-xs">
                        <div>
                          <p className="text-xs font-medium mb-1">Multidimensionale KPIs</p>
                          <p className="text-xs">Die Spinnennetzdarstellung zeigt Ihre Performance in vier Schlüsselbereichen reflektiven Denkens. Je weiter aussen ein Punkt, desto besser Ihre Leistung in diesem Bereich.</p>
                          {showSystemInfo && (
                            <div className="mt-1 pt-1 border-t border-border text-muted-foreground">
                              <p className="text-xs">Berechnungsmethode: NLP-Algorithmen analysieren Ihre Texte nach linguistischen Mustern, um jede Dimension zu bewerten.</p>
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {showSystemInfo && (
                  <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
                    BERT+GPT-Hybridmodell
                  </Badge>
                )}
              </div>
              <CardDescription>
                Multidimensionale Analyse Ihrer Reflexionsqualität
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Radar Chart */}
                <RadarChart data={kpiData} />
                
                {/* KPIs Legend */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {kpiData.map(kpi => (
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
                              {showSystemInfo && (
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
            <CardFooter className="border-t p-4 flex flex-col">
              <div className="flex items-center gap-1 text-sm">
                <Info className="h-4 w-4 text-primary" />
                <span className="font-medium">Über diese Analyse</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Diese multidimensionale Analyse basiert auf NLP-Algorithmen, die Ihre Reflexionstexte nach verschiedenen Qualitätsdimensionen bewerten.
              </p>
              {showSystemInfo && (
                <div className="mt-2">
                  <TransparencyInfo
                    icon="lock"
                    variant="muted"
                    title="Systeminformationen"
                    description="Verwendete Technologien: Transformerbasierte Textanalyse, linguistische Musterkennung und Sentiment-Analyse für die Bewertung von Reflexionsinhalten."
                  />
                </div>
              )}
            </CardFooter>
          </Card>

          {/* KI-Empfehlungen */}
          <Card className="md:col-span-3">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <CardTitle>KI-Empfehlungen</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent align="end" className="max-w-xs">
                        <div>
                          <p className="text-xs font-medium mb-1">Personalisierte KI-Vorschläge</p>
                          <p className="text-xs">Diese Empfehlungen werden automatisch auf Basis Ihrer Reflexions-Historie generiert. Sie sollen Ihre Fähigkeiten gezielt weiterentwickeln.</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {showSystemInfo && (
                  <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800">
                    Adaptive Empfehlungen
                  </Badge>
                )}
              </div>
              <CardDescription>
                Personalisierte Vorschläge zur Verbesserung
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="mt-0.5">
                      <suggestion.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h3 className="text-sm font-medium underline decoration-dotted decoration-muted-foreground underline-offset-2 cursor-help">{suggestion.title}</h3>
                          </TooltipTrigger>
                          <TooltipContent align="center" className="max-w-xs">
                            <div>
                              {showSystemInfo ? (
                                <>
                                  <p className="text-xs font-medium mb-1">KI-Empfehlungsgrundlage</p>
                                  <p className="text-xs">{suggestion.details}</p>
                                </>
                              ) : (
                                <p className="text-xs">Basierend auf der Analyse Ihrer Reflexions-Historie.</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-3 pb-1">
                  <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
                          Nächster Schritt vorgeschlagen
                          {showSystemInfo && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent align="center" className="max-w-xs">
                                  <p className="text-xs">Diese Empfehlung basiert auf der Analyse Ihrer Lernziele und aktuellen Projektfortschritte, die in Ihren Reflexionen erwähnt wurden.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Reflektieren Sie über Ihren Lernfortschritt im aktuellen Projekt und setzen Sie neue Ziele.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zeitliche Entwicklung */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  <CardTitle>KPI-Entwicklung über Zeit</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent align="end" className="max-w-xs">
                        <div>
                          <p className="text-xs font-medium mb-1">Zeitliche Analyse</p>
                          <p className="text-xs">Diese Visualisierung zeigt die Entwicklung Ihrer KPIs über die letzten Monate und hilft bei der Erkennung von Trends und Fortschritten.</p>
                          {showSystemInfo && (
                            <div className="mt-1 pt-1 border-t border-muted text-muted-foreground">
                              <p className="text-xs">Die Trends werden durch Vergleich der Durchschnittswerte Ihrer monatlichen Reflexionen berechnet.</p>
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <CardDescription>
                Ihre Fortschritte der letzten Monate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {kpiTrends.labels.map((month, monthIndex) => (
                  <div key={month} className="flex flex-col gap-2">
                    <div className="text-sm font-medium text-center">{month}</div>
                    {kpiTrends.datasets.map(dataset => (
                      <div key={`${month}-${dataset.name}`} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dataset.color }}></div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">{dataset.data[monthIndex]}%</span>
                              </TooltipTrigger>
                              <TooltipContent align="center" className="max-w-xs">
                                <div>
                                  <p className="text-xs font-medium">{dataset.name}: {dataset.data[monthIndex]}%</p>
                                  <p className="text-xs text-muted-foreground">
                                    {monthIndex > 0 ? 
                                      `${dataset.data[monthIndex] > dataset.data[monthIndex-1] ? '+' : ''}${dataset.data[monthIndex] - dataset.data[monthIndex-1]}% im Vergleich zum Vormonat` : 
                                      'Ausgangswert'
                                    }
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Progress value={dataset.data[monthIndex]} className="h-1" style={{ backgroundColor: `${dataset.color}20` }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 border-t pt-4 mt-2">
                {kpiTrends.datasets.map(dataset => (
                  <div key={dataset.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dataset.color }}></div>
                    <span className="text-xs">{dataset.name}</span>
                  </div>
                ))}
              </div>
              {showSystemInfo && (
                <div className="border-t mt-4 pt-3 text-xs text-muted-foreground flex items-start gap-1">
                  <Info className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>Die Trendanalyse basiert auf der automatischen Bewertung Ihrer Reflexionen durch NLP-Algorithmen. Sie berücksichtigt sowohl quantitative (Anzahl, Länge) als auch qualitative Faktoren (Inhalt, Struktur).</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Letzte Reflexionen mit KPIs */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Letzte Reflexionen mit KPI-Analyse</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent align="end" className="max-w-xs">
                        <div>
                          <p className="text-xs font-medium mb-1">Reflexionsanalyse</p>
                          <p className="text-xs">Jede Ihrer Reflexionen wird automatisch anhand mehrerer Dimensionen bewertet. Die detaillierte KPI-Ansicht hilft Ihnen zu verstehen, wo Ihre Stärken liegen.</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <CardDescription>
                Detaillierte Metriken zu Ihren neuesten Reflexionen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {pastReflections.map(reflection => (
                  <div 
                    key={reflection.id} 
                    className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{reflection.title}</h3>
                        <p className="text-sm text-muted-foreground">{reflection.date}</p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 cursor-help">
                              KPI-Score: {Math.round((reflection.kpis.depth + reflection.kpis.coherence + 
                                reflection.kpis.metacognition + reflection.kpis.actionable) / 4)}%
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent align="end" className="max-w-xs">
                            <div>
                              <p className="text-xs font-medium">Gesamt-KPI-Score</p>
                              <p className="text-xs text-muted-foreground">Durchschnitt aller vier Haupt-KPIs dieser Reflexion.</p>
                              {showSystemInfo && (
                                <div className="mt-1 pt-1 border-t border-muted text-muted-foreground">
                                  <p className="text-xs flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    <span>Berechnet durch: {
                                      reflection.kpis.depth ? "Analyse kausaler Ausdrücke, kritischer Phrasen und Text-Komplexitätsmetriken." :
                                      reflection.kpis.coherence ? "Analyse von Satzübergängen, thematischer Konsistenz und Textfluss." :
                                      reflection.kpis.metacognition ? "Identifikation selbstreflexiver Ausdrücke und Muster des 'Denkens über das Denken'." :
                                      "Erkennung konkreter Aktionspläne, Vorhaben und zukünftiger Anwendungen."
                                    }</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{reflection.snippet}</p>
                    
                    <div className="grid grid-cols-4 gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Tiefe</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2">
                                  {reflection.kpis.depth}%
                                </span>
                              </TooltipTrigger>
                              <TooltipContent align="center" className="max-w-xs">
                                <div>
                                  <p className="text-xs">Misst, wie tiefgehend Sie über Erfahrungen reflektieren.</p>
                                  {showSystemInfo && (
                                    <div className="mt-1 pt-1 border-t border-muted">
                                      <p className="text-xs text-muted-foreground">Berechnet durch Analyse von Textlänge, kausalen Ausdrücken, und kritischem Denken.</p>
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Progress value={reflection.kpis.depth} className="h-1 bg-blue-100" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Kohärenz</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2">
                                  {reflection.kpis.coherence}%
                                </span>
                              </TooltipTrigger>
                              <TooltipContent align="center" className="max-w-xs">
                                <div>
                                  <p className="text-xs">Bewertet die Klarheit und logische Struktur Ihres Textes.</p>
                                  {showSystemInfo && (
                                    <div className="mt-1 pt-1 border-t border-muted">
                                      <p className="text-xs text-muted-foreground">Berechnet durch Analyse von Textstruktur, Übergängen und Satzlängen-Variation.</p>
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Progress value={reflection.kpis.coherence} className="h-1 bg-green-100" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Metakognition</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2">
                                  {reflection.kpis.metacognition}%
                                </span>
                              </TooltipTrigger>
                              <TooltipContent align="center" className="max-w-xs">
                                <div>
                                  <p className="text-xs">Erfasst, wie sehr Sie Ihr eigenes Denken reflektieren.</p>
                                  {showSystemInfo && (
                                    <div className="mt-1 pt-1 border-t border-muted">
                                      <p className="text-xs text-muted-foreground">Berechnet durch Erkennung metakognitiver Phrasen wie "Ich erkenne...", "Mir wird bewusst...".</p>
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Progress value={reflection.kpis.metacognition} className="h-1 bg-purple-100" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Handlung</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2">
                                  {reflection.kpis.actionable}%
                                </span>
                              </TooltipTrigger>
                              <TooltipContent align="center" className="max-w-xs">
                                <div>
                                  <p className="text-xs">Bewertet, ob Sie konkrete nächste Schritte formulieren.</p>
                                  {showSystemInfo && (
                                    <div className="mt-1 pt-1 border-t border-muted">
                                      <p className="text-xs text-muted-foreground">Berechnet durch Erkennung von handlungsorientierten Phrasen und konkreten Plänen.</p>
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Progress value={reflection.kpis.actionable} className="h-1 bg-orange-100" />
                      </div>
                    </div>
                    
                    {showSystemInfo && (
                      <div className="mt-3 pt-2 border-t border-muted/60 text-xs text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>Analysiert mit BERT-basiertem Algorithmus (Konfidenzscore: 89%)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 