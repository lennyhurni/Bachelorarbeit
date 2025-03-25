"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Brain,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Lightbulb,
  BarChart,
  CheckCircle,
} from "lucide-react"

export default function Dashboard() {
  const pathname = usePathname()
  const version = pathname.startsWith("/adaptive") ? "adaptive" : "simple"
  const isAdaptive = version === "adaptive"

  // Beispieldaten (später durch echte Daten ersetzen)
  const stats = {
    totalReflections: 12,
    thisWeek: 3,
    averageLength: 250,
    completedGoals: 8,
    streak: 5,
  }

  const recentTopics = [
    "JavaScript Grundlagen",
    "Projektmanagement",
    "Teamkommunikation",
  ]

  const aiInsights = [
    {
      title: "Reflexionsmuster",
      description: "Sie reflektieren am häufigsten über technische Lernfortschritte. Erwägen Sie auch Soft Skills einzubeziehen.",
      icon: Brain,
    },
    {
      title: "Zeitanalyse",
      description: "Ihre ausführlichsten Reflexionen entstehen morgens. Planen Sie wichtige Reflexionen für diese Zeit ein.",
      icon: Clock,
    },
    {
      title: "Entwicklungspotenzial",
      description: "Basierend auf Ihren Zielen empfehlen wir mehr Reflexionen zu Projektmanagement-Methoden.",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            {isAdaptive ? (
              <Brain className="h-8 w-8 text-primary" />
            ) : (
              <BookOpen className="h-8 w-8 text-primary" />
            )}
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <Link href={`/${version}/reflections/new`}>
            <Button>
              Neue Reflexion
            </Button>
          </Link>
        </div>

        {/* Statistik-Karten */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Reflexionen diese Woche
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisWeek}</div>
              <Progress
                value={(stats.thisWeek / 7) * 100}
                className="h-2 mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Ziel: 7 pro Woche
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Erfüllte Ziele
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedGoals}</div>
              <Progress
                value={(stats.completedGoals / 10) * 100}
                className="h-2 mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {10 - stats.completedGoals} Ziele noch offen
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Reflexions-Serie
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.streak} Tage</div>
              <div className="flex gap-1 mt-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      i < stats.streak ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Noch 2 Tage bis zum neuen Rekord
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hauptbereich */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Letzte Themen */}
          <Card>
            <CardHeader>
              <CardTitle>Reflexionsthemen</CardTitle>
              <CardDescription>
                Ihre häufigsten Reflexionsbereiche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTopics.map((topic, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-primary" />
                      <span>{topic}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {4 - i} Reflexionen
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* KI-Insights (nur in der adaptiven Version) */}
          {isAdaptive && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle>KI-Erkenntnisse</CardTitle>
                </div>
                <CardDescription>
                  Personalisierte Einblicke in Ihr Reflexionsverhalten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight, i) => (
                    <div key={i} className="flex gap-3">
                      <insight.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
} 