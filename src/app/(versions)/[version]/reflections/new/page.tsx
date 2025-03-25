"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  BookOpen, 
  Target,
  Clock,
  Calendar,
  Brain,
  Lightbulb,
  Sparkles,
  MessageSquare,
  Home,
  ChevronRight,
  ArrowLeft
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function NewReflection() {
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
              <Link href={`/${version}/reflections`} className="hover:text-foreground">
                {isAdaptive ? "KI-Reflexionen" : "Reflexionen"}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Neue {isAdaptive ? "KI-" : ""}Reflexion</span>
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
                Neue {isAdaptive ? "KI-" : ""}Reflexion
              </h1>
            </div>
          </div>
          <Button>
            Speichern
          </Button>
        </div>

        <div className="grid gap-6 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Geben Sie die grundlegenden Informationen für Ihre Reflexion ein.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Titel</label>
                <Input id="title" placeholder="Geben Sie einen Titel ein..." />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Beschreibung</label>
                <Textarea id="description" placeholder="Kurze Zusammenfassung Ihrer Reflexion..." className="min-h-24" />
              </div>
              <div className="space-y-2">
                <label htmlFor="goal" className="text-sm font-medium">Lernziel</label>
                <Input id="goal" placeholder="Was möchten Sie erreichen?" />
              </div>
            </CardContent>
          </Card>

          {isAdaptive && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>KI-Unterstützung</CardTitle>
                </div>
                <CardDescription>Nutzen Sie die KI, um Ihre Reflexion zu verbessern.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <label htmlFor="suggestions" className="text-sm font-medium">Vorschläge anfordern</label>
                  </div>
                  <Input id="suggestions" placeholder="Womit kann die KI Ihnen helfen?" />
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Vorschläge erhalten
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
} 