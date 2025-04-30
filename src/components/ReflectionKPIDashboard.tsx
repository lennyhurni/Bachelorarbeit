import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, 
  Sparkles, 
  TrendingUp, 
  Brain, 
  Target, 
  ArrowUpDown,
  Info,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ReflectionKPIDashboardProps {
  reflection: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    category?: string;
    is_public: boolean;
    kpi_depth: number;
    kpi_coherence: number;
    kpi_metacognition: number;
    kpi_actionable: number;
    reflection_level?: string;
  };
  feedbackDepth: 'basic' | 'standard' | 'detailed';
}

export default function ReflectionKPIDashboard({ reflection, feedbackDepth }: ReflectionKPIDashboardProps) {
  // Calculate average score
  const avgScore = Math.round((reflection.kpi_depth + reflection.kpi_coherence + reflection.kpi_metacognition + reflection.kpi_actionable) / 4);
  
  // Get description based on score
  const getScoreDescription = (score: number) => {
    if (score >= 8) return "Ausgezeichnet";
    if (score >= 6) return "Gut";
    if (score >= 4) return "Mittel";
    return "Verbesserungswürdig";
  };
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 6) return "text-blue-500 dark:text-blue-400";
    if (score >= 4) return "text-amber-500 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };
  
  // Get progress bar color
  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-emerald-100 dark:bg-emerald-950/50";
    if (score >= 6) return "bg-blue-100 dark:bg-blue-950/50";
    if (score >= 4) return "bg-amber-100 dark:bg-amber-950/50";
    return "bg-red-100 dark:bg-red-950/50";
  };
  
  // Get progress bar styles
  const getProgressStyle = (score: number) => {
    if (score >= 8) return {color: 'rgb(16, 185, 129)'};
    if (score >= 6) return {color: 'rgb(59, 130, 246)'};
    if (score >= 4) return {color: 'rgb(245, 158, 11)'};
    return {color: 'rgb(239, 68, 68)'};
  };
  
  // Render the KPI metrics based on feedback depth
  const renderKPIMetrics = () => {
    // Basic view - just show average score
    if (feedbackDepth === 'basic') {
      return (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium">Gesamtbewertung</span>
            <span className={`font-bold text-lg ${getScoreColor(avgScore)}`}>{avgScore}/10</span>
          </div>
          <Progress 
            value={avgScore * 10} 
            className={`h-2.5 ${getProgressColor(avgScore)}`}
            style={getProgressStyle(avgScore)}
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {getScoreDescription(avgScore)}
          </p>
        </div>
      );
    }
    
    // Standard view - show all KPIs in a compact view
    if (feedbackDepth === 'standard') {
      return (
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                Reflexionstiefe
              </span>
              <span className={`font-bold ${getScoreColor(reflection.kpi_depth)}`}>{reflection.kpi_depth}/10</span>
            </div>
            <Progress 
              value={reflection.kpi_depth * 10} 
              className={`h-2 ${getProgressColor(reflection.kpi_depth)}`}
              style={getProgressStyle(reflection.kpi_depth)} 
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                Kohärenz
              </span>
              <span className={`font-bold ${getScoreColor(reflection.kpi_coherence)}`}>{reflection.kpi_coherence}/10</span>
            </div>
            <Progress 
              value={reflection.kpi_coherence * 10} 
              className={`h-2 ${getProgressColor(reflection.kpi_coherence)}`}
              style={getProgressStyle(reflection.kpi_coherence)} 
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium flex items-center gap-1">
                <Brain className="h-3.5 w-3.5 text-purple-500" />
                Metakognition
              </span>
              <span className={`font-bold ${getScoreColor(reflection.kpi_metacognition)}`}>{reflection.kpi_metacognition}/10</span>
            </div>
            <Progress 
              value={reflection.kpi_metacognition * 10} 
              className={`h-2 ${getProgressColor(reflection.kpi_metacognition)}`}
              style={getProgressStyle(reflection.kpi_metacognition)} 
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium flex items-center gap-1">
                <Target className="h-3.5 w-3.5 text-emerald-500" />
                Handlungsorientierung
              </span>
              <span className={`font-bold ${getScoreColor(reflection.kpi_actionable)}`}>{reflection.kpi_actionable}/10</span>
            </div>
            <Progress 
              value={reflection.kpi_actionable * 10} 
              className={`h-2 ${getProgressColor(reflection.kpi_actionable)}`}
              style={getProgressStyle(reflection.kpi_actionable)} 
            />
          </div>
        </div>
      );
    }
    
    // Detailed view - show all KPIs with explanations and visualizations
    return (
      <Tabs defaultValue="bar" className="mt-3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bar">Balken</TabsTrigger>
          <TabsTrigger value="radar">Radar</TabsTrigger>
        </TabsList>
        <TabsContent value="bar" className="space-y-4 mt-4">
          <div className="space-y-3">
            <Collapsible>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                    Reflexionstiefe
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getScoreColor(reflection.kpi_depth)}`}>
                      {reflection.kpi_depth}/10
                    </span>
                    <CollapsibleTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-primary" />
                    </CollapsibleTrigger>
                  </div>
                </div>
                <Progress 
                  value={reflection.kpi_depth * 10} 
                  className={`h-2.5 ${getProgressColor(reflection.kpi_depth)}`}
                  style={getProgressStyle(reflection.kpi_depth)} 
                />
              </div>
              <CollapsibleContent>
                <div className="mt-2 p-2 text-xs rounded-md bg-muted/50 text-muted-foreground">
                  Tiefe bezieht sich auf die Gründlichkeit und Differenziertheit der Reflexion. 
                  Ein hoher Wert zeigt, dass du über oberflächliche Beschreibungen hinaus gehst und tiefer liegende 
                  Faktoren, Ursachen und Implikationen betrachtest.
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                    Kohärenz
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getScoreColor(reflection.kpi_coherence)}`}>
                      {reflection.kpi_coherence}/10
                    </span>
                    <CollapsibleTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-primary" />
                    </CollapsibleTrigger>
                  </div>
                </div>
                <Progress 
                  value={reflection.kpi_coherence * 10} 
                  className={`h-2.5 ${getProgressColor(reflection.kpi_coherence)}`}
                  style={getProgressStyle(reflection.kpi_coherence)} 
                />
              </div>
              <CollapsibleContent>
                <div className="mt-2 p-2 text-xs rounded-md bg-muted/50 text-muted-foreground">
                  Kohärenz beschreibt, wie gut deine Gedanken strukturiert, zusammenhängend und logisch nachvollziehbar sind. 
                  Ein hoher Wert bedeutet, dass deine Reflexion einen klaren roten Faden hat und die Gedanken gut miteinander verbunden sind.
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-1">
                    <Brain className="h-3.5 w-3.5 text-purple-500" />
                    Metakognition
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getScoreColor(reflection.kpi_metacognition)}`}>
                      {reflection.kpi_metacognition}/10
                    </span>
                    <CollapsibleTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-primary" />
                    </CollapsibleTrigger>
                  </div>
                </div>
                <Progress 
                  value={reflection.kpi_metacognition * 10} 
                  className={`h-2.5 ${getProgressColor(reflection.kpi_metacognition)}`}
                  style={getProgressStyle(reflection.kpi_metacognition)} 
                />
              </div>
              <CollapsibleContent>
                <div className="mt-2 p-2 text-xs rounded-md bg-muted/50 text-muted-foreground">
                  Metakognition zeigt, wie bewusst du dir über deine eigenen Denk- und Lernprozesse bist. 
                  Ein hoher Wert signalisiert, dass du nicht nur über Ereignisse nachdenkst, sondern auch darüber, 
                  wie du darüber denkst und lernst.
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-1">
                    <Target className="h-3.5 w-3.5 text-emerald-500" />
                    Handlungsorientierung
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getScoreColor(reflection.kpi_actionable)}`}>
                      {reflection.kpi_actionable}/10
                    </span>
                    <CollapsibleTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-primary" />
                    </CollapsibleTrigger>
                  </div>
                </div>
                <Progress 
                  value={reflection.kpi_actionable * 10} 
                  className={`h-2.5 ${getProgressColor(reflection.kpi_actionable)}`}
                  style={getProgressStyle(reflection.kpi_actionable)} 
                />
              </div>
              <CollapsibleContent>
                <div className="mt-2 p-2 text-xs rounded-md bg-muted/50 text-muted-foreground">
                  Handlungsorientierung misst, inwieweit du konkrete Handlungsschritte oder -möglichkeiten aus deiner Reflexion ableitest. 
                  Ein hoher Wert zeigt, dass deine Reflexion nicht nur beschreibend ist, sondern auch zukünftige Handlungen beeinflusst.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </TabsContent>
        <TabsContent value="radar" className="mt-4 flex justify-center">
          <div className="p-4 bg-muted/20 rounded-md text-center">
            <p className="text-xs text-muted-foreground mb-2">Radar-Visualisierung</p>
            <div className="flex items-center justify-center">
              <svg width="280" height="220" viewBox="0 0 220 220">
                {/* Background circles */}
                <circle cx="110" cy="110" r="80" fill="none" stroke="currentColor" strokeOpacity="0.1" />
                <circle cx="110" cy="110" r="60" fill="none" stroke="currentColor" strokeOpacity="0.1" />
                <circle cx="110" cy="110" r="40" fill="none" stroke="currentColor" strokeOpacity="0.1" />
                <circle cx="110" cy="110" r="20" fill="none" stroke="currentColor" strokeOpacity="0.1" />
                
                {/* Axis lines */}
                <line x1="110" y1="30" x2="110" y2="190" stroke="currentColor" strokeOpacity="0.2" />
                <line x1="30" y1="110" x2="190" y2="110" stroke="currentColor" strokeOpacity="0.2" />
                <line x1="47" y1="47" x2="173" y2="173" stroke="currentColor" strokeOpacity="0.2" />
                <line x1="47" y1="173" x2="173" y2="47" stroke="currentColor" strokeOpacity="0.2" />
                
                {/* Data points */}
                {(() => {
                  // Calculate points for each KPI
                  const kpiDepthPoint = {
                    x: 110 + (reflection.kpi_depth * 8 * Math.cos(Math.PI/2)),
                    y: 110 - (reflection.kpi_depth * 8 * Math.sin(Math.PI/2))
                  };
                  
                  const kpiCoherencePoint = {
                    x: 110 + (reflection.kpi_coherence * 8 * Math.cos(0)),
                    y: 110 - (reflection.kpi_coherence * 8 * Math.sin(0))
                  };
                  
                  const kpiMetacognitionPoint = {
                    x: 110 + (reflection.kpi_metacognition * 8 * Math.cos(Math.PI*3/2)),
                    y: 110 - (reflection.kpi_metacognition * 8 * Math.sin(Math.PI*3/2))
                  };
                  
                  const kpiActionablePoint = {
                    x: 110 + (reflection.kpi_actionable * 8 * Math.cos(Math.PI)),
                    y: 110 - (reflection.kpi_actionable * 8 * Math.sin(Math.PI))
                  };
                  
                  const points = `${kpiDepthPoint.x},${kpiDepthPoint.y} ${kpiCoherencePoint.x},${kpiCoherencePoint.y} ${kpiMetacognitionPoint.x},${kpiMetacognitionPoint.y} ${kpiActionablePoint.x},${kpiActionablePoint.y}`;
                  
                  return (
                    <>
                      {/* Filled polygon */}
                      <polygon 
                        points={points} 
                        fill="rgb(0, 0, 0)"
                        fillOpacity="0.85"
                        className="dark:fill-neutral-700"
                        stroke="none"
                      />
                      
                      {/* Data points */}
                      <circle cx={kpiDepthPoint.x} cy={kpiDepthPoint.y} r="4" fill="rgb(59, 130, 246)" />
                      <circle cx={kpiCoherencePoint.x} cy={kpiCoherencePoint.y} r="4" fill="rgb(245, 158, 11)" />
                      <circle cx={kpiMetacognitionPoint.x} cy={kpiMetacognitionPoint.y} r="4" fill="rgb(139, 92, 246)" />
                      <circle cx={kpiActionablePoint.x} cy={kpiActionablePoint.y} r="4" fill="rgb(16, 185, 129)" />
                      
                      {/* Labels */}
                      <text x="110" y="20" textAnchor="middle" fontSize="11" fontWeight="500" fill="currentColor">Tiefe</text>
                      <text x="200" y="110" textAnchor="start" fontSize="11" fontWeight="500" fill="currentColor">Kohärenz</text>
                      <text x="110" y="200" textAnchor="middle" fontSize="11" fontWeight="500" fill="currentColor">Metakognition</text>
                      <text x="20" y="110" textAnchor="end" fontSize="11" fontWeight="500" fill="currentColor">Handlung</text>
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    );
  };
  
  return (
    <Card className="shadow-sm border-border/60 overflow-hidden">
      <CardHeader className={`pb-2 ${feedbackDepth === 'detailed' ? 'bg-muted/30 border-b' : ''}`}>
        <CardTitle className="text-base flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" />
          KPI-Bewertung
        </CardTitle>
        {feedbackDepth === 'detailed' && (
          <CardDescription>
            Detaillierte Analyse der Reflexionsqualität basierend auf vier Schlüsselindikatoren
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={`${feedbackDepth === 'detailed' ? 'p-5' : 'px-5 pt-3 pb-5'}`}>
        {renderKPIMetrics()}
      </CardContent>
      {feedbackDepth === 'detailed' && reflection.reflection_level && (
        <CardFooter className="pt-0 pb-4 px-5">
          <div className="w-full p-2 bg-primary/5 rounded-md flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm">Reflexionsniveau: <strong>{reflection.reflection_level}</strong></span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 