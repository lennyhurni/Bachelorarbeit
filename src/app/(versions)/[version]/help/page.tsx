"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Brain,
  PenTool,
  Calendar,
  Settings,
  LineChart,
  Clock,
  Lightbulb,
  BookOpen,
  Target,
  Sparkles,
  MessageSquareMore,
  HelpCircle,
  Compass,
  Rocket,
  Zap
} from "lucide-react"

export default function HelpPage() {
  const pathname = usePathname()
  const version = pathname.startsWith("/adaptive") ? "adaptive" : "simple"
  const isAdaptive = version === "adaptive"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-4">
            <Link href={`/${version}/dashboard`}>
              <Button variant="ghost" size="icon">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-foreground">{isAdaptive ? "KI-Hilfe" : "Hilfe"}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Help Header */}
        <div className="flex items-center gap-2 mb-8">
          {isAdaptive ? (
            <Brain className="h-8 w-8 text-primary" />
          ) : (
            <HelpCircle className="h-8 w-8 text-primary" />
          )}
          <h1 className="text-3xl font-bold">{isAdaptive ? "KI-Hilfe" : "Hilfe"}</h1>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Willkommen bei Reflectify
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Entdecken Sie, wie Sie mit Reflectify Ihr Lernen verbessern können
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="start" className="space-y-4">
            <TabsList className={`grid w-full ${isAdaptive ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} grid-cols-2`}>
              <TabsTrigger value="start" className="gap-2">
                <Compass className="h-4 w-4" />
                <span>Erste Schritte</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="gap-2">
                <Rocket className="h-4 w-4" />
                <span>Funktionen</span>
              </TabsTrigger>
              <TabsTrigger value="process" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                <span>Reflexionsprozess</span>
              </TabsTrigger>
              {isAdaptive && (
                <TabsTrigger value="ai" className="gap-2">
                  <Brain className="h-4 w-4" />
                  <span>KI-Unterstützung</span>
                </TabsTrigger>
              )}
            </TabsList>

            <div className="flex flex-col gap-4">
              <ScrollArea className="h-[600px] rounded-md border">
                <div className="p-4">
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
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
                            <div className="rounded-full bg-primary/10 p-3">
                              <PenTool className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium">1. Erste Reflexion</h3>
                            <p className="text-sm text-muted-foreground">
                              Erstellen Sie Ihre erste Reflexion über eine aktuelle Lernerfahrung.
                              Folgen Sie dabei der strukturierten Anleitung.
                            </p>
                          </div>
                          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
                            <div className="rounded-full bg-primary/10 p-3">
                              <Settings className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium">2. Personalisierung</h3>
                            <p className="text-sm text-muted-foreground">
                              Passen Sie die App an Ihre Bedürfnisse an. Wählen Sie Ihr bevorzugtes
                              Design und stellen Sie Benachrichtigungen ein.
                            </p>
                          </div>
                          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
                            <div className="rounded-full bg-primary/10 p-3">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium">3. Routine entwickeln</h3>
                            <p className="text-sm text-muted-foreground">
                              Legen Sie fest, wann Sie regelmäßig reflektieren möchten.
                              Die App erinnert Sie an Ihre Reflexionszeiten.
                            </p>
                          </div>
                          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
                            <div className="rounded-full bg-primary/10 p-3">
                              <LineChart className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium">4. Fortschritt verfolgen</h3>
                            <p className="text-sm text-muted-foreground">
                              Beobachten Sie Ihre Entwicklung im Dashboard und entdecken
                              Sie Muster in Ihrem Lernverhalten.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Rocket className="h-6 w-6 text-primary" />
                          <CardTitle>Hauptfunktionen</CardTitle>
                        </div>
                        <CardDescription>
                          Entdecken Sie alle Möglichkeiten von Reflectify
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-4 rounded-lg border p-6">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-primary/10 p-2">
                                <PenTool className="h-5 w-5 text-primary" />
                              </div>
                              <h3 className="font-medium">Reflexionen erstellen</h3>
                            </div>
                            <ul className="ml-4 space-y-2 text-sm text-muted-foreground">
                              <li>• Strukturierte Eingabefelder</li>
                              <li>• Vorlagen für verschiedene Reflexionstypen</li>
                              <li>• Automatische Speicherung</li>
                              <li>• Tags und Kategorisierung</li>
                            </ul>
                          </div>

                          <div className="space-y-4 rounded-lg border p-6">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-primary/10 p-2">
                                <LineChart className="h-5 w-5 text-primary" />
                              </div>
                              <h3 className="font-medium">Fortschrittsanalyse</h3>
                            </div>
                            <ul className="ml-4 space-y-2 text-sm text-muted-foreground">
                              <li>• Detaillierte Statistiken</li>
                              <li>• Entwicklungstrends</li>
                              <li>• Lernmuster erkennen</li>
                              <li>• Exportfunktionen</li>
                            </ul>
                          </div>

                          <div className="space-y-4 rounded-lg border p-6">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-primary/10 p-2">
                                <Clock className="h-5 w-5 text-primary" />
                              </div>
                              <h3 className="font-medium">Zeitmanagement</h3>
                            </div>
                            <ul className="ml-4 space-y-2 text-sm text-muted-foreground">
                              <li>• Erinnerungsfunktion</li>
                              <li>• Flexible Zeitplanung</li>
                              <li>• Regelmäßige Intervalle</li>
                              <li>• Kalenderintegration</li>
                            </ul>
                          </div>

                          <div className="space-y-4 rounded-lg border p-6">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-primary/10 p-2">
                                <Settings className="h-5 w-5 text-primary" />
                              </div>
                              <h3 className="font-medium">Personalisierung</h3>
                            </div>
                            <ul className="ml-4 space-y-2 text-sm text-muted-foreground">
                              <li>• Individuelles Design</li>
                              <li>• Benachrichtigungseinstellungen</li>
                              <li>• Sprachauswahl</li>
                              <li>• Datenschutzoptionen</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="process" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-6 w-6 text-primary" />
                          <CardTitle>Der Reflexionsprozess</CardTitle>
                        </div>
                        <CardDescription>
                          Verstehen Sie den strukturierten Reflexionsansatz
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
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
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {isAdaptive && (
                    <TabsContent value="ai" className="space-y-6">
                      <Card className="border-primary/30 bg-primary/5">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Brain className="h-6 w-6 text-primary" />
                            <CardTitle>KI-Unterstützung</CardTitle>
                          </div>
                          <CardDescription>
                            Entdecken Sie die intelligenten Funktionen
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-4 rounded-lg bg-background p-6">
                              <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                  <Sparkles className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-medium">Intelligente Vorschläge</h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Die KI analysiert Ihre bisherigen Reflexionen und schlägt 
                                passende Themen und Fragen vor, die zu Ihrem Lernstil passen.
                              </p>
                              <div className="rounded-md bg-primary/10 p-3">
                                <p className="text-xs text-primary">
                                  Tipp: Je mehr Sie reflektieren, desto besser werden die Vorschläge!
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-4 rounded-lg bg-background p-6">
                              <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                  <MessageSquareMore className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-medium">Gezielte Nachfragen</h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Durch intelligente Nachfragen hilft die KI, Ihre Reflexionen 
                                zu vertiefen und neue Perspektiven zu entdecken.
                              </p>
                              <div className="rounded-md bg-primary/10 p-3">
                                <p className="text-xs text-primary">
                                  Tipp: Lassen Sie sich von den Fragen inspirieren!
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-4 rounded-lg bg-background p-6">
                              <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                  <LineChart className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-medium">Musteranalyse</h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Die KI erkennt Muster in Ihren Reflexionen und gibt 
                                personalisierte Empfehlungen für Ihre Entwicklung.
                              </p>
                              <div className="rounded-md bg-primary/10 p-3">
                                <p className="text-xs text-primary">
                                  Tipp: Überprüfen Sie regelmäßig Ihre Fortschrittsanalyse!
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-4 rounded-lg bg-background p-6">
                              <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                  <Zap className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-medium">Adaptive Unterstützung</h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Die KI passt sich Ihrem Lernstil an und bietet genau die 
                                Unterstützung, die Sie benötigen.
                              </p>
                              <div className="rounded-md bg-primary/10 p-3">
                                <p className="text-xs text-primary">
                                  Tipp: Passen Sie den KI-Unterstützungsgrad in den Einstellungen an!
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}
                </div>
              </ScrollArea>

              {/* Support & Kontakt */}
              <Card className="mt-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Weitere Hilfe benötigt?</CardTitle>
                      <CardDescription>
                        Wir sind für Sie da
                      </CardDescription>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Support kontaktieren
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-8">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-2">
                        <span className="text-xl">✉️</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">E-Mail</p>
                        <p className="text-sm text-muted-foreground">hoffentlich@gute-bachelorarbeit.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-2">
                        <span className="text-xl">📱</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Telefon</p>
                        <p className="text-sm text-muted-foreground">+41 79 234 03 71</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  )
}