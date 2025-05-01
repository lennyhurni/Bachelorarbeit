import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// Agregar caché a la ruta para evitar solicitudes repetidas
export const dynamic = 'force-dynamic'
export const revalidate = 60 // revalidar cada minuto

// Simple caché en memoria para minimizar llamadas repetidas en desarrollo
const CACHE_DURATION = 10000; // 10 segundos en desarrollo
const responseCache = new Map();

export async function GET(request: Request): Promise<Response> {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Nicht authentifiziert" }), {
        status: 401,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "private, max-age=0, no-cache, no-store, must-revalidate"
        },
      })
    }
    
    // Check if we have a cached response for this user
    const cacheKey = `dashboard-${user.id}`;
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse && cachedResponse.timestamp > Date.now() - CACHE_DURATION) {
      return new NextResponse(JSON.stringify(cachedResponse.data), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "private, max-age=60, s-maxage=60",
          "X-Cache": "HIT" 
        },
      });
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
    
    // Get current reflection prompt
    const { data: promptData, error: promptError } = await supabase
      .from('reflection_prompts')
      .select('prompt_text')
      .eq('user_id', user.id)
      .eq('is_current', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (promptError && promptError.code !== 'PGRST116') { // Ignore "not found" errors
      console.error('Error fetching current prompt:', promptError)
    }
    
    const currentPrompt = promptData?.prompt_text || "Wie hat sich dein Verständnis zu diesem Thema im Laufe der Zeit entwickelt?"
    
    const responseData = {
      reflections: reflections || [],
      learningGoals: learningGoals || [],
      profile: profile || null,
      currentPrompt
    };
    
    // Store in cache
    responseCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });
    
    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "private, max-age=60, s-maxage=60",
        "X-Cache": "MISS"
      },
    })
    
  } catch (error: any) {
    console.error('Error fetching dashboard data:', { 
      errorName: error?.name, 
      errorMessage: error?.message 
    })
    return new NextResponse(JSON.stringify({ error: "Interner Serverfehler" }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      },
    })
  }
} 