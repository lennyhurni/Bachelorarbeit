import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request): Promise<Response> {
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
    
    // Get query parameters
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const sortBy = url.searchParams.get('sortBy') || 'date-desc'
    const search = url.searchParams.get('search')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    
    // Build query
    let query = supabase
      .from('reflections')
      .select('*')
      .eq('user_id', user.id)
    
    // Apply category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    // Apply search filter if provided
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'date-asc':
        query = query.order('created_at', { ascending: true })
        break
      case 'title-asc':
        query = query.order('title', { ascending: true })
        break
      case 'title-desc':
        query = query.order('title', { ascending: false })
        break
      case 'score-desc':
        query = query.order('kpi_depth', { ascending: false })
        break
      case 'score-asc':
        query = query.order('kpi_depth', { ascending: true })
        break
      case 'date-desc':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }
    
    // Apply limit
    query = query.limit(limit)
    
    // Execute query
    const { data: reflections, error } = await query
    
    if (error) {
      console.error('Error fetching reflections:', error)
      return new NextResponse(JSON.stringify({ error: "Fehler beim Abrufen der Reflexionen" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Get unique categories for filtering options
    const { data: categories, error: categoriesError } = await supabase
      .from('reflections')
      .select('category')
      .eq('user_id', user.id)
      .not('category', 'is', null)
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
    }
    
    // Extract unique categories
    const uniqueCategories = categories 
      ? [...new Set(categories.map((item: { category: string }) => item.category))]
      : []
    
    return new NextResponse(JSON.stringify({
      reflections: reflections || [],
      categories: uniqueCategories
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (error: any) {
    console.error('Error fetching reflections:', { 
      errorName: error?.name, 
      errorMessage: error?.message 
    })
    return new NextResponse(JSON.stringify({ error: "Interner Serverfehler" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
} 