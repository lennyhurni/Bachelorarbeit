"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BookOpen, 
  Calendar,
  Clock,
  Target,
  CheckCircle,
  Plus,
  Search,
  Home,
  ChevronRight,
  Brain
} from "lucide-react"

export default function Reflections() {
  const pathname = usePathname()
  
  // Extract version from pathname
  let version = "simple"
  if (pathname.startsWith("/simple")) {
    version = "simple"
  } else if (pathname.startsWith("/adaptive")) {
    version = "adaptive"
  }
  
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
              <span className="text-foreground">{isAdaptive ? "KI-Reflexionen" : "Reflexionen"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            {isAdaptive ? (
              <Brain className="h-8 w-8 text-primary" />
            ) : (
              <BookOpen className="h-8 w-8 text-primary" />
            )}
            <h1 className="text-3xl font-bold">
              {isAdaptive ? "KI-Reflexionen" : "Reflexionen"}
            </h1>
          </div>
          <Link href={`/${version}/reflections/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {isAdaptive ? "Neue KI-Reflexion" : "Neue Reflexion"}
            </Button>
          </Link>
        </div>

        {/* Suchleiste */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              key="search-input"
              type="search"
              placeholder="Reflexionen durchsuchen..."
              className="pl-9"
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Reflexionsliste */}
        <div className="grid gap-4">
          {/* Aktuelle Reflexion */}
          <Link href={`/${version}/reflections/1`}>
            <Card className="border-primary hover:bg-muted/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <CardTitle>Lernfortschritt in JavaScript</CardTitle>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Heute</span>
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
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    <span>Ziel: Wöchentliche JavaScript-Übungen</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Ältere Reflexion */}
          <Link href={`/${version}/reflections/2`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <CardTitle>Projektplanung</CardTitle>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Gestern</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>20min</span>
                    </div>
                  </div>
                </div>
                <CardDescription>
                  Reflexion über die Projektplanung und nächste Schritte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p>
                      Die Projektplanung wurde erfolgreich abgeschlossen. Ich habe gelernt, wie wichtig es ist, die Aufgaben gut zu strukturieren und Prioritäten zu setzen. Als nächstes werde ich mich auf die Implementierung der Kernfunktionen konzentrieren.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    <span>Ziel: Wöchentliche Projektmeetings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
} 