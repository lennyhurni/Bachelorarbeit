"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Calendar,
  Clock,
  Target,
  CheckCircle,
  Brain,
  Lightbulb,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  Home,
  ChevronRight
} from "lucide-react"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"

export default function ReflectionDetail() {
  const params = useParams()
  const pathname = usePathname()
  
  // Extract version from pathname
  let version = "simple"
  if (pathname.startsWith("/simple")) {
    version = "simple"
  } else if (pathname.startsWith("/adaptive")) {
    version = "adaptive"
  }
  
  const id = params.id as string
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
              <Link href={`/${version}/reflections`} className="hover:text-foreground">
                {isAdaptive ? "KI-Reflexionen" : "Reflexionen"}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Reflexion {id}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/${version}/reflections`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {isAdaptive ? (
                <Brain className="h-8 w-8 text-primary" />
              ) : (
                <BookOpen className="h-8 w-8 text-primary" />
              )}
              <h1 className="text-3xl font-bold">
                {isAdaptive ? "KI-Reflexion" : "Reflexion"}
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle>Lernfortschritt in JavaScript</CardTitle>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>23.03.2023</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>15min</span>
                  </div>
                </div>
              </div>
              <CardDescription>
                Reflexion über den heutigen Lernfortschritt in JavaScript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p>
                    Heute habe ich die Grundlagen von JavaScript gelernt. Besonders interessant fand ich die Konzepte von Variablen und Funktionen. Ich habe festgestellt, dass ich manchmal noch Schwierigkeiten habe, die richtige Syntax zu verwenden, aber mit der Zeit wird es besser.
                  </p>
                  <p>
                    Es war besonders hilfreich, praktische Übungen zu machen und kleinere Projekte umzusetzen. Dadurch konnte ich das Gelernte direkt anwenden und festigen.
                  </p>
                  <p>
                    Für die nächste Lerneinheit möchte ich mir folgende Ziele setzen:
                  </p>
                  <ul>
                    <li>Vertiefung der Kenntnisse zu Objekten</li>
                    <li>Arbeit mit DOM-Manipulationen</li>
                    <li>Grundlagen von Event Handling</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Ziel: Wöchentliche JavaScript-Übungen</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isAdaptive && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>KI-Erkenntnisse</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-sm">Sie haben gute Fortschritte im Verständnis der Grundkonzepte gemacht. Vielleicht möchten Sie als nächstes ein kleines Projekt planen, um das Gelernte anzuwenden?</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-sm">Ihre regelmäßigen Übungen sind ein ausgezeichneter Ansatz. Erwägen Sie, Ihre Lernfortschritte zu dokumentieren, um Ihre Entwicklung im Laufe der Zeit zu verfolgen.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
} 