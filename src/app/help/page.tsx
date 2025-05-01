export const dynamic = 'force-dynamic'

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
            <h4 className="text-base font-medium text-blue-700 dark:text-blue-400">Beschreibend</h4>
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
    <div className="py-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hilfe & Informationen</h1>
          <p className="text-muted-foreground mt-1">Lernen Sie, wie Sie Reflectify optimal nutzen können</p>
        </div>
        <Button asChild>
          <Link href="https://docs.reflectify-Example.com" className="gap-2" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Ausführliche Dokumentation
          </Link>
        </Button>
      </div>

      {/* Hero Section with clearer information */}
      <div className="px-6">
        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 p-6 rounded-full">
                <Brain className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Willkommen bei Reflectify</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Reflectify ist eine KI-gestützte Plattform, die Ihnen hilft, Ihre Reflexionsfähigkeit kontinuierlich zu verbessern. 
                  Die KI analysiert Ihre Texte und bietet personalisiertes Feedback für Ihr Lernwachstum.
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
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
            <TabsTrigger value="methods" className="gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Methoden</span>
              <span className="inline sm:hidden">Methoden</span>
            </TabsTrigger>
            <TabsTrigger value="glossary" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Glossar</span>
              <span className="inline sm:hidden">Glossar</span>
            </TabsTrigger>
          </TabsList>

          <Card className="border-border/60 shadow-sm">
            <ScrollArea className="h-[650px]">
              <div className="p-6">
                <TabsContent value="start" className="mt-0 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Compass className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold">Erste Schritte mit Reflectify</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      So starten Sie optimal mit der App
                    </p>
                    
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
                            Legen Sie fest, wann Sie regelmässig reflektieren möchten.
                            Reflektieren Sie über verschiedene Aspekte Ihres Lernens.
                          </p>
                          <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            <span>Regelmässige Reflexion verbessert die Lerneffekte</span>
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
                  </div>
                </TabsContent>
                
                <TabsContent value="faq" className="mt-0">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold">Häufig gestellte Fragen</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Antworten auf Ihre wichtigsten Fragen
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Wie funktioniert die KI-Analyse meiner Reflexionstexte?</AccordionTrigger>
                      <AccordionContent>
                        Reflectify nutzt eine Kombination aus Google Natural Language API und OpenAI GPT-4.1, um Ihre Texte auf verschiedene Qualitätsmerkmale zu analysieren. Die linguistische Analyse bewertet objektive Textmerkmale, während das GPT-Modell den Inhalt interpretiert. Das Ergebnis sind quantitative Metriken und qualitatives Feedback.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Was bedeutet die Feedback-Tiefe Einstellung?</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">Die Feedback-Tiefe bestimmt, wie detailliert die KI-Analysen und Empfehlungen ausfallen:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Einfach:</strong> Kompakte, leicht verständliche Rückmeldung für Einsteiger oder schnelle Überprüfungen</li>
                          <li><strong>Standard:</strong> Ausgewogenes Feedback mit detaillierteren Metriken und konkreten Verbesserungsvorschlägen</li>
                          <li><strong>Detailliert:</strong> Umfassende Analyse mit theoretischen Bezügen und tiefgehender Interpretation für fortgeschrittene Anwender</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Wie werden meine Daten geschützt?</AccordionTrigger>
                      <AccordionContent>
                        Datenschutz ist für uns zentral. Reflectify verarbeitet Ihre Reflexionstexte sicher und entsprechend Ihrer Datenschutzeinstellungen. Alle Daten werden verschlüsselt übertragen und gespeichert.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Was bedeuten die verschiedenen KPI-Werte?</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">Die vier KPIs (Key Performance Indicators) bewerten verschiedene Aspekte Ihrer Reflexion:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Reflexionstiefe:</strong> Misst, wie tief Sie über die Oberfläche hinausgehen und Bedeutungen ergründen</li>
                          <li><strong>Kohärenz:</strong> Bewertet die logische Struktur und den Zusammenhang Ihrer Gedanken</li>
                          <li><strong>Metakognition:</strong> Erfasst, wie bewusst Sie über Ihr eigenes Denken reflektieren</li>
                          <li><strong>Handlungsorientierung:</strong> Bewertet, inwieweit Sie konkrete Handlungen aus Ihren Erkenntnissen ableiten</li>
                        </ul>
                        <p className="mt-2">Höhere Werte (1-10) deuten auf eine stärkere Ausprägung dieser Qualitätsmerkmale hin.</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger>Wie kann ich meine Reflexion verbessern?</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">Um Ihre Reflexionen zu verbessern:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Fragen Sie mehrfach "Warum?" anstatt nur zu beschreiben, was passiert ist</li>
                          <li>Betrachten Sie die Situation aus verschiedenen Perspektiven</li>
                          <li>Reflektieren Sie über Ihr eigenes Denken und Ihre Annahmen</li>
                          <li>Leiten Sie konkrete Handlungsschritte oder Erkenntnisse ab</li>
                          <li>Nutzen Sie die adaptiven Fragen in der App als Anregung</li>
                          <li>Sehen Sie sich die Beispielmethoden im Bereich "Methoden" an</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                      <AccordionTrigger>Wie oft sollte ich reflektieren?</AccordionTrigger>
                      <AccordionContent>
                        Die Häufigkeit hängt von Ihren persönlichen Zielen ab. Für optimale Lerneffekte empfehlen wir eine Reflexion nach bedeutsamen Ereignissen oder Lernerfahrungen. Eine regelmäßige wöchentliche Reflexion kann Ihnen helfen, kontinuierlich Ihre Reflexionsfähigkeit zu verbessern und langfristige Entwicklungen zu erkennen.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-7">
                      <AccordionTrigger>Kann die KI falsch liegen?</AccordionTrigger>
                      <AccordionContent>
                        Ja, KI-Systeme haben Grenzen. Während die Analyse auf wissenschaftlichen Modellen basiert, kann sie den individuellen Kontext oder spezifische Nuancen Ihrer Reflexion nicht immer perfekt erfassen. Betrachten Sie die KI-Analyse als unterstützendes Werkzeug, nicht als endgültige Bewertung. Ihre eigene kritische Einschätzung bleibt wichtig.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="process" className="mt-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold">Der Reflexionsprozess</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Verstehen Sie die verschiedenen Reflexionsebenen
                  </p>
                  
                  <div>
                    <h4 className="font-medium mb-2">Moons Reflexionsebenen</h4>
                    <MoonReflectionLevels />
                  </div>
                </TabsContent>
                
                <TabsContent value="ai" className="mt-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold">KI-Unterstützung & Transparenz</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Verstehen Sie, wie die KI-Funktionen Sie unterstützen
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">KPI-Analyse der Reflexionstexte</h4>
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
                          icon={<Brain className="h-5 w-5 text-purple-600" />}
                          color="bg-purple-50/50 dark:bg-purple-950/20" 
                          description="Erfasst, wie bewusst Sie über Ihr eigenes Denken reflektieren und Ihre kognitiven Prozesse, Annahmen und Überzeugungen erkennen und hinterfragen."
                        />
                        <KpiExplanation 
                          kpiName="Handlungsorientierung" 
                          icon={<Target className="h-5 w-5 text-amber-600" />}
                          color="bg-amber-50/50 dark:bg-amber-950/20" 
                          description="Bewertet, inwieweit Sie konkrete Handlungsschritte aus Ihren Erkenntnissen ableiten und zukunftsorientierte Lösungsansätze entwickeln."
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Hybride KI-Technologie</h4>
                      <div className="rounded-lg border p-4 bg-primary/5 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full bg-primary/10 p-2 mt-1">
                            <Sparkles className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h5 className="text-base font-medium">Zwei-Komponenten-Analyse</h5>
                            <p className="text-sm text-muted-foreground mt-1">
                              Reflectify nutzt eine innovative Kombination aus zwei KI-Technologien, um hochwertige und zuverlässige Analysen zu liefern:
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-full">
                              <BarChart2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <h5 className="text-sm font-medium">Google Natural Language API</h5>
                          </div>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <p>
                              Liefert quantitative Metriken durch wissenschaftlich fundierte linguistische Analysen:
                            </p>
                            <ul className="pl-4 space-y-1 list-disc">
                              <li>Linguistische Strukturanalyse für Kohärenz</li>
                              <li>Syntaktische Komplexitätsbewertung für Reflexionstiefe</li>
                              <li>Entitäten- und Sentiment-Analyse für Metakognition</li>
                              <li>Handlungs- und Zukunftsorientierung für Aktionsplanung</li>
                            </ul>
                            <p className="pt-1">
                              Diese Analysekomponente wertet objektive Textmerkmale aus und berechnet die KPI-Werte auf einer 10-Punkte-Skala.
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1.5 rounded-full">
                              <Brain className="h-4 w-4 text-emerald-600" />
                            </div>
                            <h5 className="text-sm font-medium">OpenAI GPT-4.1 Modell</h5>
                          </div>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <p>
                              Liefert qualitative Analysen mit theoretischer Fundierung:
                            </p>
                            <ul className="pl-4 space-y-1 list-disc">
                              <li>Bestimmung der Reflexionsebene nach Moon (2004)</li>
                              <li>Personalisiertes Feedback zur Verbesserung</li>
                              <li>Extraktion zentraler Erkenntnisse</li>
                              <li>Anpassung an Ihr gewähltes Feedback-Level</li>
                            </ul>
                            <p className="pt-1">
                              Diese Komponente ergänzt die quantitativen Metriken mit kontextbezogenen qualitativen Einsichten.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4 mt-4 bg-primary/5">
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          Wie die KI-Systeme zusammenarbeiten
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          Bei jeder Reflexionsanalyse arbeiten beide Systeme parallel: Die Google-API berechnet präzise numerische Werte für die KPIs, während das GPT-Modell eine tiefergehende inhaltliche Analyse durchführt. Diese Kombination bietet sowohl objektive Bewertungen durch die linguistische Analyse als auch kontextsensitives Verständnis durch das große Sprachmodell. Das System verfügt zudem über Fallback-Mechanismen, die eine Analyse auch dann ermöglichen, wenn einer der Dienste nicht verfügbar sein sollte.
                        </p>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20 flex gap-3 items-start">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-700 dark:text-amber-400">Wichtiger Hinweis zur KI</h4>
                        <p className="text-sm text-amber-600/90 dark:text-amber-300/90 mt-1">
                          Reflectify nutzt KI als Unterstützungswerkzeug, nicht als Ersatz für Ihre eigene Reflexion.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="methods" className="mt-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold">Reflexionsmethoden</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Praktische Techniken zur Verbesserung Ihrer Reflexionspraxis
                  </p>
                  
                  <div className="space-y-6">
                    {/* Methode 1: Gibbs Reflexionszyklus */}
                    <div className="rounded-lg border p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                          <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="text-lg font-medium">Gibbs Reflexionszyklus</h4>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        Ein strukturierter 6-Schritte-Prozess zur systematischen Reflexion von Erfahrungen
                      </p>
                      
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        <div className="p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                          <h5 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">1. Beschreibung</h5>
                          <p className="text-xs text-blue-600/80 dark:text-blue-300/80">Was ist passiert? Beschreiben Sie die Situation objektiv.</p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                          <h5 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">2. Gefühle</h5>
                          <p className="text-xs text-blue-600/80 dark:text-blue-300/80">Welche Gefühle und Gedanken hatten Sie während der Situation?</p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                          <h5 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">3. Bewertung</h5>
                          <p className="text-xs text-blue-600/80 dark:text-blue-300/80">Was war positiv oder negativ an der Erfahrung?</p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                          <h5 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">4. Analyse</h5>
                          <p className="text-xs text-blue-600/80 dark:text-blue-300/80">Welchen Sinn können Sie aus der Situation ziehen?</p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                          <h5 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">5. Schlussfolgerung</h5>
                          <p className="text-xs text-blue-600/80 dark:text-blue-300/80">Was hätte anders gemacht werden können?</p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                          <h5 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">6. Aktionsplan</h5>
                          <p className="text-xs text-blue-600/80 dark:text-blue-300/80">Was würden Sie beim nächsten Mal anders machen?</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Methode 2: 5-Warum-Methode */}
                    <div className="rounded-lg border p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                          <Search className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h4 className="text-lg font-medium">5-Warum-Methode</h4>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        Eine einfache Technik zur Ursachenanalyse durch wiederholtes Fragen nach dem "Warum"
                      </p>
                      
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                          <p className="text-sm">
                            <span className="font-medium">Anleitung:</span> Beginnen Sie mit einer Beobachtung oder einem Problem und fragen Sie dann fünfmal "Warum?", wobei jede Antwort als Basis für die nächste Frage dient.
                          </p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/80 dark:border-amber-900/20">
                          <h5 className="text-sm font-medium mb-2">Beispiel:</h5>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Beobachtung:</strong> Meine Präsentation kam nicht gut an.</li>
                            <li><strong>Warum? (1):</strong> Die Teilnehmer schienen verwirrt.</li>
                            <li><strong>Warum? (2):</strong> Meine Erklärungen waren zu komplex.</li>
                            <li><strong>Warum? (3):</strong> Ich habe zu viele Fachbegriffe verwendet.</li>
                            <li><strong>Warum? (4):</strong> Ich habe die Vorkenntnisse des Publikums überschätzt.</li>
                            <li><strong>Warum? (5):</strong> Ich habe keine Vorab-Analyse der Zielgruppe durchgeführt.</li>
                            <li><strong>Erkenntnis:</strong> Ich muss vor Präsentationen das Vorwissen meiner Zielgruppe besser einschätzen.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Methode 3: STARR-Methode */}
                    <div className="rounded-lg border p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full">
                          <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h4 className="text-lg font-medium">STARR-Methode</h4>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        Ein strukturierter Ansatz zur Reflexion über konkrete Situationen und deren Ergebnisse
                      </p>
                      
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="p-3 rounded-md bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                          <h5 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">S - Situation</h5>
                          <p className="text-xs text-emerald-600/80 dark:text-emerald-300/80">
                            Beschreiben Sie den Kontext und die Rahmenbedingungen.
                          </p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                          <h5 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">T - Task</h5>
                          <p className="text-xs text-emerald-600/80 dark:text-emerald-300/80">
                            Welche Aufgabe oder Herausforderung mussten Sie bewältigen?
                          </p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                          <h5 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">A - Action</h5>
                          <p className="text-xs text-emerald-600/80 dark:text-emerald-300/80">
                            Welche konkreten Maßnahmen haben Sie ergriffen?
                          </p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                          <h5 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">R - Result</h5>
                          <p className="text-xs text-emerald-600/80 dark:text-emerald-300/80">
                            Was waren die Ergebnisse oder Konsequenzen?
                          </p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                          <h5 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">R - Reflection</h5>
                          <p className="text-xs text-emerald-600/80 dark:text-emerald-300/80">
                            Was haben Sie gelernt? Was würden Sie anders machen?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="glossary" className="mt-0">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold">Glossar</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Erklärungen der wichtigsten Fachbegriffe zur Reflexion
                  </p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-1.5">Reflexion</h4>
                        <p className="text-xs text-muted-foreground">
                          Ein bewusster Denkprozess, bei dem Erfahrungen, Ereignisse und Handlungen systematisch betrachtet werden, um daraus zu lernen und das eigene Denken und Handeln weiterzuentwickeln.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-1.5">Metakognition</h4>
                        <p className="text-xs text-muted-foreground">
                          Das Nachdenken über das eigene Denken. Die Fähigkeit, die eigenen kognitiven Prozesse bewusst wahrzunehmen, zu verstehen und zu regulieren.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-1.5">Kritische Reflexion</h4>
                        <p className="text-xs text-muted-foreground">
                          Eine tiefere Ebene der Reflexion, bei der Annahmen, Überzeugungen und Werte bewusst hinterfragt und aus verschiedenen Perspektiven betrachtet werden.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-1.5">Reflexionstiefe</h4>
                        <p className="text-xs text-muted-foreground">
                          Das Ausmaß, in dem eine Reflexion über die reine Beschreibung hinausgeht und tiefere Bedeutungsebenen, Ursachen, Zusammenhänge oder verschiedene Perspektiven einbezieht.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-1.5">Handlungsorientierung</h4>
                        <p className="text-xs text-muted-foreground">
                          Die Fähigkeit, aus reflektierten Erkenntnissen konkrete, praktische Handlungsschritte abzuleiten und zu planen.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-1.5">Kohärenz</h4>
                        <p className="text-xs text-muted-foreground">
                          Der logische Zusammenhang und die strukturelle Klarheit in einem Text oder Gedankengang, die es ermöglichen, einen roten Faden zu erkennen und Ideen nachzuvollziehen.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-1.5">Moon's Reflexionsebenen</h4>
                        <p className="text-xs text-muted-foreground">
                          Ein Modell von Jennifer Moon, das Reflexion in hierarchische Ebenen einteilt: von beschreibend (einfache Wiedergabe) über analytisch (Ursachen und Zusammenhänge) bis kritisch (multiperspektivisch, transformativ).
                        </p>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-1.5">Transformatives Lernen</h4>
                        <p className="text-xs text-muted-foreground">
                          Ein tiefgreifender Lernprozess, bei dem durch kritische Reflexion grundlegende Annahmen und Überzeugungen verändert werden, was zu einer neuen Perspektive führt.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-1.5">Reflexives Schreiben</h4>
                        <p className="text-xs text-muted-foreground">
                          Eine strukturierte Form des Schreibens, die darauf abzielt, Erfahrungen systematisch zu analysieren, Erkenntnisse zu gewinnen und persönliche Entwicklung zu fördern.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-1.5">KI-Analyse</h4>
                        <p className="text-xs text-muted-foreground">
                          Die automatisierte Untersuchung von Reflexionstexten durch künstliche Intelligenz, um quantitative Metriken und qualitative Einsichten zur Reflexionsqualität zu gewinnen.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 rounded-lg border-l-4 border-l-primary p-4 bg-primary/5">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h5 className="text-sm font-medium">Tipp</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Überprüfen Sie beim Verfassen Ihrer Reflexionen, ob Sie Elemente der fortgeschrittenen Reflexionsebenen einbeziehen. Versuchen Sie, über die reine Beschreibung hinauszugehen und Ihre Erfahrungen kritisch zu hinterfragen.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Card>
        </Tabs>
      </div>
    </div>
  )
}