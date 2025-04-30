import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

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
    
    // Get reflections
    const { data: reflections, error: reflectionsError } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (reflectionsError) {
      console.error('Error fetching reflections:', reflectionsError)
    }
    
    // Get learning goals
    const { data: learningGoals, error: goalsError } = await supabase
      .from('learning_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_completed', false)
      .order('target_date', { ascending: true })
      .limit(5)
    
    if (goalsError) {
      console.error('Error fetching learning goals:', goalsError)
    }
    
    // Get user profile with settings
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError)
    }
    
    return new NextResponse(JSON.stringify({
      reflections: reflections || [],
      learningGoals: learningGoals || [],
      profile: profile || null
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return new NextResponse(JSON.stringify({ error: "Interner Serverfehler" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
} 