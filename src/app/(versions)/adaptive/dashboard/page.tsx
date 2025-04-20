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
  Lock,
  Tag,
  PlusCircle,
  Book,
  ClipboardCheck
} from "lucide-react"
import { useState } from "react"
import { TransparencyInfo, TransparencyInfoGroup } from "@/components/transparency-info"

// Radar chart component with further refinements
const RadarChart = ({ 
  data, 
  feedbackDepth = 2,
  showSystemInfo = true
}: { 
  data: { name: string, value: number, color: string }[],
  feedbackDepth?: number,
  showSystemInfo?: boolean 
}) => {
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
                  <KpiExplanationTooltip 
                    kpiName={kpi.name} 
                    value={kpi.value} 
                    feedbackDepth={feedbackDepth}
                    showSystemInfo={showSystemInfo}
                  />
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

// Update KpiExplanationTooltip component to accept feedbackDepth and showSystemInfo as props
const KpiExplanationTooltip = ({ 
  kpiName, 
  value,
  feedbackDepth = 2,
  showSystemInfo = true
}: { 
  kpiName: string, 
  value: number,
  feedbackDepth?: number,
  showSystemInfo?: boolean
}) => {
  // Reference levels to help users understand their performance
  const getPerformanceLevel = (value: number) => {
    if (value >= 90) return { level: "Exzellent", description: "Sie zeigen herausragende Fähigkeiten in diesem Bereich." };
    if (value >= 75) return { level: "Fortgeschritten", description: "Sie haben gute Fähigkeiten entwickelt, mit Potenzial für weitere Verbesserung." };
    if (value >= 60) return { level: "Solide", description: "Sie haben grundlegende Kompetenzen etabliert und sind auf einem guten Weg." };
    if (value >= 40) return { level: "Entwicklungsfähig", description: "Sie zeigen erste Ansätze, die weiter ausgebaut werden können." };
    return { level: "Anfänger", description: "In diesem Bereich gibt es noch viel Raum für Entwicklung." };
  };

  const performanceInfo = getPerformanceLevel(value);
  
  // Educational content for each KPI
  const getEducationalContent = (kpiName: string) => {
    switch(kpiName) {
      case "Reflexionstiefe":
        return {
          what: "Reflexionstiefe misst, wie sehr Sie über die Oberfläche hinaus in tiefere Bedeutungsebenen vordringen.",
          why: "Tiefe Reflexion führt zu nachhaltigeren Lerneffekten und fördert kritisches Denken.",
          how: "Stellen Sie tiefergehende 'Warum'-Fragen, betrachten Sie Situationen aus verschiedenen Perspektiven und verbinden Sie neue Erkenntnisse mit bestehendem Wissen.",
          example: "Statt 'Der Kurs war gut' könnten Sie schreiben: 'Der Kurs hat mir geholfen, die Zusammenhänge zwischen Theorie X und Praxis Y zu verstehen, was meine bisherige Annahme über Z in Frage stellt.'"
        };
      case "Kohärenz":
        return {
          what: "Kohärenz bezeichnet den logischen Zusammenhang und die strukturelle Klarheit Ihrer Reflexion.",
          why: "Kohärente Reflexionen sind leichter zu verstehen und zeigen strukturiertes Denken.",
          how: "Verwenden Sie Überleitungen zwischen Gedanken, strukturieren Sie Ihren Text mit klaren Abschnitten und achten Sie auf einen roten Faden.",
          example: "Verwenden Sie Verbindungswörter wie 'deshalb', 'folglich', 'im Gegensatz dazu', um Zusammenhänge deutlich zu machen."
        };
      case "Metakognition":
        return {
          what: "Metakognition bedeutet 'Denken über das Denken' - die Reflexion Ihrer eigenen Denkprozesse.",
          why: "Metakognitives Bewusstsein ermöglicht tiefere Selbsterkenntnis und fördert selbstgesteuertes Lernen.",
          how: "Beschreiben Sie explizit, wie sich Ihr Verständnis verändert hat, welche Denkfehler Sie erkannt haben oder welche neuen Perspektiven Sie gewonnen haben.",
          example: "Formulierungen wie 'Ich erkenne jetzt, dass...', 'Mir wird bewusst, wie sehr...', 'Ich habe meine Sichtweise geändert, weil...'"
        };
      case "Handlungsorientierung":
        return {
          what: "Handlungsorientierung misst, wie gut Sie Erkenntnisse in konkrete nächste Schritte übersetzen.",
          why: "Ohne konkrete Handlungsschritte bleiben Erkenntnisse oft theoretisch und werden nicht umgesetzt.",
          how: "Formulieren Sie spezifische, messbare und zeitgebundene Aktionsschritte, die aus Ihren Erkenntnissen folgen.",
          example: "Statt 'Ich sollte mehr kommunizieren' besser: 'In den nächsten zwei Meetings werde ich aktiv mindestens drei Beiträge leisten und gezielt nach Feedback fragen.'"
        };
      default:
        return {
          what: "Diese KPI misst einen spezifischen Aspekt Ihrer Reflexionsfähigkeit.",
          why: "Jede Dimension trägt zu einer ganzheitlichen Reflexionskompetenz bei.",
          how: "Sehen Sie sich die detaillierten Empfehlungen an, um in diesem Bereich zu wachsen.",
          example: "Schauen Sie sich Beispiele in den Lernmaterialien an."
        };
    }
  };
  
  const educationalContent = getEducationalContent(kpiName);
  
  // Return different content based on feedback depth
  if (feedbackDepth === 1) {
    // Basic feedback - just the essentials
    return (
      <div className="space-y-1 max-w-xs">
        <div className="flex items-center gap-2">
          <span className="font-medium">{kpiName}:</span> 
          <span className="font-bold">{value}%</span>
        </div>
        <p className="text-xs text-muted-foreground">{performanceInfo.description}</p>
      </div>
    );
  } else if (feedbackDepth === 2) {
    // Standard feedback - essentials plus basic guidance
    return (
      <div className="space-y-2 max-w-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{kpiName}:</span> 
            <span className="font-bold">{value}%</span>
            <Badge variant="outline" className="ml-1 text-[10px]">
              {performanceInfo.level}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{performanceInfo.description}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs"><span className="font-medium">Was ist das?</span> {educationalContent.what}</p>
          <p className="text-xs"><span className="font-medium">Wie verbessern?</span> {educationalContent.how}</p>
        </div>
      </div>
    );
  } else {
    // Expert feedback - comprehensive information
    return (
      <div className="space-y-3 max-w-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{kpiName}:</span> 
            <span className="font-bold">{value}%</span>
            <Badge variant="outline" className="ml-1 text-[10px]">
              {performanceInfo.level}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{performanceInfo.description}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs"><span className="font-medium">Was ist das?</span> {educationalContent.what}</p>
          <p className="text-xs"><span className="font-medium">Warum wichtig?</span> {educationalContent.why}</p>
          <p className="text-xs"><span className="font-medium">Wie verbessern?</span> {educationalContent.how}</p>
          <p className="text-xs"><span className="font-medium">Beispiel:</span> {educationalContent.example}</p>
        </div>
        
        {showSystemInfo && (
          <KpiCalculationExplanation kpiName={kpiName} />
        )}
      </div>
    );
  }
};

// Update the EmotionalSupportMessage component to calculate average value
const EmotionalSupportMessage = ({ kpiData }: { kpiData: { name: string, value: number, color: string }[] }) => {
  // Calculate average value for summary
  const avgValue = Math.round(kpiData.reduce((sum, kpi) => sum + kpi.value, 0) / (kpiData.length || 1));
  
  const getMessage = () => {
    if (avgValue >= 90) return "Fantastisch! Ihre Reflexionsfähigkeiten sind beeindruckend - Sie können stolz auf Ihre Entwicklung sein.";
    if (avgValue >= 75) return "Sehr gut! Sie machen beachtliche Fortschritte und zeigen echtes Talent für reflektierendes Denken.";
    if (avgValue >= 60) return "Gut gemacht! Ihre kontinuierliche Arbeit zahlt sich aus - bleiben Sie dran, Sie sind auf einem guten Weg.";
    if (avgValue >= 40) return "Sie entwickeln sich! Jeder Schritt zählt, und Ihre Bemühungen werden zu immer besseren Ergebnissen führen.";
    return "Ein guter Anfang! Reflektieren ist eine Fähigkeit, die Zeit braucht - bleiben Sie geduldig mit sich selbst und feiern Sie kleine Erfolge.";
  };
  
  return (
    <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
      <div className="flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Persönliches Feedback
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {getMessage()}
          </p>
        </div>
      </div>
    </div>
  );
};

// Add Moon's reflective levels component
const MoonReflectiveLevels = () => {
  const levels = [
    {
      name: "Beschreibend",
      description: "Einfache Beschreibung von Ereignissen ohne tiefere Analyse",
      examples: ["Heute haben wir X gemacht", "Die Präsentation verlief reibungslos"],
      color: "#94a3b8",
      userLevel: 90 // Example user proficiency at this level (%)
    },
    {
      name: "Persönlich",
      description: "Persönliche Reaktionen und Gefühle werden einbezogen",
      examples: ["Ich war überrascht, als...", "Es hat mir gut gefallen, weil..."],
      color: "#60a5fa",
      userLevel: 85
    },
    {
      name: "Analytisch",
      description: "Analyse von Ursachen, Auswirkungen und Bedeutungen",
      examples: ["Dies geschah, weil...", "Dies hat dazu geführt, dass..."],
      color: "#34d399",
      userLevel: 75
    },
    {
      name: "Kritisch",
      description: "Hinterfragen von Annahmen und Betrachtung aus verschiedenen Perspektiven",
      examples: ["Eine alternative Sichtweise wäre...", "Dies stellt meine Annahme in Frage..."],
      color: "#f59e0b",
      userLevel: 70
    },
    {
      name: "Transformativ",
      description: "Tiefgreifende Einsichten, die zu Veränderungen führen",
      examples: ["Dies hat meine Sichtweise grundlegend verändert...", "Infolgedessen werde ich..."],
      color: "#8b5cf6",
      userLevel: 60
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Reflektionsebenen nach Moon</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                <HelpCircle className="h-3 w-3 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" className="max-w-xs">
              <div>
                <p className="text-xs font-medium mb-1">Moon's Reflektionsebenen</p>
                <p className="text-xs">Jenny Moon's Modell beschreibt fünf Ebenen der Reflexion, von oberflächlich-beschreibend bis tiefgreifend-transformativ. Je höher die Ebene, desto tiefgründiger die Reflexion.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3">
        {levels.map((level, index) => (
          <div key={level.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: level.color }}></div>
                <span className="text-sm font-medium">{level.name}</span>
              </div>
              <span className="text-sm font-bold">{level.userLevel}%</span>
            </div>
            <Progress value={level.userLevel} className="h-1.5" style={{ backgroundColor: `${level.color}20` }} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-muted-foreground cursor-help underline decoration-dotted underline-offset-2">{level.description}</p>
                </TooltipTrigger>
                <TooltipContent className="w-60">
                  <div className="space-y-2">
                    <p className="text-xs font-medium">Beispiele für diese Ebene:</p>
                    <ul className="text-xs list-disc pl-4 space-y-1">
                      {level.examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced adaptive prompts component
const AdaptivePrompts = () => {
  // Example: Personalized prompts based on user's current level and needs
  const personalizedPrompts = [
    {
      id: 1,
      category: "Reflexionstiefe",
      level: "Fortgeschritten",
      prompt: "Denken Sie an eine kürzlich getroffene berufliche Entscheidung. Welche unbewussten Annahmen haben möglicherweise Ihren Entscheidungsprozess beeinflusst, und wie könnten alternative Perspektiven zu einem anderen Ergebnis geführt haben?",
      targetKpi: "Reflexionstiefe"
    },
    {
      id: 2,
      category: "Metakognition",
      level: "Mittelstufe",
      prompt: "Beschreiben Sie eine Situation, in der sich Ihre Denkweise während eines Projekts verändert hat. Was hat diesen Wandel ausgelöst, und wie hat sich dadurch Ihr Verständnis des Problems vertieft?",
      targetKpi: "Metakognition"
    },
    {
      id: 3,
      category: "Handlungsorientierung",
      level: "Grundlegend",
      prompt: "Reflektieren Sie über ein Feedback, das Sie kürzlich erhalten haben. Welche konkreten, messbaren Schritte können Sie in den nächsten zwei Wochen unternehmen, um dieses Feedback umzusetzen?",
      targetKpi: "Handlungsorientierung"
    },
    {
      id: 4,
      category: "Kritisches Denken",
      level: "Fortgeschritten", 
      prompt: "Betrachten Sie eine Überzeugung oder Annahme, die in Ihrem Arbeitsumfeld als selbstverständlich gilt. Welche Argumente sprechen dafür, welche dagegen? Und wie könnte eine Neubetrachtung dieser Annahme zu Innovationen führen?",
      targetKpi: "Reflexionstiefe"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Adaptive Reflexionsimpulse</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                <HelpCircle className="h-3 w-3 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" className="max-w-xs">
              <div>
                <p className="text-xs font-medium mb-1">Personalisierte Schreibimpulse</p>
                <p className="text-xs">Diese Impulse werden speziell für Ihr aktuelles Reflexionsniveau generiert und helfen Ihnen, Ihre Reflexionsfähigkeiten gezielt weiterzuentwickeln.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-3">
        {personalizedPrompts.map(prompt => (
          <div key={prompt.id} className="p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
            <div className="flex justify-between mb-1">
              <Badge variant="outline" className="text-xs">
                {prompt.category}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Niveau: {prompt.level}
              </Badge>
            </div>
            <p className="text-sm mt-2">{prompt.prompt}</p>
            <div className="mt-3 flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Ziel-KPI: {prompt.targetKpi}</p>
              <Link href={`/adaptive/reflections/new?prompt=${encodeURIComponent(prompt.prompt)}`}>
                <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                  <Sparkles className="h-3 w-3" />
                  Mit diesem Impuls starten
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Learning goals progress tracking component
const LearningGoalsProgress = () => {
  const learningGoals = [
    {
      id: 1,
      title: "Kritische Reflexionsfähigkeit entwickeln",
      progress: 75,
      reflectionCount: 8,
      category: "Metakognition",
      dueDate: "15. Juni 2024",
      relatedKpis: ["Reflexionstiefe", "Metakognition"]
    },
    {
      id: 2,
      title: "Handlungsorientiertes Feedback umsetzen",
      progress: 60,
      reflectionCount: 5,
      category: "Praxis",
      dueDate: "30. Mai 2024",
      relatedKpis: ["Handlungsorientierung", "Kohärenz"]
    },
    {
      id: 3,
      title: "Kommunikationsmuster reflektieren",
      progress: 40,
      reflectionCount: 3,
      category: "Kommunikation",
      dueDate: "22. Juli 2024",
      relatedKpis: ["Kohärenz", "Reflexionstiefe"]
    }
  ];

  return (
    <div className="space-y-5">
      {learningGoals.map(goal => (
        <div key={goal.id} className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">{goal.title}</h4>
            <Badge variant={goal.progress >= 75 ? "default" : goal.progress >= 50 ? "default" : "outline"}>
              {goal.progress}%
            </Badge>
          </div>
          
          <div className="mb-3">
            <Progress value={goal.progress} className="h-2" />
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{goal.reflectionCount} Reflexionen</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Fällig: {goal.dueDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>{goal.category}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t flex justify-between items-center">
            <div className="flex flex-wrap gap-1">
              {goal.relatedKpis.map(kpi => (
                <Badge key={kpi} variant="secondary" className="text-[10px]">
                  {kpi}
                </Badge>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs">Details</Button>
          </div>
        </div>
      ))}
      
      <Button variant="outline" className="w-full gap-2 text-sm">
        <PlusCircle className="h-3.5 w-3.5" />
        Neues Lernziel hinzufügen
      </Button>
    </div>
  );
};

// Add a dedicated transparency component for explaining KPI calculations
const KpiCalculationExplanation = ({ kpiName }: { kpiName: string }) => {
  const getExplanation = () => {
    switch(kpiName) {
      case "Reflexionstiefe":
        return {
          indicators: ["Kausale Ausdrücke", "Kritische Hinterfragung", "Perspektivwechsel", "Konzeptuelle Verknüpfungen"],
          method: "Natural Language Processing mit BERT-basiertem Algorithmus zur Erkennung von Reflexionsmustern",
          confidence: 87
        };
      case "Kohärenz":
        return {
          indicators: ["Textstruktur", "Logische Übergänge", "Thematische Konsistenz", "Argumentative Klarheit"],
          method: "Linguistische Analyse von Textfluss und struktureller Organisation",
          confidence: 92
        };
      case "Metakognition":
        return {
          indicators: ["Selbstbezogene Reflexion", "Lernprozessanalyse", "Bewusstsein für eigene Denkprozesse", "Erkenntnisreflexion"],
          method: "LIWC-basierte Analyse selbstreflexiver Sprachmuster und kognitiver Ausdrücke",
          confidence: 84
        };
      case "Handlungsorientierung":
        return {
          indicators: ["Konkrete Aktionsschritte", "SMART-Zielformulierungen", "Umsetzbare Maßnahmen", "Anwendungsbezug"],
          method: "Kombination aus Text-Klassifikation und semantischer Analyse von Handlungsabsichten",
          confidence: 89
        };
      default:
        return {
          indicators: ["Verschiedene textuelle Marker", "Sprachmuster", "Semantische Bedeutung", "Strukturelle Elemente"],
          method: "Multimodale Textanalyse durch KI-gestützte Algorithmen",
          confidence: 85
        };
    }
  };
  
  const explanation = getExplanation();
  
  return (
    <div className="space-y-3 p-3 bg-muted/50 rounded-md text-xs">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Lock className="h-3 w-3" />
        <span className="font-medium">KI-Berechnungstransparenz</span>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="font-medium">Indikatoren:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {explanation.indicators.map((indicator, i) => (
              <Badge key={i} variant="outline" className="text-[10px]">
                {indicator}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <p className="font-medium">Methode:</p>
          <p className="text-muted-foreground">{explanation.method}</p>
        </div>
        
        <div>
          <p className="font-medium">Konfidenzscore:</p>
          <div className="flex items-center gap-2">
            <Progress value={explanation.confidence} className="h-1.5 w-24" />
            <span>{explanation.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdaptiveDashboard() {
  // Beispiel KPI-Daten
  const kpiData = [
    { name: "Reflexionstiefe", value: 78, color: "#3b82f6" },
    { name: "Kohärenz", value: 65, color: "#10b981" },
    { name: "Metakognition", value: 89, color: "#8b5cf6" },
    { name: "Handlungsorientierung", value: 72, color: "#f59e0b" }
  ]
  
  // Define state variables
  const [showSystemInfo, setShowSystemInfo] = useState(true)
  const [filterCriteria, setFilterCriteria] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [feedbackDepth, setFeedbackDepth] = useState(2) // 1: Basic, 2: Detailed, 3: Expert
  
  // Define a longer list of past reflections for better filtering demonstration
  const pastReflections = [
    { 
      id: 1, 
      title: "JavaScript Fortgeschrittene Konzepte", 
      date: "18. März 2024", 
      category: "Technologie",
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
      category: "Management",
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
      category: "Soft Skills", 
      kpis: {
        depth: 95,
        coherence: 85,
        metacognition: 88,
        actionable: 92
      },
      snippet: "Mir ist aufgefallen, dass meine Kommunikation oft zu vage ist. Ich habe erkannt, dass präzise Ausdrucksweise und aktives Zuhören..." 
    },
    { 
      id: 4, 
      title: "Konfliktmanagement im Arbeitsalltag", 
      date: "28. Februar 2024",
      category: "Soft Skills",
      kpis: {
        depth: 82,
        coherence: 76,
        metacognition: 70,
        actionable: 85
      },
      snippet: "In der Konfliktsituation letzte Woche habe ich bemerkt, dass ich zu schnell defensive Haltungen einnehme. Zukünftig will ich..." 
    },
    { 
      id: 5, 
      title: "Datenbanken und Datenmigration", 
      date: "15. Februar 2024",
      category: "Technologie",
      kpis: {
        depth: 68,
        coherence: 72,
        metacognition: 65,
        actionable: 80
      },
      snippet: "Die Migration von SQL zu NoSQL hat mir gezeigt, dass Datenstrukturierung fundamental für effiziente Systeme ist. Ich sollte..." 
    }
  ]

  // Add helper function to get filtered and sorted reflections
  const getFilteredReflections = () => {
    let filtered = [...pastReflections];
    
    // Apply category filter
    if (filterCriteria !== "all") {
      filtered = filtered.filter(reflection => reflection.category === filterCriteria);
    }
    
    // Apply sorting
    if (sortOrder === "newest") {
      // Assuming date is in descending order by ID already
      // No change needed
    } else if (sortOrder === "oldest") {
      filtered = [...filtered].reverse();
    } else if (sortOrder === "highest") {
      filtered = filtered.sort((a, b) => {
        const avgA = (a.kpis.depth + a.kpis.coherence + a.kpis.metacognition + a.kpis.actionable) / 4;
        const avgB = (b.kpis.depth + b.kpis.coherence + b.kpis.metacognition + b.kpis.actionable) / 4;
        return avgB - avgA;
      });
    } else if (sortOrder === "lowest") {
      filtered = filtered.sort((a, b) => {
        const avgA = (a.kpis.depth + a.kpis.coherence + a.kpis.metacognition + a.kpis.actionable) / 4;
        const avgB = (b.kpis.depth + b.kpis.coherence + b.kpis.metacognition + b.kpis.actionable) / 4;
        return avgA - avgB;
      });
    }
    
    return filtered;
  };

  // Render the main dashboard
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
            
            {/* Feedback Depth Control - New Feature */}
            <div className="flex flex-col gap-1 bg-muted/50 px-3 py-2 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Feedback-Tiefe</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0 hover:bg-accent/50 transition-colors">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end" className="max-w-xs">
                      <p className="text-xs">Passen Sie an, wie detailliert die Feedback- und Systeminformationen angezeigt werden sollen.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFeedbackDepth(1)} 
                  className={`text-xs px-2 py-1 rounded ${feedbackDepth === 1 ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                >
                  Einfach
                </button>
                <button 
                  onClick={() => setFeedbackDepth(2)} 
                  className={`text-xs px-2 py-1 rounded ${feedbackDepth === 2 ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                >
                  Standard
                </button>
                <button 
                  onClick={() => setFeedbackDepth(3)} 
                  className={`text-xs px-2 py-1 rounded ${feedbackDepth === 3 ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                >
                  Detailliert
                </button>
              </div>
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

          {/* Other KPI cards */}
          {/* ... */}
                          </div>

        {/* Main dashboard content goes here */}
        {/* ... */}

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
              
              {/* Filter- und Sortierfunktionen für Einträge (F7) */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Filtern nach:</span>
                  <select
                    className="text-sm rounded-md border border-input bg-background px-3 py-1"
                    value={filterCriteria}
                    onChange={(e) => setFilterCriteria(e.target.value)}
                  >
                    <option value="all">Alle Kategorien</option>
                    <option value="Technologie">Technologie</option>
                    <option value="Management">Management</option>
                    <option value="Soft Skills">Soft Skills</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sortieren nach:</span>
                  <select
                    className="text-sm rounded-md border border-input bg-background px-3 py-1"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="newest">Neueste zuerst</option>
                    <option value="oldest">Älteste zuerst</option>
                    <option value="highest">Höchste Bewertung</option>
                    <option value="lowest">Niedrigste Bewertung</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {getFilteredReflections().map(reflection => (
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
                      
                      {/* Other KPI columns */}
                      {/* ... */}
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

        {/* Other dashboard content */}
        {/* ... */}

        {/* Add new section for learning goals after the Moon's reflective levels and adaptive prompts */}
        <div className="mt-8">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle>Lernziele & Fortschritt</CardTitle>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                              </TooltipTrigger>
                      <TooltipContent align="end" className="max-w-xs">
                                <div>
                          <p className="text-xs font-medium mb-1">Lernziele verfolgen</p>
                          <p className="text-xs">Verfolgen Sie Ihren Fortschritt bei persönlichen Lernzielen. Jedes Ziel wird durch Ihre Reflexionen automatisch aktualisiert.</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                                  {showSystemInfo && (
                  <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
                    Automatische Fortschrittsverfolgung
                  </Badge>
                                  )}
                                </div>
              <CardDescription>
                Verfolgen Sie Ihre persönlichen Reflexions- und Lernziele
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <LearningGoalsProgress />
            </CardContent>
            <CardFooter className="border-t p-4 flex flex-col">
              <p className="text-xs text-muted-foreground">
                Ihre Lernziele werden automatisch durch die KI-gestützte Analyse Ihrer Reflexionen aktualisiert. Erstellen Sie neue Ziele, um Ihre Entwicklung gezielt zu steuern.
              </p>
                    {showSystemInfo && (
                <div className="mt-2">
                  <TransparencyInfo
                    icon="info"
                    variant="muted"
                    title="Fortschrittsberechnung"
                    description="Der Fortschritt wird durch Analyse der thematischen Übereinstimmung zwischen Reflexionen und Lernzielen sowie der erreichten KPI-Werte in relevanten Dimensionen berechnet."
                  />
                      </div>
                    )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 