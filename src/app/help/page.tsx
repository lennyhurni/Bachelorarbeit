"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Brain,
  PenTool,
  Calendar,
  Settings,
  LineChart,
  Lightbulb,
  BookOpen,
  Target,
  Sparkles,
  HelpCircle,
  Compass,
  Layers,
  ChevronRight,
  Search,
  FileText,
  BarChart2,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Info,
  Video
} from "lucide-react"

// Moon's Reflection Levels component for visualization
const MoonReflectionLevels = () => {
  return (
    <div className="space-y-4 my-6">
      <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/30">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2 mt-1">
            <FileText className="h-5 w-5 text-blue-700 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-base font-medium text-blue-700 dark:text-blue-400">Deskriptiv</h4>
            <p className="text-sm text-blue-700/80 dark:text-blue-400/80 mt-1">
              Beschreibt Ereignisse, Beobachtungen und Erfahrungen, ohne tiefere Analyse. 
              Der Text bleibt auf der Oberfläche der Beobachtungen.
            </p>
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/70 p-2 rounded">
              <strong>Beispiel:</strong> "Heute hatte ich ein Meeting mit dem Team und wir haben über das Projekt gesprochen."
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/50 p-2 mt-1">
            <Brain className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          </div>
          <div>
            <h4 className="text-base font-medium text-amber-700 dark:text-amber-400">Analytisch</h4>
            <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1">
              Untersucht Zusammenhänge, Gründe und Ursachen. Fragt nach dem "Warum" und analysiert verschiedene Faktoren.
            </p>
            <div className="mt-2 text-xs text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/70 p-2 rounded">
              <strong>Beispiel:</strong> "Das Meeting war ineffektiv, weil die Agenda fehlte und wir vom Thema abkamen. Dies führte zu Frustration im Team."
            </div>
          </div>
        </div>
        </div>

      <div className="rounded-lg border p-4 bg-emerald-50 dark:bg-emerald-950/30">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-2 mt-1">
            <Lightbulb className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="text-base font-medium text-emerald-700 dark:text-emerald-400">Kritisch</h4>
            <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80 mt-1">
              Betrachtet verschiedene Perspektiven, hinterfragt Annahmen, bezieht Kontextfaktoren ein und erreicht tiefere Bedeutungsebenen.
            </p>
            <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/70 p-2 rounded">
              <strong>Beispiel:</strong> "Die Meeting-Probleme spiegeln unsere Organisationskultur wider, die schnelles Handeln über strukturiertes Vorgehen stellt. Meine eigene Annahme, dass alle gleiche Prioritäten hätten, erwies sich als falsch."
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// KPI Explanation component
const KpiExplanation = ({ kpiName, icon, color, description }: { kpiName: string, icon: React.ReactNode, color: string, description: string }) => {
  return (
    <div className={`rounded-lg border p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-medium">{kpiName}</h4>
      </div>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export default function HelpPage() {
  return (
    <div className="py-6 space-y-6">
      <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hilfe & Informationen</h1>
          <p className="text-muted-foreground mt-1">Lernen Sie, wie Sie Reflectify optimal nutzen können</p>
        </div>
        <Button asChild>
          <Link href="https://reflectify-docs.example.com" className="gap-2" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Ausführliche Dokumentation
          </Link>
        </Button>
      </div>

      {/* Hero Section with clearer information */}
      <div className="px-6">
        <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 p-6 rounded-full">
                <Brain className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Willkommen bei Reflectify</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Reflectify ist eine KI-gestützte Plattform, die Ihnen hilft, Ihre Reflexionsfähigkeit kontinuierlich zu verbessern. 
                  Die KI analysiert Ihre Texte und bietet personalisierte Rückmeldungen für Ihr Lernwachstum.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline" className="bg-background">
                    KI-gestützte Analyse
                  </Badge>
                  <Badge variant="outline" className="bg-background">
                    Personalisierte Impulse
                  </Badge>
                  <Badge variant="outline" className="bg-background">
                    Fortschrittstracking
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Main Content */}
      <div className="px-6">
          <Tabs defaultValue="start" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="start" className="gap-2">
                <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Erste Schritte</span>
              <span className="inline sm:hidden">Start</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="process" className="gap-2">
                <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Reflexionsprozess</span>
              <span className="inline sm:hidden">Prozess</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">KI-Unterstützung</span>
              <span className="inline sm:hidden">KI</span>
              </TabsTrigger>
            </TabsList>

          <ScrollArea className="h-[700px] rounded-md border">
            <div className="p-6">
                  <TabsContent value="start" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Compass className="h-6 w-6 text-primary" />
                          <CardTitle>Erste Schritte mit Reflectify</CardTitle>
                        </div>
                        <CardDescription>
                          So starten Sie optimal mit der App
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col space-y-4 rounded-lg border p-6">
                        <div className="rounded-full bg-primary/10 p-3 self-start">
                              <PenTool className="h-6 w-6 text-primary" />
                            </div>
                        <div>
                            <h3 className="text-lg font-medium">1. Erste Reflexion</h3>
                          <p className="text-sm text-muted-foreground mt-2">
                              Erstellen Sie Ihre erste Reflexion über eine aktuelle Lernerfahrung.
                            Sie werden durch den strukturierten Prozess geführt.
                            </p>
                          <Button variant="link" size="sm" asChild className="px-0 mt-2">
                            <Link href="/reflections/new" className="gap-1">
                              <span>Neue Reflexion erstellen</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                          </div>
                      <div className="flex flex-col space-y-4 rounded-lg border p-6">
                        <div className="rounded-full bg-primary/10 p-3 self-start">
                              <Settings className="h-6 w-6 text-primary" />
                            </div>
                        <div>
                            <h3 className="text-lg font-medium">2. Personalisierung</h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Passen Sie die App an Ihre Bedürfnisse an, wie die Feedback-Tiefe
                            und andere Präferenzen in den Einstellungen.
                          </p>
                          <Button variant="link" size="sm" asChild className="px-0 mt-2">
                            <Link href="/settings" className="gap-1">
                              <span>Einstellungen öffnen</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                          </div>
                      <div className="flex flex-col space-y-4 rounded-lg border p-6">
                        <div className="rounded-full bg-primary/10 p-3 self-start">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
                        <div>
                            <h3 className="text-lg font-medium">3. Routine entwickeln</h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Legen Sie fest, wann Sie regelmäßig reflektieren möchten.
                            Reflektieren Sie über verschiedene Aspekte Ihres Lernens.
                          </p>
                          <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            <span>Regelmäßige Reflexion verbessert die Lerneffekte</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-4 rounded-lg border p-6">
                        <div className="rounded-full bg-primary/10 p-3 self-start">
                              <LineChart className="h-6 w-6 text-primary" />
                            </div>
                        <div>
                            <h3 className="text-lg font-medium">4. Fortschritt verfolgen</h3>
                          <p className="text-sm text-muted-foreground mt-2">
                              Beobachten Sie Ihre Entwicklung im Dashboard und entdecken
                            Sie Muster und Verbesserungspotenziale in Ihrem Lernverhalten.
                            </p>
                          <Button variant="link" size="sm" asChild className="px-0 mt-2">
                            <Link href="/dashboard" className="gap-1">
                              <span>Dashboard öffnen</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                          </div>
                        </div>
                      </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <Video className="h-4 w-4 text-primary" />
                      <span>Tutorial-Videos finden Sie im Bereich "FAQ"</span>
                    </div>
                  </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="faq" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-6 w-6 text-primary" />
                      <CardTitle>Häufig gestellte Fragen</CardTitle>
                        </div>
                        <CardDescription>
                      Antworten auf Ihre wichtigsten Fragen
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Wie funktioniert die KI-Analyse meiner Reflexionstexte?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">
                            Reflectify nutzt fortschrittliche NLP-Modelle (Natural Language Processing), um Ihre Texte auf verschiedene Qualitätsdimensionen zu analysieren:
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-4">
                            <li>Die semantische Tiefe der Reflexion (BERT)</li>
                            <li>Die Kohärenz des Textes (linguistische Analyse)</li>
                            <li>Metakognitive Elemente (Selbstreflexion über Denkprozesse)</li>
                            <li>Handlungsorientierung (konkrete Schlussfolgerungen)</li>
                          </ul>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Alle Analysen erfolgen lokal auf Ihrem Gerät, ohne Daten an externe Server zu senden.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Was bedeutet die Feedback-Tiefe Einstellung?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">
                            Die Feedback-Tiefe bestimmt, wie detailliert die KI-Analysen und Empfehlungen ausfallen:
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <li><strong>Einfach:</strong> Grundlegende Scores und einfache Empfehlungen</li>
                            <li><strong>Standard:</strong> Detailliertere Analysen mit konkreten Verbesserungsvorschlägen</li>
                            <li><strong>Detailliert:</strong> Tiefgehende Analysen mit wissenschaftlichen Hintergründen und maßgeschneiderten Übungen</li>
                          </ul>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Sie können die Einstellung jederzeit im Dashboard oder in den Einstellungen ändern.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Warum sind die Reflexionsebenen nach Moon wichtig?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Das Reflexionsmodell nach Jenny Moon unterscheidet drei Hauptebenen der Reflexion, die eine Entwicklung von oberflächlicher zu tiefgehender Reflexion darstellen:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Indem Sie verstehen, auf welcher Ebene Ihre Reflexionen stattfinden, können Sie gezielt an einer Vertiefung Ihrer Reflexionsfähigkeit arbeiten. Das System unterstützt Sie, von deskriptiven zu analytischen und schließlich kritischen Reflexionen zu gelangen.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>Wie werden meine Daten geschützt?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">
                            Datenschutz ist für uns zentral. Reflectify verarbeitet Ihre Reflexionstexte lokal auf Ihrem Gerät, ohne sie an externe Server zu senden. Alle KI-Analysen finden direkt in Ihrem Browser statt.
                          </p>
                          <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 dark:bg-green-950/30 rounded text-sm text-green-700 dark:text-green-300">
                            <CheckCircle className="h-4 w-4" />
                            <span>Keine Cloud-Speicherung sensibler Inhalte</span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-5">
                        <AccordionTrigger>Kann ich meine Daten exportieren?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">
                            Ja, Sie können alle Ihre Reflexionen und die dazugehörigen Analysen in verschiedenen Formaten exportieren (PDF, Markdown, JSON). Diese Funktion finden Sie in den Einstellungen unter "Datenexport".
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                      </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <Search className="h-4 w-4" />
                      <span>Weitere Fragen? Nutzen Sie die Suche</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="mailto:support@reflectify.example.com">Kontakt</Link>
                    </Button>
                  </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="process" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                      <Layers className="h-6 w-6 text-primary" />
                          <CardTitle>Der Reflexionsprozess</CardTitle>
                        </div>
                        <CardDescription>
                      Verstehen Sie die verschiedenen Reflexionsebenen
                        </CardDescription>
                      </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Moons Reflexionsebenen</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Jenny Moon beschreibt drei zentrale Ebenen der Reflexion, die eine Entwicklung vom einfachen Beschreiben bis zum kritischen Reflektieren darstellen.
                      </p>
                      
                      <MoonReflectionLevels />
                      
                      <div className="rounded-lg border-l-4 border-primary p-4 bg-primary/5 mt-4">
                        <p className="text-sm">
                          <strong>Tipp:</strong> Versuchen Sie, in Ihren Reflexionen alle drei Ebenen zu durchlaufen. Beginnen Sie mit der Beschreibung, analysieren Sie dann und erreichen Sie schließlich die kritische Reflexionsebene.
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="font-medium mb-4">Reflexionsprozess in 4 Schritten</h3>
                      
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-primary/20 before:to-transparent">
                          <div className="relative flex items-center gap-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow">
                              <span className="text-sm font-medium">1</span>
                            </div>
                            <div className="flex flex-col">
                              <h4 className="font-medium">Situation beschreiben</h4>
                              <p className="text-sm text-muted-foreground">
                                Beschreiben Sie die Lernsituation oder -erfahrung detailliert.
                                Was ist passiert? Wann und wo? Wer war beteiligt?
                              </p>
                            </div>
                          </div>

                          <div className="relative flex items-center gap-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow">
                              <span className="text-sm font-medium">2</span>
                            </div>
                            <div className="flex flex-col">
                              <h4 className="font-medium">Gedanken & Gefühle</h4>
                              <p className="text-sm text-muted-foreground">
                                Reflektieren Sie über Ihre emotionale Reaktion und Gedanken.
                                Was haben Sie gefühlt? Was ging Ihnen durch den Kopf?
                              </p>
                            </div>
                          </div>

                          <div className="relative flex items-center gap-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow">
                              <span className="text-sm font-medium">3</span>
                            </div>
                            <div className="flex flex-col">
                              <h4 className="font-medium">Bewertung & Analyse</h4>
                              <p className="text-sm text-muted-foreground">
                                Analysieren Sie die Situation objektiv. Was lief gut?
                                Was hätte besser sein können? Welche Faktoren spielten eine Rolle?
                              </p>
                            </div>
                          </div>

                          <div className="relative flex items-center gap-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow">
                              <span className="text-sm font-medium">4</span>
                            </div>
                            <div className="flex flex-col">
                              <h4 className="font-medium">Schlussfolgerungen</h4>
                              <p className="text-sm text-muted-foreground">
                                Ziehen Sie konkrete Schlüsse. Was haben Sie gelernt?
                                Wie können Sie das Gelernte in Zukunft anwenden?
                              </p>
                          </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-6">
                <Card className="border-primary/30">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Brain className="h-6 w-6 text-primary" />
                      <CardTitle>KI-Unterstützung & Transparenz</CardTitle>
                        </div>
                        <CardDescription>
                      Verstehen Sie, wie die KI-Funktionen Sie unterstützen
                        </CardDescription>
                      </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">KPI-Analyse der Reflexionstexte</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Reflectify analysiert Ihre Texte anhand von vier Schlüsselindikatoren (KPIs), die verschiedene Qualitätsdimensionen reflektieren:
                      </p>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <KpiExplanation 
                          kpiName="Reflexionstiefe" 
                          icon={<Brain className="h-5 w-5 text-blue-600" />}
                          color="bg-blue-50/50 dark:bg-blue-950/20" 
                          description="Misst, wie tief Ihre Reflexion über die Oberfläche hinausgeht, in Bedeutungsebenen vordringt und verschiedene Perspektiven einbezieht."
                        />
                        <KpiExplanation 
                          kpiName="Kohärenz" 
                          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                          color="bg-green-50/50 dark:bg-green-950/20" 
                          description="Bewertet die logische Struktur und den Zusammenhang Ihrer Gedanken, wie klar und flüssig Ihre Reflexion aufgebaut ist."
                        />
                        <KpiExplanation 
                          kpiName="Metakognition" 
                          icon={<Lightbulb className="h-5 w-5 text-amber-600" />}
                          color="bg-amber-50/50 dark:bg-amber-950/20" 
                          description="Erfasst, wie gut Sie über Ihren eigenen Denkprozess reflektieren, also 'Denken über das Denken'."
                        />
                        <KpiExplanation 
                          kpiName="Handlungsorientierung" 
                          icon={<Target className="h-5 w-5 text-red-600" />}
                          color="bg-red-50/50 dark:bg-red-950/20" 
                          description="Bewertet, wie konkret und umsetzbar die aus Ihrer Reflexion abgeleiteten Handlungsschritte und Lösungsansätze sind."
                        />
                            </div>
                          </div>

                    <div className="border-t pt-6">
                      <h3 className="font-medium mb-3">KI-Transparenz</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Reflectify legt Wert auf Transparenz bei der KI-Nutzung. Sie können jederzeit einsehen, wie die KI zu ihren Analysen gelangt:
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="rounded-full bg-primary/10 p-2">
                            <BarChart2 className="h-5 w-5 text-primary" />
                              </div>
                          <div>
                            <h4 className="font-medium">Detaillierte KPI-Erläuterungen</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Zu jeder KPI-Bewertung können Sie sich die Berechnungsgrundlage und konkreten Textelemente anzeigen lassen, die zu dem Wert beigetragen haben.
                              </p>
                            </div>
                          </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                              </div>
                          <div>
                            <h4 className="font-medium">Adaptive Reflexionsimpulse</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Die KI generiert personalisierte Schreibimpulse basierend auf Ihren bisherigen Reflexionen, um gezielt Ihre Entwicklung zu fördern. Sie können nachvollziehen, warum bestimmte Impulse vorgeschlagen werden.
                              </p>
                            </div>
                          </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="rounded-full bg-primary/10 p-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                              </div>
                          <div>
                            <h4 className="font-medium">Fortschrittsanalyse</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Die Entwicklung Ihrer Reflexionsfähigkeit wird über Zeit visualisiert und analysiert. Sie können nachvollziehen, welche Faktoren zu Verbesserungen beigetragen haben.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20 flex gap-3 items-start">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-700 dark:text-amber-400">Wichtiger Hinweis zur KI</h4>
                        <p className="text-sm text-amber-600/90 dark:text-amber-300/90 mt-1">
                          Reflectify nutzt KI als Unterstützungswerkzeug, nicht als Ersatz für Ihre eigene Reflexion. Die KI-Analysen sind Anregungen, die Ihnen helfen sollen, Ihre Reflexionsfähigkeit zu verbessern. Die endgültige Bewertung und Interpretation bleibt immer bei Ihnen.
                        </p>
                    </div>
                  </div>
                </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/settings" className="gap-1">
                        <Settings className="h-4 w-4" />
                        <span>KI-Einstellungen anpassen</span>
                      </Link>
                    </Button>
                  </CardFooter>
              </Card>
              </TabsContent>
            </div>
          </ScrollArea>
          </Tabs>
        </div>
    </div>
  )
}