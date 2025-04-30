import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// Define an interface for reflection data
interface Reflection {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  category?: string
  kpi_depth: number
  kpi_coherence: number
  kpi_metacognition: number
  kpi_actionable: number
  analyzed_at?: string
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Nicht authentifiziert" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Get query parameters for filtering
    const url = new URL(request.url)
    const timeRange = url.searchParams.get('timeRange') || 'all'
    
    // Define time constraints based on the timeRange
    let timeConstraint = {}
    const now = new Date()
    
    if (timeRange === 'week') {
      const lastWeek = new Date(now)
      lastWeek.setDate(now.getDate() - 7)
      timeConstraint = { gte: lastWeek.toISOString() }
    } else if (timeRange === 'month') {
      const lastMonth = new Date(now)
      lastMonth.setMonth(now.getMonth() - 1)
      timeConstraint = { gte: lastMonth.toISOString() }
    } else if (timeRange === 'year') {
      const lastYear = new Date(now)
      lastYear.setFullYear(now.getFullYear() - 1)
      timeConstraint = { gte: lastYear.toISOString() }
    }
    
    // Fetch reflections with NLP metrics
    const { data: reflections, error: reflectionsError } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      
    if (reflectionsError) {
      console.error('Error fetching reflections:', reflectionsError)
      return new NextResponse(JSON.stringify({ error: "Fehler beim Abrufen der Reflexionen" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Filter reflections by time range (if needed)
    let filteredReflections = reflections
    if (Object.keys(timeConstraint).length > 0) {
      filteredReflections = reflections.filter((r: Reflection) => 
        new Date(r.created_at) >= new Date((timeConstraint as any).gte)
      )
    }
    
    // Calculate aggregate statistics
    const stats = calculateReflectionStats(filteredReflections)
    
    // Return the analytics data
    return new NextResponse(JSON.stringify({
      success: true,
      stats,
      timeRange
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return new NextResponse(JSON.stringify({ error: "Interner Serverfehler" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// Helper function to calculate reflection statistics
function calculateReflectionStats(reflections: Reflection[]) {
  // If no reflections, return empty statistics
  if (!reflections || reflections.length === 0) {
    return {
      totalReflections: 0,
      avgKpis: { depth: 0, coherence: 0, metacognition: 0, actionable: 0, overall: 0 },
      levelDistribution: { descriptive: 0, analytical: 0, critical: 0 },
      categoryDistribution: [],
      kpiTrends: [],
      reflectionCounts: []
    }
  }
  
  // Total count
  const totalReflections = reflections.length
  
  // Calculate average KPIs
  let totalDepth = 0, totalCoherence = 0, totalMetacognition = 0, totalActionable = 0
  
  reflections.forEach(reflection => {
    totalDepth += reflection.kpi_depth || 0
    totalCoherence += reflection.kpi_coherence || 0
    totalMetacognition += reflection.kpi_metacognition || 0
    totalActionable += reflection.kpi_actionable || 0
  })
  
  const avgDepth = Number((totalDepth / totalReflections).toFixed(1))
  const avgCoherence = Number((totalCoherence / totalReflections).toFixed(1))
  const avgMetacognition = Number((totalMetacognition / totalReflections).toFixed(1))
  const avgActionable = Number((totalActionable / totalReflections).toFixed(1))
  const avgOverall = Number(((avgDepth + avgCoherence + avgMetacognition + avgActionable) / 4).toFixed(1))
  
  // Calculate reflection level distribution
  let descriptive = 0, analytical = 0, critical = 0
  
  reflections.forEach(reflection => {
    const avgScore = (
      (reflection.kpi_depth || 0) + 
      (reflection.kpi_coherence || 0) + 
      (reflection.kpi_metacognition || 0) + 
      (reflection.kpi_actionable || 0)
    ) / 4
    
    if (avgScore >= 8) {
      critical++
    } else if (avgScore >= 6) {
      analytical++
    } else {
      descriptive++
    }
  })
  
  // Calculate category distribution
  const categoryCounter: Record<string, number> = {}
  
  reflections.forEach(reflection => {
    if (reflection.category) {
      categoryCounter[reflection.category] = (categoryCounter[reflection.category] || 0) + 1
    } else {
      categoryCounter["Keine Kategorie"] = (categoryCounter["Keine Kategorie"] || 0) + 1
    }
  })
  
  const categoryDistribution = Object.entries(categoryCounter)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
  
  // Sort reflections by date (oldest first) for trend analysis
  const sortedReflections = [...reflections].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  
  // Calculate KPI trends over time (by week)
  const weekGroups: Record<string, any[]> = {}
  
  sortedReflections.forEach(reflection => {
    const date = new Date(reflection.created_at)
    // Get start of week (Sunday)
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const weekKey = startOfWeek.toISOString().split('T')[0]
    
    if (!weekGroups[weekKey]) {
      weekGroups[weekKey] = []
    }
    
    weekGroups[weekKey].push(reflection)
  })
  
  const kpiTrends = Object.entries(weekGroups).map(([weekStart, weekReflections]) => {
    let totalDepth = 0, totalCoherence = 0, totalMetacognition = 0, totalActionable = 0
    
    weekReflections.forEach(r => {
      totalDepth += r.kpi_depth || 0
      totalCoherence += r.kpi_coherence || 0
      totalMetacognition += r.kpi_metacognition || 0
      totalActionable += r.kpi_actionable || 0
    })
    
    const count = weekReflections.length
    const date = formatDate(weekStart)
    const depth = count > 0 ? Number((totalDepth / count).toFixed(1)) : 0
    const coherence = count > 0 ? Number((totalCoherence / count).toFixed(1)) : 0
    const metacognition = count > 0 ? Number((totalMetacognition / count).toFixed(1)) : 0
    const actionable = count > 0 ? Number((totalActionable / count).toFixed(1)) : 0
    const average = count > 0 ? Number(((depth + coherence + metacognition + actionable) / 4).toFixed(1)) : 0
    
    return {
      date,
      depth,
      coherence,
      metacognition,
      actionable,
      average
    }
  })
  
  // Calculate reflection counts over time
  const dateGroups: Record<string, number> = {}
  
  sortedReflections.forEach(reflection => {
    const date = new Date(reflection.created_at).toISOString().split('T')[0]
    dateGroups[date] = (dateGroups[date] || 0) + 1
  })
  
  const reflectionCounts = Object.entries(dateGroups).map(([date, count]) => ({
    date: formatDate(date),
    count
  }))
  
  return {
    totalReflections,
    avgKpis: {
      depth: avgDepth,
      coherence: avgCoherence,
      metacognition: avgMetacognition,
      actionable: avgActionable,
      overall: avgOverall
    },
    levelDistribution: {
      descriptive,
      analytical,
      critical
    },
    categoryDistribution,
    kpiTrends,
    reflectionCounts
  }
}

// Helper function to format date
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' }
  return new Date(dateString).toLocaleDateString('de-DE', options)
} 