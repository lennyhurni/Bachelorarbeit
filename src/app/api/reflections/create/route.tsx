import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
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
    
    // Get request body
    const { title, content, category, is_public, kpi_depth, kpi_coherence, kpi_metacognition, kpi_actionable } = await request.json()
    
    if (!title || !content) {
      return new NextResponse(JSON.stringify({ error: "Titel und Inhalt sind erforderlich" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Create new reflection in the database
    const { data: reflection, error } = await supabase
      .from('reflections')
      .insert({
        user_id: user.id,
        title,
        content,
        category: category || 'Allgemein',
        is_public: is_public || false,
        kpi_depth: kpi_depth || 0,
        kpi_coherence: kpi_coherence || 0,
        kpi_metacognition: kpi_metacognition || 0,
        kpi_actionable: kpi_actionable || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating reflection:', error)
      return new NextResponse(JSON.stringify({ error: "Fehler beim Erstellen der Reflexion" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    return new NextResponse(JSON.stringify({
      success: true,
      reflection
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (error) {
    console.error('Error creating reflection:', error)
    return new NextResponse(JSON.stringify({ error: "Interner Serverfehler" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
} 