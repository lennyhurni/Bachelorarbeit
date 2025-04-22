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
  ClipboardCheck,
  Eye,
  EyeOff,
  Cog
} from "lucide-react"
import { useState, useEffect } from "react"
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
  
  return (
    <div className="relative w-full h-[280px] flex items-center justify-center">
      {/* Clean, minimalist background - inspired by screenshot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[85%] h-[85%] rounded-full border border-gray-100 dark:border-gray-800/40"></div>
        <div className="absolute w-[60%] h-[60%] rounded-full border border-gray-100 dark:border-gray-800/40"></div>
        <div className="absolute w-[30%] h-[30%] rounded-full border border-gray-100 dark:border-gray-800/40"></div>
      </div>
      
      {/* KPI axis lines - subtle, minimalist */}
      {data.map((kpi, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        return (
          <div 
            key={`axis-${kpi.name}`} 
            className="absolute h-[45%] border-r border-dashed border-gray-100 dark:border-gray-800/40 origin-bottom"
            style={{
              transform: `rotate(${(angle * 180) / Math.PI}deg)`
            }}
          />
        );
      })}
      
      {/* Clean connecting polygon between points */}
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
          fill="rgba(59, 130, 246, 0.1)"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="0"
          strokeOpacity="0.4"
        />
      </svg>
      
      {/* KPI points inspired by screenshot - prominent colored dots */}
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
                    className="w-3.5 h-3.5 rounded-full cursor-help transition-all duration-200 hover:scale-150 hover:ring-2 ring-offset-2 ring-offset-background ring-primary/30" 
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
      
      {/* Clean, badge-style labels similar to screenshot */}
      {data.map((kpi, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        const x = Math.cos(angle) * labelDistance;
        const y = Math.sin(angle) * labelDistance;
        
        return (
          <div 
            key={`label-${kpi.name}`} 
            className="absolute py-1 px-2 rounded-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-xs font-medium border border-gray-100 dark:border-gray-700 shadow-sm" 
            style={{
              top: `calc(50% - ${y}%)`,
              left: `calc(50% + ${x}%)`,
              transform: 'translate(-50%, -50%)',
              zIndex: 2 // Ensure labels are above the polygon
            }}
          >
            {kpi.name === "Kohärenz" ? (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: kpi.color }}></div>
                <span className="font-medium">Kohärenz</span>
              </div>
            ) : kpi.name === "Handlungsorientierung" ? (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: kpi.color }}></div>
                <span className="font-medium">Handlung</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: kpi.color }}></div>
                <span className="font-medium">{dimensionLabels[kpi.name] || kpi.name}</span>
              </div>
            )}
          </div>
        )
      })}
      
      {/* Central KPI summary - cleaner, more prominent like in the screenshot */}
      <div className="absolute flex flex-col items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 w-20 h-20 shadow-sm" style={{ zIndex: 2 }}>
        {data.some(kpi => kpi.value > 0) ? (
          <>
            <span className="text-2xl font-bold">{avgValue}%</span>
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
      <div className="space-y-1 max-w-xs bg-blue-50 p-2 rounded-md">
        <div className="flex items-center justify-between">
          <span className="font-medium">{kpiName}:</span> 
          <span className="font-bold">{value}%</span>
        </div>
        <p className="text-xs text-muted-foreground">{performanceInfo.description}</p>
        <p className="text-xs text-blue-600 font-medium">Einfache Feedback-Ansicht (Stufe 1)</p>
      </div>
    );
  } else if (feedbackDepth === 2) {
    // Standard feedback - essentials plus basic guidance
    return (
      <div className="space-y-2 max-w-xs bg-green-50 p-2 rounded-md">
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
        <p className="text-xs text-green-600 font-medium">Standard Feedback-Ansicht (Stufe 2)</p>
      </div>
    );
  } else {
    // Expert feedback - comprehensive information
    return (
      <div className="space-y-3 max-w-xs bg-purple-50 p-2 rounded-md">
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
        <p className="text-xs text-purple-600 font-medium">Detaillierte Feedback-Ansicht (Stufe 3)</p>
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
const MoonReflectiveLevels = ({ 
  feedbackDepth = 2,
  showSystemInfo = true
}: { 
  feedbackDepth?: number,
  showSystemInfo?: boolean 
}) => {
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

  console.log(`MoonReflectiveLevels received feedbackDepth: ${feedbackDepth}`);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Reflektionsebenen nach Moon</h3>
        <Badge variant={feedbackDepth === 1 ? 'outline' : feedbackDepth === 2 ? 'secondary' : 'default'} 
               className="text-xs">
          Feedback-Tiefe: {feedbackDepth === 1 ? 'Einfach' : feedbackDepth === 2 ? 'Standard' : 'Detailliert'}
        </Badge>
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
            <Progress value={level.userLevel} className="h-1.5" style={{ '--progress-foreground': level.color, backgroundColor: `${level.color}20` } as React.CSSProperties} />
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
const AdaptivePrompts = ({
  feedbackDepth = 2,
  showSystemInfo = true
}: {
  feedbackDepth?: number,
  showSystemInfo?: boolean
}) => {
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

  console.log(`AdaptivePrompts received feedbackDepth: ${feedbackDepth}`);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Adaptive Reflexionsimpulse</h3>
        <Badge variant={feedbackDepth === 1 ? 'outline' : feedbackDepth === 2 ? 'secondary' : 'default'} 
               className="text-xs">
          Feedback-Tiefe: {feedbackDepth === 1 ? 'Einfach' : feedbackDepth === 2 ? 'Standard' : 'Detailliert'}
        </Badge>
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
                <p className="text-xs">
                  {feedbackDepth === 3 ? 'Präzise an Ihr aktuelles Niveau in allen Kompetenzbereichen angepasst' : 
                   feedbackDepth === 2 ? 'Angepasst an Ihre Reflexionsfähigkeiten' :
                   'Grundlegende Impulse für Ihre Reflexionen'}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-3">
        {personalizedPrompts.map(prompt => (
          <div key={prompt.id} className={`p-3 rounded-md border ${
            feedbackDepth === 1 ? 'bg-blue-50/50' : 
            feedbackDepth === 2 ? 'bg-green-50/50' : 
            'bg-purple-50/50'
          } hover:bg-muted/50 transition-colors`}>
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
              {/* Only show target KPI for feedback depth 2 or higher */}
              {feedbackDepth >= 2 && (
                <p className="text-xs text-muted-foreground">Ziel-KPI: {prompt.targetKpi}</p>
              )}
              {/* Show more details for detailed mode */}
              {feedbackDepth === 1 ? (
                <Button variant="outline" size="sm" className="text-xs h-7">
                  Starten
                </Button>
              ) : (
                <Link href={`/reflections/new?prompt=${encodeURIComponent(prompt.prompt)}`}>
                  <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                    <Sparkles className="h-3 w-3" />
                    Mit diesem Impuls starten
                  </Button>
                </Link>
              )}
            </div>
            {/* Additional explanation only for detailed view */}
            {feedbackDepth === 3 && (
              <div className="mt-2 pt-2 border-t border-muted">
                <p className="text-xs text-muted-foreground">
                  Dieser Impuls wurde speziell für Ihr aktuelles Niveau in {prompt.targetKpi} entwickelt.
                  Er hilft Ihnen, diese Fähigkeit zu vertiefen und anzuwenden.
                </p>
              </div>
            )}
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
            <Progress value={explanation.confidence} className="h-1.5 w-24" style={{ '--progress-foreground': '#3b82f6' } as React.CSSProperties} />
            <span>{explanation.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdaptiveDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("overview")
  const [showSystemInfo, setShowSystemInfo] = useState(true)
  const [feedbackDepth, setFeedbackDepth] = useState(2) // 1: Basic, 2: Standard, 3: Detailed
  const [filterCriteria, setFilterCriteria] = useState("all")
  const [sortCriteria, setSortCriteria] = useState("newest")
  const [showMoonLevels, setShowMoonLevels] = useState(false)
  
  // Load user settings on mount
  useEffect(() => {
    try {
      const savedSettingsJson = localStorage.getItem("userSettings");
      if (savedSettingsJson) {
        const savedSettings = JSON.parse(savedSettingsJson);
        if (savedSettings.feedbackDepth) {
          console.log(`Loading feedback depth from localStorage: ${savedSettings.feedbackDepth}`);
          setFeedbackDepth(savedSettings.feedbackDepth);
        }
        if (typeof savedSettings.showSystemInfo === 'boolean') {
          setShowSystemInfo(savedSettings.showSystemInfo);
        }
      } else {
        // Initialize localStorage if it doesn't exist
        const initialSettings = { feedbackDepth, showSystemInfo };
        localStorage.setItem("userSettings", JSON.stringify(initialSettings));
        console.log("Initialized localStorage with default settings");
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  }, []);
  
  // Debug log whenever feedbackDepth changes
  useEffect(() => {
    console.log(`Feedback depth in component state: ${feedbackDepth}`);
    document.body.setAttribute('data-feedback-depth', String(feedbackDepth));
  }, [feedbackDepth]);
  
  // Sample KPI data - would typically come from an API
  const kpiData = [
    { name: "Reflexionstiefe", value: 72, color: "#3b82f6" }, // blue
    { name: "Kohärenz", value: 84, color: "#10b981" }, // green
    { name: "Metakognition", value: 61, color: "#f59e0b" }, // amber
    { name: "Handlungsorientierung", value: 48, color: "#ef4444" }, // red
  ];
  
  // Sample reflection data
  const reflections = [
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
  
  const getFilteredReflections = () => {
    let filtered = [...reflections];
    
    // Apply category filter
    if (filterCriteria !== "all") {
      filtered = filtered.filter(reflection => reflection.category === filterCriteria);
    }
    
    // Apply sorting
    if (sortCriteria === "newest") {
      // Assuming date is in descending order by ID already
      // No change needed
    } else if (sortCriteria === "oldest") {
      filtered = [...filtered].reverse();
    } else if (sortCriteria === "highest") {
      filtered = filtered.sort((a, b) => {
        const avgA = (a.kpis.depth + a.kpis.coherence + a.kpis.metacognition + a.kpis.actionable) / 4;
        const avgB = (b.kpis.depth + b.kpis.coherence + b.kpis.metacognition + b.kpis.actionable) / 4;
        return avgB - avgA;
      });
    } else if (sortCriteria === "lowest") {
      filtered = filtered.sort((a, b) => {
        const avgA = (a.kpis.depth + a.kpis.coherence + a.kpis.metacognition + a.kpis.actionable) / 4;
        const avgB = (b.kpis.depth + b.kpis.coherence + b.kpis.metacognition + b.kpis.actionable) / 4;
        return avgA - avgB;
      });
    }
    
    return filtered;
  }
  
  return (
    <div className={`py-6 space-y-8 ${
      feedbackDepth === 1 ? 'bg-blue-50/30' : 
      feedbackDepth === 2 ? 'bg-white' : 
      'bg-purple-50/30'
    }`}>
      <div className="container px-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              {feedbackDepth === 1 ? 'Einfache Übersicht Ihrer Reflexionen' : 
               feedbackDepth === 2 ? 'Übersicht und Analysen Ihrer Reflexionen' : 
               'Detaillierte Übersicht und tiefgehende Analysen Ihrer Reflexionen'}
            </p>
          </div>
          <Link href="/reflections/new">
            <Button className="gap-2">
              <Sparkles className="h-4 w-4" />
              Neue Reflexion
            </Button>
          </Link>
        </div>
        
        {/* Feedback-Tiefe Bereich */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border rounded-lg p-4 bg-muted/20 mt-6 mb-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Feedback-Tiefe</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {feedbackDepth === 1 ? 'Optimiert für Reflexionseinsteiger und klare Übersicht' : 
               feedbackDepth === 2 ? 'Ausgewogene Detailtiefe für geübte Nutzer' : 
               'Umfangreiche Analysen für Fortgeschrittene'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => {
                setFeedbackDepth(1);
                localStorage.setItem("userSettings", JSON.stringify({ feedbackDepth: 1, showSystemInfo }));
              }}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                feedbackDepth === 1 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-background border hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-blue-300"></div>
              <span>Einfach</span>
            </button>
            
            <button 
              onClick={() => {
                setFeedbackDepth(2);
                localStorage.setItem("userSettings", JSON.stringify({ feedbackDepth: 2, showSystemInfo }));
              }}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                feedbackDepth === 2 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-background border hover:border-primary/50 hover:bg-primary/10'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              <span>Standard</span>
            </button>
            
            <button 
              onClick={() => {
                setFeedbackDepth(3);
                localStorage.setItem("userSettings", JSON.stringify({ feedbackDepth: 3, showSystemInfo }));
              }}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                feedbackDepth === 3 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'bg-background border hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-purple-300"></div>
              <span>Detailliert</span>
            </button>
            
            <div className="flex items-center gap-2 ml-2 pl-2 border-l">
              <div className="flex items-center gap-1">
                <span className="text-sm">System-Info</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Technische Details zur KI-Analyse anzeigen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch 
                checked={showSystemInfo} 
                onCheckedChange={(checked) => {
                  setShowSystemInfo(checked);
                  let savedSettings = { feedbackDepth, showSystemInfo: checked };
                  try {
                    const savedSettingsJson = localStorage.getItem("userSettings");
                    if (savedSettingsJson) {
                      savedSettings = { ...JSON.parse(savedSettingsJson), showSystemInfo: checked };
                    }
                    localStorage.setItem("userSettings", JSON.stringify(savedSettings));
                  } catch (e) {
                    console.error("Error saving settings:", e);
                  }
                }}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI-Karten */}
      <div className="container px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className={`border-l-4 border-l-blue-500 ${
            feedbackDepth === 3 ? 'shadow-lg' : 
            feedbackDepth === 2 ? 'shadow-md' : 
            'shadow-sm'
          }`}>
            <CardHeader onClick={() => console.log(`Current feedbackDepth: ${feedbackDepth}`)} className="flex flex-row items-center justify-between space-y-0 pb-2">
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
              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-full">
                <BookOpen className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +3 seit letztem Monat
              </p>
            </CardContent>
          </Card>

          <Card className={`border-l-4 border-l-green-500 ${
            feedbackDepth === 3 ? 'shadow-lg' : 
            feedbackDepth === 2 ? 'shadow-md' : 
            'shadow-sm'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-1">
                <CardTitle className="text-sm font-medium">
                  {feedbackDepth === 1 ? 'Gesamtfortschritt' : 'Durchschnittliche Tiefe'}
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">
                        {feedbackDepth === 1 
                          ? 'Ihr Gesamtfortschritt bei der Entwicklung Ihrer Reflexionskompetenz.' 
                          : 'Die durchschnittliche Reflexionstiefe Ihrer gesamten Einträge.'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-full">
                <LineChart className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <Progress value={68} className="h-1.5 mt-2 bg-muted" style={{ '--progress-foreground': '#10b981' } as React.CSSProperties} />
              {feedbackDepth >= 2 && (
                <p className="text-xs text-muted-foreground mt-1">Basierend auf {feedbackDepth === 3 ? 'Reflexionstiefe, Kohärenz und Metakognition' : 'allen Reflexionsmetriken'}</p>
              )}
            </CardContent>
          </Card>

          {/* Only show KPI cards for Lernbereich in Standard and Detailed */}
          {feedbackDepth >= 2 ? (
            <Card className={`border-l-4 border-l-amber-500 ${
              feedbackDepth === 3 ? 'shadow-lg' : 
              feedbackDepth === 2 ? 'shadow-md' : 
              'shadow-sm'
            }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-1">
                  <CardTitle className="text-sm font-medium">Lernbereich</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Ihr aktivster Lernbereich basierend auf Ihren Reflexionen.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-full">
                  <Target className="h-4 w-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">Technologie</div>
                <p className="text-xs text-muted-foreground mt-1">
                  8 Reflexionen in diesem Bereich
                </p>
              </CardContent>
            </Card>
          ) : (
            // For Simple view, show a clear, more basic KPI
            <Card className={`border-l-4 border-l-amber-500 shadow-sm`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-1">
                  <CardTitle className="text-sm font-medium">Aktivität</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Ihre Reflexions-Aktivität im Vergleich zum Vormonat.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-full">
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">Regelmäßig</div>
                <div className="flex items-center gap-1 mt-2">
                  <Progress value={80} className="h-1.5 bg-muted" style={{ '--progress-foreground': '#f59e0b' } as React.CSSProperties} />
                  <span className="text-xs font-medium">80%</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conditional card based on feedback depth */}
          {feedbackDepth >= 2 ? (
            <Card className={`border-l-4 border-l-purple-500 ${
              feedbackDepth === 3 ? 'shadow-lg' : 
              feedbackDepth === 2 ? 'shadow-md' : 
              'shadow-sm'
            }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-1">
                  <CardTitle className="text-sm font-medium">Fortschritt</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">{feedbackDepth === 3 ? 'Detaillierter Fortschritt in Richtung Ihrer Lernziele mit präzisen Metriken.' : 'Ihr Fortschritt in Richtung Ihrer Lernziele.'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-full">
                  <Star className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">73%</div>
                <Progress value={73} className="h-1.5 mt-2 bg-muted" style={{ '--progress-foreground': '#8b5cf6' } as React.CSSProperties} />
                {feedbackDepth === 3 && (
                  <p className="text-xs text-muted-foreground mt-1">+12% gegenüber letztem Monat</p>
                )}
              </CardContent>
            </Card>
          ) : (
            // For Simple view, show a more approachable metric
            <Card className={`border-l-4 border-l-purple-500 shadow-sm`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-1">
                  <CardTitle className="text-sm font-medium">Nächste Schritte</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Einfache Schritte zur Verbesserung Ihrer Reflexionen.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-full">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">Regelmäßig reflektieren</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Versuchen Sie, mindestens 1x pro Woche eine neue Reflexion zu erstellen
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Main dashboard content goes here */}
      {/* KPI-Übersicht – RadarChart - CONDITIONAL BASED ON FEEDBACK DEPTH */}
      <div className="container px-6 mb-8">
        {feedbackDepth === 1 ? (
          /* For Simple view - Simplified bar chart representation instead of radar */
          <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="border-b bg-blue-50/50">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                <CardTitle>Reflexions-Übersicht</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">Eine einfache Übersicht Ihrer Reflexionsmetriken.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>Hauptkennzahlen auf einen Blick</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 bg-gradient-to-b from-blue-50/30 to-white">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium">Reflexionstiefe</span>
                    </div>
                    <span className="font-bold">72%</span>
                  </div>
                  <Progress value={72} className="h-2" style={{ '--progress-foreground': '#3b82f6' } as React.CSSProperties} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">Struktur</span>
                    </div>
                    <span className="font-bold">84%</span>
                  </div>
                  <Progress value={84} className="h-2" style={{ '--progress-foreground': '#10b981' } as React.CSSProperties} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="font-medium">Praxisbezug</span>
                    </div>
                    <span className="font-bold">68%</span>
                  </div>
                  <Progress value={68} className="h-2" style={{ '--progress-foreground': '#f59e0b' } as React.CSSProperties} />
                </div>
                
                <div className="mt-6 w-full bg-card rounded-lg p-4 border">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Persönliches Feedback
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Gut gemacht! Ihre kontinuierliche Arbeit zahlt sich aus - bleiben Sie dran, Sie sind auf einem guten Weg.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // For Standard and Detailed view - use the radar chart
          <Card className={`overflow-hidden border ${
            feedbackDepth === 3 ? 'shadow-lg' : 'shadow-md'
          }`}>
            <CardHeader className={`border-b ${
              feedbackDepth === 2 ? 'bg-background' : 'bg-background'
            }`}>
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                <CardTitle>
                  KPI-Übersicht
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">
                        {feedbackDepth === 2 ? 
                          'Interaktive Visualisierung Ihrer Schlüssel-KPIs. Die Darstellungs-/Erklärungs-tiefe passt sich der gewählten Feedback-Tiefe an.' : 
                          'Detaillierte und umfassende Visualisierung aller KPIs mit tiefgehenden Erklärungen.'}
                      </p>
                      {feedbackDepth === 3 && showSystemInfo && (
                        <div className="mt-2 pt-2 border-t text-xs">
                          <p className="font-medium">Berechnungsmethodik:</p>
                          <p className="text-muted-foreground">KI-gestützte NLP-Analyse mit gewichteten Metriken nach Jung & Wise (2020)</p>
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>
                Überblick über Reflexionstiefe, Kohärenz, Metakognition & Handlungsorientierung
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 flex flex-col items-center bg-white">
              <div className="max-w-lg w-full">
                <RadarChart 
                  data={kpiData}
                  feedbackDepth={feedbackDepth}
                  showSystemInfo={showSystemInfo}
                />
              </div>
              
              {/* Motivating feedback card - cleaner design */}
              <div className="mt-8 mb-2 w-full max-w-lg bg-blue-50 dark:bg-blue-950/10 rounded-lg p-5 border border-blue-100 dark:border-blue-900/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-base font-medium text-blue-700 dark:text-blue-300">
                      Persönliches Feedback
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                      Gut gemacht! Ihre kontinuierliche Arbeit zahlt sich aus - bleiben Sie dran, Sie sind auf einem guten Weg.
                    </p>
                    {feedbackDepth === 3 && (
                      <div className="mt-3 pt-3 border-t border-blue-200/30 text-xs text-blue-600/70 dark:text-blue-400/70">
                        <p>Diese Rückmeldung basiert auf der Analyse Ihrer letzten 15 Reflexionen, mit besonderem Fokus auf die neuesten 5 Einträge.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* After RadarChart content */}
      
      {/* Conditional rendering based on feedbackDepth */}
      {feedbackDepth === 1 ? (
        // In basic mode, hide Moon's reflective levels and show simplified content
        <>
          {/* Only show essential content in simple mode */}
          <div className="container px-6 mt-4 mb-4 text-center">
            <Badge variant="outline" className="text-sm py-2 px-4 bg-blue-50">
              Einfache Ansicht aktiv - Für mehr Details wechseln Sie zur Standard oder Detaillierten Ansicht
            </Badge>
            <div className="mt-4 text-sm text-muted-foreground max-w-lg mx-auto">
              <p>Die einfache Ansicht bietet Ihnen eine klare Übersicht mit reduzierter Informationsmenge, optimal für den Einstieg in die Reflexionsarbeit.</p>
            </div>
          </div>
        </>
      ) : (
        // In standard and detailed mode, show Moon's toggle and more content
        <>
          {/* Button to toggle Moon's reflective levels */}
          <div className="container px-6 flex gap-3 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowMoonLevels(!showMoonLevels)}
              className="flex items-center gap-1"
            >
              {showMoonLevels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>Moon's Reflektionsmodell {showMoonLevels ? 'ausblenden' : 'einblenden'}</span>
            </Button>
            {feedbackDepth === 3 && (
              <div className="ml-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                <span>Nach Moon (2006): Mehrere Reflexionsebenen von beschreibend bis transformativ</span>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Only show Adaptive Prompts section in standard and detailed views with different styling */}
      <div className="container px-6 mt-8">
        <Card className={`border ${
          feedbackDepth === 3 ? 'shadow-lg bg-purple-50/30' : 
          feedbackDepth === 2 ? 'shadow-md' : 
          'shadow-sm bg-blue-50/30'
        }`}>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>
                  {feedbackDepth === 3 ? 'Personalisierte adaptive Reflexionsimpulse' : 
                   feedbackDepth === 2 ? 'Adaptive Reflexionsimpulse' :
                   'Einfache Reflexionsimpulse'}
                </CardTitle>
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
                        <p className="text-xs">
                          {feedbackDepth === 3 ? 'Präzise an Ihr aktuelles Niveau in allen Kompetenzbereichen angepasst' : 
                           feedbackDepth === 2 ? 'Angepasst an Ihre Reflexionsfähigkeiten' :
                           'Grundlegende Impulse für Ihre Reflexionen'}
                        </p>
                        {feedbackDepth === 3 && showSystemInfo && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs">Basierend auf Kumar et al. (2024): KI-gestützte adaptive Schreibimpulse zur Steigerung der Reflexionsqualität</p>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <CardDescription>
              {feedbackDepth === 3 ? 'Maßgeschneiderte Reflexionsanregungen auf Basis Ihrer bisherigen Reflexionen' : 
               feedbackDepth === 2 ? 'Reflexionsanregungen angepasst an Ihr aktuelles Niveau' :
               'Allgemeine Anregungen für Ihre Reflexionen'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <AdaptivePrompts 
              feedbackDepth={feedbackDepth} 
              showSystemInfo={showSystemInfo}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Only show detailed analytics in detailed view */}
      {feedbackDepth === 3 && (
        <div className="container px-6 mt-8">
          <Card className="border shadow-lg bg-purple-50/30">
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-purple-500" />
                <CardTitle>Erweiterte Analysefunktionen</CardTitle>
              </div>
              <CardDescription>
                Tiefgehende Analysen und Korrelationen zwischen verschiedenen Metriken
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-4 border rounded-md bg-white">
                <h3 className="text-sm font-medium mb-2">KPI-Korrelationen</h3>
                <p className="text-sm text-muted-foreground mb-4">Zusammenhänge zwischen Ihren verschiedenen Reflexionsmetriken:</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Reflexionstiefe - Metakognition</span>
                    </div>
                    <span className="text-sm font-bold">87%</span>
                  </div>
                  <Progress value={87} className="h-1.5" style={{ '--progress-foreground': '#3b82f6' } as React.CSSProperties} />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Kohärenz - Handlungsorientierung</span>
                    </div>
                    <span className="text-sm font-bold">72%</span>
                  </div>
                  <Progress value={72} className="h-1.5" style={{ '--progress-foreground': '#10b981' } as React.CSSProperties} />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm">Metakognition - Handlungsorientierung</span>
                    </div>
                    <span className="text-sm font-bold">64%</span>
                  </div>
                  <Progress value={64} className="h-1.5" style={{ '--progress-foreground': '#8b5cf6' } as React.CSSProperties} />
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Reflexionsfortschritt (Letzte 30 Tage)</h3>
                  <div className="flex justify-center items-center h-32 bg-muted/20 rounded-md">
                    <div className="text-center text-muted-foreground text-sm">
                      Fortschrittsdiagramm (nur in der detaillierten Ansicht verfügbar)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Modify the appearance of the reflection listing based on feedback depth */}
      <div className="container px-6 mt-8">
        <Card className={
          feedbackDepth === 3 ? "shadow-lg border-purple-100" : 
          feedbackDepth === 2 ? "border" : 
          "border border-blue-100 shadow-sm"
        }>
          <CardHeader className={`${
            feedbackDepth === 3 ? "bg-purple-50/40 border-b border-purple-100" : 
            feedbackDepth === 2 ? "bg-muted/40 border-b" : 
            "bg-blue-50/40 border-b border-blue-100"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>
                  {feedbackDepth === 3 ? "Detaillierte Reflexionsanalyse" : 
                   feedbackDepth === 2 ? "Letzte Reflexionen mit KPI-Analyse" : 
                   "Reflexionsübersicht"}
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end" className="max-w-xs">
                      <div>
                        <p className="text-xs font-medium mb-1">
                          {feedbackDepth === 3 ? "Umfassende Reflexionsanalyse" : 
                           feedbackDepth === 2 ? "Reflexionsanalyse" : 
                           "Einfache Reflexionsübersicht"}
                        </p>
                        <p className="text-xs">
                          {feedbackDepth === 3 ? "Tiefgehende Analyse jeder Reflexion mit detaillierten Metriken und Empfehlungen." : 
                           feedbackDepth === 2 ? "Jede Ihrer Reflexionen wird automatisch anhand mehrerer Dimensionen bewertet. Die detaillierte KPI-Ansicht hilft Ihnen zu verstehen, wo Ihre Stärken liegen." : 
                           "Einfache Übersicht Ihrer Reflexionen mit grundlegenden Informationen."}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <CardDescription>
              {feedbackDepth === 3 ? "Umfassende Analysen und tiefgreifende Einblicke zu allen Ihren Reflexionen" : 
               feedbackDepth === 2 ? "Detaillierte Metriken zu Ihren neuesten Reflexionen" : 
               "Grundlegende Übersicht Ihrer Reflexionen"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {getFilteredReflections().map(reflection => (
                <div 
                  key={reflection.id} 
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link href={`/reflections/${reflection.id}`}>
                        <h3 className="font-medium hover:text-primary transition-colors">{reflection.title}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{reflection.date}</p>
                        <Badge variant="secondary" className="text-xs">{reflection.category}</Badge>
                      </div>
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
                  
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span>Tiefe</span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2">
                                {reflection.kpis.depth}%
                              </span>
                            </TooltipTrigger>
                            <TooltipContent align="center" className="max-w-xs">
                              <KpiExplanationTooltip 
                                kpiName="Reflexionstiefe"
                                value={reflection.kpis.depth}
                                feedbackDepth={feedbackDepth}
                                showSystemInfo={showSystemInfo}
                              />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Progress value={reflection.kpis.depth} className="h-1 bg-blue-100" style={{ '--progress-foreground': '#3b82f6' } as React.CSSProperties} />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span>Kohärenz</span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2">
                                {reflection.kpis.coherence}%
                              </span>
                            </TooltipTrigger>
                            <TooltipContent align="center" className="max-w-xs">
                              <KpiExplanationTooltip 
                                kpiName="Kohärenz"
                                value={reflection.kpis.coherence}
                                feedbackDepth={feedbackDepth}
                                showSystemInfo={showSystemInfo}
                              />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Progress value={reflection.kpis.coherence} className="h-1 bg-green-100" style={{ '--progress-foreground': '#10b981' } as React.CSSProperties} />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span>Meta</span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2">
                                {reflection.kpis.metacognition}%
                              </span>
                            </TooltipTrigger>
                            <TooltipContent align="center" className="max-w-xs">
                              <KpiExplanationTooltip 
                                kpiName="Metakognition"
                                value={reflection.kpis.metacognition}
                                feedbackDepth={feedbackDepth}
                                showSystemInfo={showSystemInfo}
                              />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Progress value={reflection.kpis.metacognition} className="h-1 bg-amber-100" style={{ '--progress-foreground': '#f59e0b' } as React.CSSProperties} />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span>Handlung</span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2">
                                {reflection.kpis.actionable}%
                              </span>
                            </TooltipTrigger>
                            <TooltipContent align="center" className="max-w-xs">
                              <KpiExplanationTooltip 
                                kpiName="Handlungsorientierung"
                                value={reflection.kpis.actionable}
                                feedbackDepth={feedbackDepth}
                                showSystemInfo={showSystemInfo}
                              />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Progress value={reflection.kpis.actionable} className="h-1 bg-red-100" style={{ '--progress-foreground': '#ef4444' } as React.CSSProperties} />
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
          <CardFooter className="bg-muted/20 border-t p-4 flex justify-center">
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              <span>Alle Reflexionen anzeigen</span>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Add new section for learning goals after the Moon's reflective levels and adaptive prompts */}
      <div className="container px-6 mt-8">
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

      {/* Add new section for Moon's reflective levels */}
      {showMoonLevels && (
        <div className="container px-6 mt-6">
          <Card className="border">
            <CardContent className="pt-6">
              <MoonReflectiveLevels 
                feedbackDepth={feedbackDepth}
                showSystemInfo={showSystemInfo}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 