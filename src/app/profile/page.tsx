"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
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
  Star,
  LineChart,
  PieChart,
  Lightbulb,
  Clock,
  CheckSquare,
  Filter,
  ArrowRight,
  FileText,
  BarChart,
  TrendingUp,
  HelpCircle,
  PlusCircle
} from "lucide-react"

// A component to visualize progress over time
const ProgressChart = ({ data }: { data: {date: string, value: number}[] }) => {
  // Simple representation of a line chart
  const maxValue = Math.max(...data.map(item => item.value))
  const minValue = Math.min(...data.map(item => item.value))
  
  return (
    <div className="relative h-24 w-full">
      <div className="absolute inset-x-0 bottom-0 border-b border-border/40"></div>
      <div className="absolute inset-y-0 left-0 border-l border-border/40"></div>
      <div className="absolute right-0 top-0 text-xs text-muted-foreground">{maxValue}%</div>
      <div className="absolute right-0 bottom-0 text-xs text-muted-foreground">{minValue}%</div>
      
      <div className="absolute inset-0 flex items-end justify-between px-1">
        {data.map((item, index) => {
          const height = ((item.value - minValue) / (maxValue - minValue || 1)) * 100;
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="group relative flex flex-col items-center"
                  >
                    <div 
                      className="w-1.5 bg-primary rounded-t transition-all hover:w-2"
                      style={{ 
                        height: `${Math.max(5, height)}%`,
                        backgroundColor: item.value > 70 ? '#10b981' : item.value > 50 ? '#3b82f6' : '#f59e0b'
                      }}
                    ></div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-xs">
                    <div className="font-medium">{item.date}</div>
                    <div>Score: {item.value}%</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}

// Component to show the distribution of Moon's reflection levels
const ReflectionLevelsDonut = ({ data }: { data: {label: string, value: number, color: string}[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let startAngle = 0
  
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
        
        {data.map((segment, index) => {
          const percentage = segment.value / total
          const degrees = percentage * 360
          const endAngle = startAngle + degrees
          
          // Convert angles to radians for calculations
          const startRad = (startAngle - 90) * Math.PI / 180
          const endRad = (endAngle - 90) * Math.PI / 180
          
          // Calculate the SVG arc path
          const x1 = 50 + 40 * Math.cos(startRad)
          const y1 = 50 + 40 * Math.sin(startRad)
          const x2 = 50 + 40 * Math.cos(endRad)
          const y2 = 50 + 40 * Math.sin(endRad)
          
          // Define the arc path
          const largeArcFlag = degrees > 180 ? 1 : 0
          const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
          
          // Update startAngle for the next segment
          const result = (
            <path 
              key={index} 
              d={pathData} 
              fill={segment.color}
            />
          )
          
          startAngle = endAngle
          return result
        })}
        
        {/* Inner circle for donut effect */}
        <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-background" />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center text-xs text-center">
        <div>
          <div className="font-bold text-lg">{total}</div>
          <div className="text-muted-foreground">Gesamt</div>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  // Example data for charts
  const progressData = [
    { date: '01.03', value: 45 },
    { date: '07.03', value: 52 },
    { date: '14.03', value: 58 },
    { date: '21.03', value: 65 },
    { date: '28.03', value: 72 },
    { date: '04.04', value: 68 },
    { date: '11.04', value: 75 },
    { date: '18.04', value: 82 },
  ]
  
  const reflectionLevels = [
    { label: 'Descriptive', value: 7, color: '#3b82f6' },
    { label: 'Analytical', value: 5, color: '#f59e0b' },
    { label: 'Critical', value: 3, color: '#10b981' },
  ]
  
  // Beispieldaten (später durch echte Daten ersetzen)
  const user = {
    name: "Max Mustermann",
    email: "max.mustermann@example.com",
    joinedDate: "März 2024",
    level: 3,
    totalReflections: 15,
    achievements: [
      { title: "Erste Reflexion", description: "Erste Reflexion erstellt", icon: Star, date: "02.03.2024" },
      { title: "Wochenziel", description: "7 Reflexionen in einer Woche", icon: Trophy, date: "15.03.2024" },
      { title: "Tiefgründig", description: "5 ausführliche Reflexionen", icon: Brain, date: "05.04.2024" },
      { title: "Metakognitiv", description: "Hohe Metakognition-Scores erreicht", icon: Lightbulb, date: "12.04.2024" },
    ],
    skills: [
      { name: "Reflexionstiefe", progress: 75, improvement: "+12%" },
      { name: "Kohärenz", progress: 82, improvement: "+8%" },
      { name: "Metakognition", progress: 65, improvement: "+15%" },
      { name: "Handlungsorientierung", progress: 70, improvement: "+5%" },
    ],
    learningGoals: [
      { name: "Kritisches Denken verbessern", progress: 65, targetDate: "30.05.2024" },
      { name: "Lösungsorientierte Reflexion", progress: 40, targetDate: "15.06.2024" },
    ]
  }

  return (
    <div className="pt-6 space-y-6">
      <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mein Profil</h1>
          <p className="text-muted-foreground mt-1">Verfolgen Sie Ihren Reflexionsfortschritt</p>
        </div>
        <Button asChild>
          <Link href="/reflections/new" className="gap-2">
            <FileText className="h-4 w-4" />
            Neue Reflexion
          </Link>
        </Button>
      </div>

      {/* User Info */}
      <div className="px-6 grid gap-6 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Übersicht</CardTitle>
              <Badge variant="outline" className="text-xs px-2 py-1 rounded-sm">Level {user.level}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fortschritt zum Level {user.level + 1}</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Noch 3 Reflexionen bis zum nächsten Level
                  </p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border bg-card p-3">
                    <div className="text-muted-foreground text-xs mb-1">Reflexionen</div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-2xl font-bold">{user.totalReflections}</span>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border bg-card p-3">
                    <div className="text-muted-foreground text-xs mb-1">Seit</div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{user.joinedDate}</span>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border bg-card p-3 col-span-2">
                    <div className="text-muted-foreground text-xs mb-1">Gesamtfortschritt</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">+27% im letzten Monat</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium">KI-Empfehlungen</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-3 text-sm">
              <div className="border-l-2 border-amber-400 pl-3 py-1">
                <p className="font-medium">Verbessern Sie Ihre Handlungsorientierung</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Definieren Sie in Ihren Reflexionen konkretere Handlungsschritte
                </p>
              </div>
              <div className="border-l-2 border-green-400 pl-3 py-1">
                <p className="font-medium">Stärke: Kohärenz</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ihre strukturierten Reflexionen zeigen gute Gedankenverbindungen
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full text-xs gap-1">
              <Lightbulb className="h-3 w-3" />
              Alle Empfehlungen
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs for different analyses */}
      <Tabs defaultValue="progress" className="mt-4 px-6">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="progress">
            <LineChart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Fortschritt</span>
          </TabsTrigger>
          <TabsTrigger value="skills">
            <BarChart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Fähigkeiten</span>
          </TabsTrigger>
          <TabsTrigger value="levels">
            <PieChart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Reflexionsebenen</span>
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Erfolge</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Progress Tab */}
        <TabsContent value="progress">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Entwicklung über Zeit</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Diese Grafik zeigt Ihren durchschnittlichen KPI-Score über die Zeit, basierend auf allen Reflexionen
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription>Verlauf Ihrer Reflexionsqualität</CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressChart data={progressData} />
              </CardContent>
              <CardFooter className="flex justify-between text-sm border-t pt-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Letzten 8 Wochen</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+37%</span>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lernziele</CardTitle>
                <CardDescription>Ihre persönlichen Entwicklungsziele</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-5">
                  {user.learningGoals.map((goal, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{goal.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Bis {goal.targetDate}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Fortschritt</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-3 justify-center border-t">
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <PlusCircle className="h-3 w-3" />
                  Neues Lernziel setzen
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reflexionsfähigkeiten</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Diese Fähigkeiten werden automatisch aus Ihren Reflexionstexten abgeleitet
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>KPI-basierte Analyse Ihrer Reflexionsstärken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {user.skills.map((skill, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900"
                      >
                        {skill.improvement}
                      </Badge>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Anfänger</span>
                      <span>Fortgeschritten</span>
                      <span>Experte</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reflection Levels Tab */}
        <TabsContent value="levels">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reflexionsebenen nach Moon</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Das Moon-Modell unterscheidet zwischen beschreibenden, analytischen und kritischen Reflexionsebenen
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>Verteilung Ihrer Reflexionen nach Tiefe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 items-center">
                <div>
                  <ReflectionLevelsDonut data={reflectionLevels} />
                </div>
                <div className="space-y-5">
                  {reflectionLevels.map((level, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: level.color }}
                        ></div>
                        <div className="text-sm font-medium">{level.label}</div>
                        <Badge variant="secondary" className="ml-auto">
                          {level.value}
                        </Badge>
                      </div>
                      <div className="pl-5 text-xs text-muted-foreground">
                        {level.label === "Descriptive" && "Beschreibende Darstellung von Ereignissen und Beobachtungen"}
                        {level.label === "Analytical" && "Analyse von Ursachen, Zusammenhängen und Bedeutungen"}
                        {level.label === "Critical" && "Tiefgreifende Betrachtung aus verschiedenen Perspektiven"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2 flex items-center gap-1">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Empfehlung:</span>
                </p>
                <p className="text-xs">
                  Versuchen Sie in Ihren nächsten Reflexionen, mehr kritische Reflexionselemente einzubauen, 
                  indem Sie verschiedene Perspektiven betrachten und tiefere Zusammenhänge erforschen.
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Erfolge & Meilensteine</CardTitle>
              <CardDescription>Ihre erreichten Fortschritte und Auszeichnungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {user.achievements.map((achievement, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="bg-primary/10 p-2 rounded-full">
                      <achievement.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <span className="text-xs text-muted-foreground">{achievement.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4 text-primary" />
                <span>{user.achievements.length} von 12 Erfolgen freigeschaltet</span>
              </div>
              <Button variant="outline" size="sm" className="text-xs">Alle anzeigen</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 