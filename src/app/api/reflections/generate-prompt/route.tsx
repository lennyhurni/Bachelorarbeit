import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import OpenAI from 'openai'
import { openaiLogger, apiLogger, safeApiLogger } from "@/utils/logging"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request): Promise<Response> {
  apiLogger.info("Generate reflection prompt request received")
  
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      apiLogger.warn("Unauthorized prompt generation attempt", { userId: null })
      return new NextResponse(JSON.stringify({ error: "Nicht authentifiziert" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    apiLogger.info("Authenticated user for prompt generation", { userId: user.id })
    
    // Get the user's past reflections for context
    const { data: reflections } = await supabase
      .from("reflections")
      .select("title, content, created_at, category, reflection_level, kpi_depth, kpi_coherence, kpi_metacognition, kpi_actionable")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5) // Get the most recent 5 reflections
    
    // Get user settings to determine feedback depth
    const { data: settings } = await supabase
      .from("user_settings")
      .select("feedback_depth_level")
      .eq("user_id", user.id)
      .single()
    
    const feedbackDepth = settings?.feedback_depth_level || "standard"
    
    apiLogger.info("Generating prompt with context", { 
      userId: user.id,
      reflectionsCount: reflections?.length || 0,
      feedbackDepth
    })
    
    // Generate personalized prompt
    const prompt = await generateReflectionPrompt(reflections || [], feedbackDepth)
    
    // Save the prompt to the database
    const { data: promptData, error: promptError } = await supabase
      .from("reflection_prompts")
      .insert({
        user_id: user.id,
        prompt_text: prompt,
        is_current: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (promptError) {
      apiLogger.error("Error saving generated prompt", { error: promptError })
      
      // Still return the prompt even if saving failed
      return new NextResponse(JSON.stringify({ 
        prompt,
        saved: false,
        error: "Prompt konnte nicht gespeichert werden"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Set all other prompts to not current
    await supabase
      .from("reflection_prompts")
      .update({ is_current: false })
      .neq("id", promptData.id)
      .eq("user_id", user.id)
    
    apiLogger.info("Prompt generated and saved successfully", { promptId: promptData.id })
    
    return new NextResponse(JSON.stringify({ 
      prompt,
      promptId: promptData.id,
      saved: true 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (error: any) {
    safeApiLogger.errorSafe('Error generating reflection prompt:', error)
    return new NextResponse(JSON.stringify({ 
      error: "Interner Serverfehler",
      prompt: "Wie hat sich dein Verständnis zu diesem Thema im Laufe der Zeit entwickelt?" // Fallback prompt
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

async function generateReflectionPrompt(reflections: any[], feedbackDepth: string): Promise<string> {
  try {
    // If no past reflections, return a general prompt
    if (!reflections || reflections.length === 0) {
      return "Wie hat sich dein Verständnis zu diesem Thema im Laufe der Zeit entwickelt?";
    }

    // Prepare context for GPT
    let context = "";
    
    // Add information about past reflections
    reflections.forEach((reflection, index) => {
      context += `Reflexion ${index + 1}:\n`;
      context += `Titel: ${reflection.title}\n`;
      if (reflection.category) context += `Kategorie: ${reflection.category}\n`;
      if (reflection.reflection_level) context += `Reflexionsniveau: ${reflection.reflection_level}\n`;
      if (reflection.kpi_depth) context += `Tiefe: ${reflection.kpi_depth}/10\n`;
      if (reflection.kpi_coherence) context += `Kohärenz: ${reflection.kpi_coherence}/10\n`;
      if (reflection.kpi_metacognition) context += `Metakognition: ${reflection.kpi_metacognition}/10\n`;
      if (reflection.kpi_actionable) context += `Handlungsorientierung: ${reflection.kpi_actionable}/10\n`;
      
      // Include full content for all reflections
      context += `Inhalt: ${reflection.content}\n`;
      
      context += `Datum: ${new Date(reflection.created_at).toLocaleDateString()}\n\n`;
    });

    // Determine prompt complexity based on feedback depth
    let promptComplexity = "mittel";
    if (feedbackDepth === "basic") promptComplexity = "einfach";
    if (feedbackDepth === "detailed") promptComplexity = "komplex";

    // System prompt for OpenAI
    const systemPrompt = `Du bist ein Experte für reflexives Denken und hilfst einer Person, tiefere Reflexionen zu entwickeln.
    
Aufgabe: Generiere einen personalisierten, kreativen Reflexionsimpuls basierend auf der bisherigen Reflexionshistorie der Person.

Reflexionskategorien nach Moon (2004):
1. BESCHREIBEND: Einfache Wiedergabe von Ereignissen ohne tiefere Analyse
2. ANALYTISCH: Identifikation von Mustern, Ursachen und Wirkungen
3. KRITISCH: Tiefergehende Betrachtung unter Berücksichtigung verschiedener Perspektiven und grösserer Kontexte

Bewertungskriterien von Reflexionen:
- Tiefe: Detailliertheit und inhaltliche Differenzierung
- Kohärenz: Logischer Zusammenhang und Struktur der Gedanken
- Metakognition: Bewusstsein über eigene Denk- und Lernprozesse
- Handlungsorientierung: Ableitung konkreter Massnahmen und Verhaltensänderungen

ANALYSE DER REFLEXIONSHISTORIE:
1. Identifiziere das vorherrschende Reflexionsniveau des Nutzers (insbesondere in der neuesten Reflexion)
2. Erkenne Themen und Muster, die in mehreren Reflexionen auftreten
3. Beachte die KPI-Werte, besonders Bereiche mit Verbesserungspotential (niedrigere Werte)
4. Achte auf den tatsächlichen Inhalt der neuesten Reflexion, nicht nur auf Metadaten

PROGRESSION DES REFLEXIONSNIVEAUS:
- Wenn die Person überwiegend auf BESCHREIBENDER Ebene reflektiert:
  → Formuliere einen Impuls, der zu analytischem Denken anregt (nach Ursachen, Wirkungen, Mustern fragen)
  → Beispiel: "Welche Muster erkennst du in deinen Reaktionen auf ähnliche Situationen?"

- Wenn die Person bereits ANALYTISCH reflektiert:
  → Rege kritisches, multiperspektivisches Denken an
  → Beispiel: "Wie würde sich deine Analyse verändern, wenn du die Situation aus einer völlig anderen Perspektive betrachtest?"

- Wenn die Person bereits KRITISCH reflektiert:
  → Fordere zur Vertiefung oder zum Transferdenken auf
  → Beispiel: "Inwiefern verändert diese Erkenntnis deine grundlegenden Annahmen über dein Fachgebiet?"

Der Reflexionsimpuls soll:
1. Direkt auf Themen und Inhalte der neuesten Reflexion Bezug nehmen
2. Die Person gezielt zur nächsthöheren Reflexionsebene anregen
3. Als offene Frage oder Denkanstoss formuliert sein
4. In einem einladenden, nicht akademischen Ton verfasst sein
5. Eine Komplexität auf ${promptComplexity}em Niveau haben
6. In maximal 1-2 Sätzen formuliert sein (kurz und prägnant)
7. In deutscher Sprache verfasst sein

Generiere nur den Reflexionsimpuls ohne Erklärungen oder Einleitungen.`;

    // Call OpenAI
    openaiLogger.debug("Sending prompt generation request to OpenAI", { 
      contextLength: context.length,
      reflectionCount: reflections.length,
      feedbackDepth 
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Hier ist die Reflexionshistorie der Person:\n\n${context}\n\nBitte generiere einen personalisierten Reflexionsimpuls.` }
      ],
      temperature: 0.8
    });
    
    const generatedPrompt = response.choices[0]?.message?.content?.trim();
    
    if (!generatedPrompt) {
      openaiLogger.warn("Empty prompt returned from OpenAI");
      return "Wie könntest du deine Erkenntnisse in verschiedenen Kontexten anwenden?";
    }
    
    openaiLogger.info("Successfully generated reflection prompt", { 
      promptLength: generatedPrompt.length 
    });
    
    return generatedPrompt;
    
  } catch (error: any) {
    openaiLogger.error("Error in prompt generation:", {
      errorName: error?.name || 'UnknownError',
      errorMessage: error?.message || 'No error message available'
    });
    
    // Fallback prompts if OpenAI fails
    const fallbackPrompts = [
      "Wie hat sich dein Verständnis zu diesem Thema im Laufe der Zeit entwickelt?",
      "Welche neuen Einsichten hast du gewonnen und wie könntest du diese umsetzen?",
      "Betrachte dein letztes Erlebnis aus einer anderen Perspektive. Was würdest du heute anders machen?",
      "Welche Verbindungen siehst du zwischen deinen verschiedenen Erfahrungen?",
      "Wie könntest du deine Erkenntnisse in verschiedenen Kontexten anwenden?"
    ];
    
    return fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
  }
} 