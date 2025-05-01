import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { apiLogger, safeApiLogger } from "@/utils/logging"

export async function POST(request: Request): Promise<Response> {
  apiLogger.info("New reflection request received")
  
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      apiLogger.warn("Unauthorized reflection creation attempt", { userId: null })
      return new NextResponse(JSON.stringify({ error: "Nicht authentifiziert" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    apiLogger.info("Authenticated user for reflection creation", { userId: user.id })
    
    // Get request body
    const { title, content, category, isPublic } = await request.json()
    
    if (!title || !content) {
      apiLogger.warn("Missing required fields", { 
        titleProvided: !!title, 
        contentProvided: !!content 
      })
      return new NextResponse(JSON.stringify({ error: "Titel und Inhalt sind erforderlich" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    apiLogger.info("Creating new reflection", { 
      title,
      contentLength: content.length,
      category,
      isPublic
    })
    
    // Insert new reflection
    const { data: newReflection, error } = await supabase
      .from('reflections')
      .insert({
        user_id: user.id,
        title,
        content,
        category,
        is_public: isPublic === true
      })
      .select()
      .single()
    
    if (error) {
      apiLogger.error("Error creating reflection", { error })
      return new NextResponse(JSON.stringify({ error: "Fehler beim Speichern der Reflexion" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    apiLogger.info("Reflection created successfully", { 
      reflectionId: newReflection.id
    })
    
    // Schedule prompt generation (after 2 minutes)
    // We'll use setTimeout here but in a production environment you'd use a proper job queue
    setTimeout(async () => {
      try {
        apiLogger.info("Auto-generating prompt based on new reflection", { reflectionId: newReflection.id })
        
        // Get the user's past reflections including the new one
        const { data: reflections } = await supabase
          .from("reflections")
          .select("title, content, created_at, category, reflection_level, kpi_depth, kpi_coherence, kpi_metacognition, kpi_actionable")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5) // Get the most recent 5 reflections
        
        // Get user settings
        const { data: settings } = await supabase
          .from("user_settings")
          .select("feedback_depth_level")
          .eq("user_id", user.id)
          .single()
        
        // Create a fetch request to the generate-prompt endpoint
        // We're using fetch here to avoid circular dependencies
        const response = await fetch(new URL("/api/reflections/generate-prompt", request.url).toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Pass the user's session cookie along
            "Cookie": request.headers.get("cookie") || ""
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          apiLogger.info("Successfully auto-generated prompt", { 
            promptId: data.promptId,
            reflectionId: newReflection.id
          })
          
          // Link the prompt to the reflection that triggered it
          if (data.promptId) {
            await supabase
              .from("reflection_prompts")
              .update({
                generated_from_reflection_id: newReflection.id
              })
              .eq("id", data.promptId)
          }
        } else {
          apiLogger.warn("Failed to auto-generate prompt", {
            status: response.status,
            reflectionId: newReflection.id
          })
        }
      } catch (promptError) {
        apiLogger.error("Error in auto-generating prompt", { error: promptError })
        // Don't throw here - this is an async operation that shouldn't affect the user
      }
    }, 120000) // 2 minutes (120000ms)
    
    // Start reflection analysis as well
    try {
      // Analyze the new reflection
      await fetch(new URL("/api/reflections/analyze", request.url).toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": request.headers.get("cookie") || ""
        },
        body: JSON.stringify({
          reflectionId: newReflection.id,
          content,
          title,
          category
        })
      })
      
      apiLogger.info("Analysis requested for new reflection", { reflectionId: newReflection.id })
    } catch (analysisError) {
      apiLogger.error("Error requesting analysis for new reflection", { error: analysisError })
      // Don't throw - the reflection was created successfully
    }
    
    return new NextResponse(JSON.stringify({
      success: true,
      reflection: newReflection
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (error: any) {
    safeApiLogger.errorSafe('Error creating reflection:', error)
    return new NextResponse(JSON.stringify({ error: "Interner Serverfehler" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
} 