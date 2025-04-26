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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Willkommen in deinem Dashboard</p>
      
      {/* Dashboard content goes here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Meine Projekte</h2>
          <p>Du hast noch keine Projekte.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Aktivitäten</h2>
          <p>Keine kürzlichen Aktivitäten.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Statistiken</h2>
          <p>Keine Daten verfügbar.</p>
        </div>
      </div>
    </div>
  )
} 