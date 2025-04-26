"use client"

import { useEffect, useState } from "react"
import { createClientBrowser } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { 
  LineChart, 
  PieChart, 
  Target, 
  BarChart, 
  Lightbulb,
  Plus
} from "lucide-react"

// Typdefinitionen
interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

interface Reflection {
  id: string
  title: string
  created_at: string
  category: string
  is_public: boolean
  kpi_depth?: number
  kpi_coherence?: number
  kpi_metacognition?: number
  kpi_actionable?: number
}

interface LearningGoal {
  id: string
  title: string
  created_at: string
  target_date: string
  progress: number
  is_completed: boolean
  category: string
}

export default function DashboardClient() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientBrowser()
  const router = useRouter()

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        
        // Session abrufen und ggf. aktualisieren
        const { data } = await supabase.auth.getSession()
        const currentSession = data.session
        
        // If we have a session, we can proceed with loading data
        // Middleware will handle redirects if not authenticated
        if (currentSession) {
          // Benutzerprofil abrufen
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single()
          
          if (userError) {
            console.error('Fehler beim Abrufen des Benutzerprofils:', userError)
          }
          
          // Benutzerdaten setzen
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            full_name: userData?.full_name || currentSession.user.user_metadata?.full_name || '',
            avatar_url: userData?.avatar_url || currentSession.user.user_metadata?.avatar_url || ''
          })

          // Reflexionen abrufen (neueste 5)
          const { data: reflectionsData, error: reflectionsError } = await supabase
            .from('reflections')
            .select('*')
            .eq('user_id', currentSession.user.id)
            .order('created_at', { ascending: false })
            .limit(5)

          if (reflectionsError) {
            console.error('Fehler beim Abrufen der Reflexionen:', reflectionsError)
          } else {
            setReflections(reflectionsData || [])
          }

          // Lernziele abrufen (aktive)
          const { data: goalsData, error: goalsError } = await supabase
            .from('learning_goals')
            .select('*')
            .eq('user_id', currentSession.user.id)
            .eq('is_completed', false)
            .order('target_date', { ascending: true })
            .limit(5)

          if (goalsError) {
            console.error('Fehler beim Abrufen der Lernziele:', goalsError)
          } else {
            setLearningGoals(goalsData || [])
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [supabase, router])

  // Funktion zur Berechnung der durchschnittlichen KPI-Werte
  const calculateAverageKPIs = () => {
    if (!reflections || reflections.length === 0) return { depth: 0, coherence: 0, metacognition: 0, actionable: 0 }
    
    const sum = reflections.reduce((acc, reflection) => {
      return {
        depth: acc.depth + (reflection.kpi_depth || 0),
        coherence: acc.coherence + (reflection.kpi_coherence || 0),
        metacognition: acc.metacognition + (reflection.kpi_metacognition || 0),
        actionable: acc.actionable + (reflection.kpi_actionable || 0)
      }
    }, { depth: 0, coherence: 0, metacognition: 0, actionable: 0 })
    
    return {
      depth: Math.round(sum.depth / reflections.length),
      coherence: Math.round(sum.coherence / reflections.length),
      metacognition: Math.round(sum.metacognition / reflections.length),
      actionable: Math.round(sum.actionable / reflections.length)
    }
  }

  // Berechne die Fortschrittsstatistiken für Lernziele
  const calculateGoalStats = () => {
    if (!learningGoals || learningGoals.length === 0) {
      return { total: 0, completed: 0, inProgress: 0, avgProgress: 0 }
    }
    
    const total = learningGoals.length
    const completed = learningGoals.filter(goal => goal.is_completed).length
    const inProgress = total - completed
    const avgProgress = Math.round(
      learningGoals.reduce((sum, goal) => sum + goal.progress, 0) / total
    )
    
    return { total, completed, inProgress, avgProgress }
  }

  if (loading) {
    return <div className="p-8 text-center">Lade Benutzerdaten...</div>
  }

  const avgKPIs = calculateAverageKPIs()
  const goalStats = calculateGoalStats()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Begrüßungskarte */}
        <Card>
          <CardHeader>
            <CardTitle>Willkommen zurück</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-medium">{user?.full_name || user?.email}</p>
              <p className="text-sm text-gray-500">
                {user?.email}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* KPI-Übersicht */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-md font-medium">Reflexions-Qualität</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {reflections.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tiefe</span>
                    <span className="font-medium">{avgKPIs.depth}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className="h-1.5 rounded-full bg-primary"
                      style={{ width: `${avgKPIs.depth}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Kohärenz</span>
                    <span className="font-medium">{avgKPIs.coherence}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{ width: `${avgKPIs.coherence}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Metakognition</span>
                    <span className="font-medium">{avgKPIs.metacognition}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className="h-1.5 rounded-full bg-green-500"
                      style={{ width: `${avgKPIs.metacognition}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Handlungsorientierung</span>
                    <span className="font-medium">{avgKPIs.actionable}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className="h-1.5 rounded-full bg-amber-500"
                      style={{ width: `${avgKPIs.actionable}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <p>Noch keine Reflexionen vorhanden.</p>
                <p>Erstelle deine erste Reflexion, um Statistiken zu sehen.</p>
              </div>
            )}
            <Button 
              className="mt-4 w-full"
              onClick={() => router.push('/reflections/new')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Neue Reflexion
            </Button>
          </CardContent>
        </Card>
        
        {/* Lernziel-Übersicht */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-md font-medium">Lernziele</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {learningGoals.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <p className="font-medium">{goalStats.inProgress} aktive Ziele</p>
                    <p className="text-muted-foreground">Ø {goalStats.avgProgress}% Fortschritt</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-medium">
                      {goalStats.completed}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                      {goalStats.inProgress}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  {learningGoals.slice(0, 3).map(goal => (
                    <div key={goal.id} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium truncate" style={{maxWidth: "70%"}}>{goal.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(goal.target_date).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-secondary">
                        <div
                          className="h-1.5 rounded-full bg-blue-500"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <p>Noch keine Lernziele definiert.</p>
                <p>Setze dir Ziele, um deinen Lernfortschritt zu verfolgen.</p>
              </div>
            )}
            <Button 
              className="mt-4 w-full"
              onClick={() => router.push('/goals/new')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Neues Lernziel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 