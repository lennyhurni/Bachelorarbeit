import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { 
  BookOpen, 
  Target, 
  LineChart, 
  Calendar, 
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Info,
  HelpCircle,
  AlertCircle
} from "lucide-react"

export default function SimpleDashboard() {
  // Beispiel für vergangene Reflexionen
  const pastReflections = [
    { 
      id: 1, 
      title: "JavaScript Grundlagen", 
      date: "15. März 2024", 
      depth: "Analytisch", 
      snippet: "Ich habe heute die Grundlagen von JavaScript gelernt. Besonders die Konzepte von Variablen und Funktionen..." 
    },
    { 
      id: 2, 
      title: "Projektplanung", 
      date: "10. März 2024", 
      depth: "Beschreibend", 
      snippet: "In der Projektplanung haben wir heute die wichtigsten Meilensteine für das kommende Quartal festgelegt..." 
    },
    { 
      id: 3, 
      title: "Teamkommunikation", 
      date: "5. März 2024", 
      depth: "Kritisch", 
      snippet: "Die Kommunikation im Team könnte verbessert werden. Ich habe bemerkt, dass wir oft aneinander vorbeireden..." 
    },
    { 
      id: 4, 
      title: "Datenbank-Design", 
      date: "1. März 2024", 
      depth: "Analytisch", 
      snippet: "Beim Entwurf der Datenbankstruktur haben wir uns für ein relationales Modell entschieden, weil..." 
    },
    { 
      id: 5, 
      title: "UI/UX-Workshop", 
      date: "25. Februar 2024", 
      depth: "Beschreibend", 
      snippet: "Im Workshop haben wir verschiedene UI-Konzepte kennengelernt und praktische Übungen durchgeführt..." 
    }
  ]

  // Beispiel für Reflexionsstatistiken
  const stats = {
    totalReflections: 12,
    weeklyProgress: 60, // In Prozent
    targetPerWeek: 5,
    completedThisWeek: 3,
    averageDepth: {
      descriptive: 50, // Prozent der Reflexionen
      analytical: 30,
      critical: 20
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <Link href="/simple/reflections/new">
          <Button>
            Neue Reflexion erstellen
          </Button>
        </Link>
      </div>

      {/* Statistik-Karten */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-1">
              <CardTitle className="text-sm font-medium">Reflexionen insgesamt</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Gesamtzahl aller von Ihnen erstellten Reflexionen seit Beginn der Nutzung.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReflections}</div>
            <p className="text-xs text-muted-foreground">
              Alle Ihre bisherigen Reflexionen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-1">
              <CardTitle className="text-sm font-medium">Wöchentliche Reflexionen</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Fortschritt zu Ihrem wöchentlichen Reflexionsziel. Regelmässige Reflexion verbessert Ihren Lernprozess.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedThisWeek}/{stats.targetPerWeek}</div>
            <Progress
              value={stats.weeklyProgress}
              className="h-2 mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.weeklyProgress}% des Wochenziels erreicht
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-1">
              <CardTitle className="text-sm font-medium">Reflexionsdauer</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Die durchschnittliche Zeit, die Sie für eine Reflexion verwenden. Qualität ist wichtiger als Quantität.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 Min</div>
            <p className="text-xs text-muted-foreground">
              Durchschnittliche Dauer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-1">
              <CardTitle className="text-sm font-medium">Abgeschlossene Ziele</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Anzahl der Lernziele, die Sie durch Ihre Reflexionen erreicht haben.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +2 im letzten Monat
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hauptinhalt: 2-Spalten-Layout */}
      <div className="grid gap-6 md:grid-cols-7 mt-8">
        {/* Fortschrittsübersicht (grösser) */}
        <Card className="md:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                <CardTitle>Reflexionstiefe-Übersicht</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div>
                        <p className="text-xs font-medium mb-1">Wie wird die Reflexionstiefe gemessen?</p>
                        <p className="text-xs">Die Reflexionstiefe wird automatisch anhand sprachlicher Muster und Ausdrücke in Ihren Texten ermittelt. Das System erkennt, ob Sie beschreibend, analytisch oder kritisch reflektieren.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <div className="flex items-center text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-full">
                <Info className="h-3 w-3 mr-1 text-blue-500" />
                KI-analysiert
              </div>
            </div>
            <CardDescription>
              Verteilung Ihrer Reflexionen nach Tiefe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <span>Beschreibend</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">Beschreibende Reflexionen schildern hauptsächlich Ereignisse und Erfahrungen. Sie bilden die Grundlage jeder Reflexion.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span>{stats.averageDepth.descriptive}%</span>

                </div>
                <Progress value={stats.averageDepth.descriptive} className="h-2 bg-blue-100" />
                <p className="text-xs text-muted-foreground">
                  Beschreibend: Sie schildern Ereignisse und Erfahrungen
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <span>Analytisch</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">Analytische Reflexionen untersuchen Ursachen und Zusammenhänge. Sie enthalten oft Ausdrücke wie "weil", "daher" oder "verstehe ich".</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span>{stats.averageDepth.analytical}%</span>
                </div>
                <Progress value={stats.averageDepth.analytical} className="h-2 bg-green-100" />
                <p className="text-xs text-muted-foreground">
                  Analytisch: Sie untersuchen Ursachen und Zusammenhänge
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <span>Kritisch</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">Kritische Reflexionen hinterfragen Annahmen und ziehen Schlussfolgerungen. Sie enthalten oft Ausdrücke wie "könnte besser", "sollte ich" oder "in Zukunft werde ich".</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span>{stats.averageDepth.critical}%</span>
                </div>
                <Progress value={stats.averageDepth.critical} className="h-2 bg-purple-100" />
                <p className="text-xs text-muted-foreground">
                  Kritisch: Sie hinterfragen und ziehen Schlussfolgerungen
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aktuelle Ziele und Reflexionsprompts */}
        <Card className="md:col-span-3">
          <Tabs defaultValue="prompts">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <CardTitle>Reflexionshilfen</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Diese statischen Reflexionsfragen und Ziele werden von Experten für Reflexives Lernen bereitgestellt, um Ihnen den Einstieg zu erleichtern.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <TabsList className="mt-2 grid grid-cols-2">
                <TabsTrigger value="prompts">Prompts</TabsTrigger>
                <TabsTrigger value="goals">Ziele</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="pt-4">
              <TabsContent value="prompts" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <p className="text-sm">Was haben Sie aus Ihrer letzten Aufgabe gelernt und wie können Sie dieses Wissen in Zukunft anwenden?</p>
                  </div>
                  <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <p className="text-sm">Welche Herausforderungen haben Sie gemeistert und was hat Ihnen dabei geholfen?</p>
                  </div>
                  <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <p className="text-sm">Beschreiben Sie einen Moment, in dem Sie überrascht waren. Was hat Sie überrascht und warum?</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-3 w-3" />
                  <span>Diese Fragen werden nicht personalisiert und bleiben immer gleich.</span>
                </div>
              </TabsContent>
              
              <TabsContent value="goals" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Wöchentliche Reflexion einhalten</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Mehr analytische Reflexionen schreiben</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Konkrete Handlungsschritte ableiten</span>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Letzte Reflexionen */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Letzte Reflexionen</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Ihre letzten Reflexionen werden automatisch nach ihrer Tiefe kategorisiert. Angezeigt werden Titel, Datum und ein kurzer Ausschnitt.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>
              Ihre letzten 5 Einträge mit Tiefenanalyse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastReflections.map(reflection => (
                <div 
                  key={reflection.id} 
                  className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{reflection.title}</h3>
                      <p className="text-sm text-muted-foreground">{reflection.date}</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${reflection.depth === "Beschreibend" ? "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300" : ""}
                              ${reflection.depth === "Analytisch" ? "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" : ""}
                              ${reflection.depth === "Kritisch" ? "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300" : ""}
                            `}
                          >
                            {reflection.depth}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div>
                            <p className="text-xs font-medium mb-1">Automatische Analyse</p>
                            <p className="text-xs">Diese Einstufung basiert auf der Analyse Ihres Textes durch einen Algorithmus, der die Tiefe und Art Ihrer Reflexion erkennt.</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{reflection.snippet}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 