"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  User,
  Mail,
  Calendar,
  Award,
  Target,
  Brain,
  BookOpen,
  Home,
  ChevronRight,
  Sparkles,
  Trophy,
  Star
} from "lucide-react"

export default function Profile() {
  const pathname = usePathname()
  const version = pathname.startsWith("/adaptive") ? "adaptive" : "simple"
  const isAdaptive = version === "adaptive"

  // Beispieldaten (später durch echte Daten ersetzen)
  const user = {
    name: "Max Mustermann",
    email: "max.mustermann@example.com",
    joinedDate: "März 2024",
    level: 3,
    totalReflections: 12,
    achievements: [
      { title: "Erste Reflexion", description: "Erste Reflexion erstellt", icon: Star },
      { title: "Wochenziel", description: "7 Reflexionen in einer Woche", icon: Trophy },
      { title: "Tiefgründig", description: "5 ausführliche Reflexionen", icon: Brain },
    ],
    skills: [
      { name: "JavaScript", progress: 75 },
      { name: "Projektmanagement", progress: 60 },
      { name: "Teamarbeit", progress: 85 },
    ]
  }

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
              <span className="text-foreground">Profil</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profil-Header */}
        <div className="mb-8">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>MM</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Dabei seit {user.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Statistiken */}
          <Card>
            <CardHeader>
              <CardTitle>Reflexions-Statistiken</CardTitle>
              <CardDescription>Ihre Aktivitäten und Fortschritte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Level {user.level}</span>
                  <span className="text-sm text-muted-foreground">Level {user.level + 1}</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Noch 3 Reflexionen bis zum nächsten Level
                </p>
              </div>
              
              <div className="space-y-4">
                {user.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Erfolge */}
          <Card>
            <CardHeader>
              <CardTitle>Erfolge</CardTitle>
              <CardDescription>Ihre erreichten Meilensteine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.achievements.map((achievement, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card text-card-foreground"
                  >
                    <achievement.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* KI-Entwicklungspotenziale (nur in der adaptiven Version) */}
          {isAdaptive && (
            <Card className="md:col-span-2 border-primary/30 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle>KI-Entwicklungspotenziale</CardTitle>
                </div>
                <CardDescription>
                  Personalisierte Empfehlungen für Ihre Weiterentwicklung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Empfohlene Fokusgebiete
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge variant="secondary">Frontend-Entwicklung</Badge>
                        <span className="text-muted-foreground">Hohe Relevanz</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="secondary">Agile Methoden</Badge>
                        <span className="text-muted-foreground">Mittlere Relevanz</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Nächste Meilensteine
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge variant="secondary">10 Reflexionen</Badge>
                        <span className="text-muted-foreground">2 verbleibend</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="secondary">Level 4</Badge>
                        <span className="text-muted-foreground">75% erreicht</span>
                      </li>
                    </ul>
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