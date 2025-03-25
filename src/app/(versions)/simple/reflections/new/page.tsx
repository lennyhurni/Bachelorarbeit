"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { useState } from "react"
import { 
  BookOpen,
  Target,
  Clock,
  Calendar,
  ArrowLeft,
  Save,
  Home,
  ChevronRight,
  HelpCircle,
  Info,
  AlertCircle
} from "lucide-react"

const promptOptions = [
  "Was habe ich heute gelernt?",
  "Welche Herausforderungen habe ich gemeistert?",
  "Wie kann ich das Gelernte anwenden?",
  "Welche Erkenntnisse habe ich gewonnen?",
  "Was würde ich beim nächsten Mal anders machen?"
]

export default function NewReflection() {
  const [reflectionText, setReflectionText] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState(promptOptions[0])
  
  // Simple depth calculation based on text length and some key phrases
  const calculateDepth = (text: string) => {
    if (!text) return 0
    
    // Simple heuristics for depth calculation
    const length = text.length
    const hasAnalyticalPhrases = /weil|daher|deshalb|dadurch|erkenne ich|verstehe ich/i.test(text)
    const hasCriticalPhrases = /kritisch|hinterfrage|alternative|verbesserung|könnte ich|sollte ich/i.test(text)
    
    if (length > 200 && hasCriticalPhrases) return 3 // Critical
    if (length > 100 && hasAnalyticalPhrases) return 2 // Analytical
    if (length > 50) return 1 // Descriptive
    return 0 // Not enough content
  }
  
  const depth = calculateDepth(reflectionText)
  const depthLabels = ["Nicht genug Inhalt", "Beschreibend", "Analytisch", "Kritisch"]
  const depthPercent = depth * 33.3

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-4">
            <Link href="/simple/dashboard">
              <Button variant="ghost" size="icon">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/simple/reflections" className="hover:text-foreground">
                Reflexionen
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Neue Reflexion</span>
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
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>Neue Reflexion</CardTitle>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md text-xs text-blue-500 dark:text-blue-400 font-medium flex items-center gap-1 cursor-help">
                        <Info className="h-3 w-3" />
                        <span>Einfache Analyse</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div>
                        <p className="text-xs font-medium mb-1">Über die automatische Analyse</p>
                        <p className="text-xs">Diese einfache Version analysiert Ihren Text automatisch auf Reflexionstiefe. Fortgeschrittene Analysen sind in der adaptiven Version verfügbar.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>
                Verfassen Sie eine neue Reflexion zu Ihrem Lernprozess
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input id="title" placeholder="Geben Sie einen Titel ein" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="prompt">Reflexionsfrage auswählen</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-xs">
                            <p className="text-xs">Wählen Sie eine vorgegebene Reflexionsfrage als Ausgangspunkt Ihrer Überlegungen.</p>
                            <p className="text-xs font-medium text-amber-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              <span>In dieser Version sind die Reflexionsfragen statisch und nicht personalisiert.</span>
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Select 
                  value={selectedPrompt} 
                  onValueChange={setSelectedPrompt}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wählen Sie eine Reflexionsfrage" />
                  </SelectTrigger>
                  <SelectContent>
                    {promptOptions.map((prompt, index) => (
                      <SelectItem key={index} value={prompt}>
                        {prompt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reflection">Reflexion</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Versuchen Sie, nicht nur zu beschreiben, was passiert ist, sondern auch zu analysieren, warum es passiert ist, und zu überlegen, was Sie daraus lernen können.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                        <Info className="h-3 w-3 mr-1" />
                        Diese Reflexion wird automatisch auf ihre Reflexionstiefe analysiert.
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div>
                        <p className="text-xs font-medium mb-1">Automatische Analyse</p>
                        <p className="text-xs">Ein einfacher Algorithmus analysiert Ihren Text, um das Niveau Ihrer Reflexion zu bestimmen (beschreibend, analytisch oder kritisch). Dieser Prozess ist komplett lokal und Ihre Daten bleiben privat.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="date">Datum</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="duration">Dauer (Minuten)</Label>
                  <Input id="duration" type="number" placeholder="15" />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Link href="/simple/reflections" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Zurück
                  </Button>
                </Link>
                <Button className="flex-1">
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
                    <Target className="h-5 w-5 text-primary" />
                    <CardTitle>Reflexionstiefe</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div>
                            <p className="text-xs font-medium mb-1">Wie wird die Reflexionstiefe bestimmt?</p>
                            <p className="text-xs">Die Tiefe Ihrer Reflexion wird anhand von Textlänge und bestimmten Schlüsselwörtern bewertet, die auf unterschiedliche Reflexionsstufen hindeuten.</p>
                            <p className="text-xs mt-2">Beispiele für Schlüsselwörter:</p>
                            <ul className="text-xs list-disc list-inside mt-1">
                              <li>Analytisch: "weil", "daher", "verstehe ich"</li>
                              <li>Kritisch: "könnte besser", "sollte ich", "zukünftig"</li>
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <CardDescription>
                  Visuelle Bewertung Ihrer aktuellen Reflexion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Aktuelle Reflexionstiefe</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium underline decoration-dotted decoration-muted-foreground underline-offset-2 cursor-help">
                            {depth > 0 ? depthLabels[depth] : "Nicht genug Inhalt"}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div>
                            <p className="text-xs font-medium mb-1">Ihre aktuelle Einstufung</p>
                            <p className="text-xs">
                              {depth === 0 && "Ihr Text ist noch zu kurz für eine aussagekräftige Analyse. Schreiben Sie weiter, um eine Bewertung zu erhalten."}
                              {depth === 1 && "Ihre Reflexion ist hauptsächlich beschreibend. Versuchen Sie, mehr über die Ursachen und Bedeutungen nachzudenken."}
                              {depth === 2 && "Ihre Reflexion enthält analytische Elemente. Sie untersuchen Ursachen und Zusammenhänge."}
                              {depth === 3 && "Ihre Reflexion ist kritisch und tiefgehend. Sie hinterfragen Annahmen und ziehen Schlussfolgerungen."}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Progress value={depthPercent} className="h-2" />
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Beschreibend</span>
                    <span>Analytisch</span>
                    <span>Kritisch</span>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted mt-4">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Hinweise zur Reflexionstiefe:
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><strong>Beschreibend:</strong> Sie beschreiben das Ereignis oder die Erfahrung.</li>
                      <li><strong>Analytisch:</strong> Sie analysieren, warum etwas passiert ist und was Sie gelernt haben.</li>
                      <li><strong>Kritisch:</strong> Sie hinterfragen, ziehen Schlussfolgerungen und formulieren konkrete nächste Schritte.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 flex flex-col items-start">
                <div className="flex items-center text-sm mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="font-medium">Hinweis zur einfachen Version</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Diese Version bietet eine grundlegende Analyse der Reflexionstiefe. Für eine mehrdimensionale Analyse mit personalisierten Prompts nutzen Sie bitte die adaptive Version.
                </p>
              </CardFooter>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>Letzte Reflexionen</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Übersicht Ihrer letzten Reflexionen mit automatischer Tiefenanalyse.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium">JavaScript Grundlagen</h3>
                    <p className="text-sm text-muted-foreground">15. März, 15min</p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 cursor-help">
                          Analytisch
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Diese Reflexion enthält analytische Elemente. Sie untersuchen Ursachen und erklären Zusammenhänge.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium">Projektplanung</h3>
                    <p className="text-sm text-muted-foreground">10. März, 20min</p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 cursor-help">
                          Beschreibend
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Diese Reflexion ist hauptsächlich beschreibend. Sie konzentrieren sich auf die Schilderung der Ereignisse.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium">Teamkommunikation</h3>
                    <p className="text-sm text-muted-foreground">5. März, 25min</p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 cursor-help">
                          Kritisch
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Diese Reflexion ist kritisch und tiefgehend. Sie hinterfragen, ziehen Schlussfolgerungen und formulieren nächste Schritte.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 