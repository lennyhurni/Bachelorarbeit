import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// Type that Next.js 15.2.4+ expects for route params
type RouteParams = {
  params: {
    id: string
  }
}

// GET endpoint to fetch a single reflection by ID
export async function GET(
  request: Request, 
  context: RouteParams
): Promise<Response> {
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
    
    // Get the reflection ID from the params
    const id = context.params.id
    
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Keine ID angegeben" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Fetch the reflection from Supabase
    const { data: reflection, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (error) {
      console.error('Error fetching reflection:', error)
      return new NextResponse(JSON.stringify({ error: "Reflexion nicht gefunden" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    return new NextResponse(JSON.stringify(reflection), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (error: any) {
    console.error('Error fetching reflection:', { 
      errorName: error?.name, 
      errorMessage: error?.message 
    })
    return new NextResponse(JSON.stringify({ error: "Interner Serverfehler" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// PUT endpoint to update a reflection
export async function PUT(
  request: Request, 
  context: RouteParams
): Promise<Response> {
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
    
    // Get the reflection ID from the params
    const id = context.params.id
    
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Keine ID angegeben" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Get request body
    const { title, content, category, is_public } = await request.json()
    
    if (!title || !content) {
      return new NextResponse(JSON.stringify({ error: "Titel und Inhalt sind erforderlich" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Check if the reflection exists and belongs to the user
    const { data: existingReflection, error: fetchError } = await supabase
      .from('reflections')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (fetchError || !existingReflection) {
      return new NextResponse(JSON.stringify({ error: "Reflexion nicht gefunden oder keine Berechtigung" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Update the reflection
    const { data: updatedReflection, error: updateError } = await supabase
      .from('reflections')
      .update({
        title,
        content,
        category,
        is_public,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error updating reflection:', updateError)
      return new NextResponse(JSON.stringify({ error: "Fehler beim Aktualisieren der Reflexion" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    return new NextResponse(JSON.stringify({
      success: true,
      reflection: updatedReflection
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (error: any) {
    console.error('Error updating reflection:', { 
      errorName: error?.name, 
      errorMessage: error?.message 
    })
    return new NextResponse(JSON.stringify({ error: "Interner Serverfehler" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// DELETE endpoint to delete a reflection
export async function DELETE(
  request: Request, 
  context: RouteParams
): Promise<Response> {
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
    
    // Get the reflection ID from the params
    const id = context.params.id
    
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Keine ID angegeben" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Check if the reflection exists and belongs to the user
    const { data: existingReflection, error: fetchError } = await supabase
      .from('reflections')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (fetchError || !existingReflection) {
      return new NextResponse(JSON.stringify({ error: "Reflexion nicht gefunden oder keine Berechtigung" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Delete the reflection
    const { error: deleteError } = await supabase
      .from('reflections')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    
    if (deleteError) {
      console.error('Error deleting reflection:', deleteError)
      return new NextResponse(JSON.stringify({ error: "Fehler beim Löschen der Reflexion" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    return new NextResponse(JSON.stringify({
      success: true
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (error: any) {
    console.error('Error deleting reflection:', { 
      errorName: error?.name, 
      errorMessage: error?.message 
    })
    return new NextResponse(JSON.stringify({ error: "Interner Serverfehler" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
} 