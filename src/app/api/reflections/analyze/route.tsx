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
    const { reflectionText, reflectionId } = await request.json()
    
    if (!reflectionText) {
      return new NextResponse(JSON.stringify({ error: "Kein Reflexionstext angegeben" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Get user settings for feedback depth level
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('settings')
      .eq('id', user.id)
      .single()
    
    if (userError) {
      console.error('Error fetching user settings:', userError)
    }
    
    // Default to standard if no settings found
    const feedbackDepth = userData?.settings?.feedbackDepth || "standard"
    
    // Calculate KPIs based on the text
    // In a real system, this would use NLP/AI, but for demo we'll calculate random but consistent values
    const hashCode = (str: string) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
      }
      return hash
    }
    
    const getScoreFromText = (text: string, seed: number = 0) => {
      // Generate a somewhat consistent score based on text content and length
      const hash = hashCode(text) + seed
      const baseScore = Math.abs(hash % 100) / 10 // 0-10 range
      
      // More text generally means more in-depth reflection (to a point)
      let lengthBonus = 0
      if (text.length > 100) lengthBonus = 1
      if (text.length > 300) lengthBonus = 2
      if (text.length > 1000) lengthBonus = 3
      
      // Add some variability based on text metrics
      const sentenceCount = (text.match(/[.!?]+/g) || []).length
      const wordCount = text.split(/\s+/).length
      const avgSentenceLength = wordCount / (sentenceCount || 1)
      
      // Factor in how "complex" the writing is
      const complexityBonus = avgSentenceLength > 15 ? 1 : 0
      
      // Cap at 10
      return Math.min(10, Math.max(1, Math.round(baseScore + lengthBonus + complexityBonus)))
    }
    
    // Calculate KPIs
    const kpi_depth = getScoreFromText(reflectionText, 0)
    const kpi_coherence = getScoreFromText(reflectionText, 42) 
    const kpi_metacognition = getScoreFromText(reflectionText, 123)
    const kpi_actionable = getScoreFromText(reflectionText, 321)
    
    // Generate feedback based on depth setting
    let feedback = generateFeedback(reflectionText, {
      depth: kpi_depth,
      coherence: kpi_coherence,
      metacognition: kpi_metacognition,
      actionable: kpi_actionable
    }, feedbackDepth)
    
    // Update the reflection in the database if an ID was provided
    if (reflectionId) {
      const { error: updateError } = await supabase
        .from('reflections')
        .update({
          kpi_depth,
          kpi_coherence,
          kpi_metacognition,
          kpi_actionable
        })
        .eq('id', reflectionId)
        .eq('user_id', user.id)
      
      if (updateError) {
        console.error('Error updating reflection KPIs:', updateError)
      }
    }
    
    return new NextResponse(JSON.stringify({
      kpi_depth,
      kpi_coherence,
      kpi_metacognition,
      kpi_actionable,
      feedback
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (error) {
    console.error('Error analyzing reflection:', error)
    return new NextResponse(JSON.stringify({ error: "Interner Serverfehler" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// Helper function to generate appropriate feedback based on KPIs and depth setting
function generateFeedback(
  text: string, 
  kpis: { depth: number, coherence: number, metacognition: number, actionable: number },
  depthLevel: string
) {
  const avgScore = (kpis.depth + kpis.coherence + kpis.metacognition + kpis.actionable) / 4
  
  // Determine reflection level based on Moon's model
  let reflectionLevel = "descriptive"
  if (avgScore >= 8) reflectionLevel = "critical"
  else if (avgScore >= 6) reflectionLevel = "analytical"
  
  // Suggestions based on KPIs
  const suggestions: string[] = []
  
  if (kpis.depth < 5) {
    suggestions.push("Versuche tiefer in das Thema einzutauchen und mehr Details zu erforschen.")
  }
  
  if (kpis.coherence < 5) {
    suggestions.push("Deine Gedanken könnten strukturierter und zusammenhängender dargestellt werden.")
  }
  
  if (kpis.metacognition < 5) {
    suggestions.push("Reflektiere mehr über dein eigenes Denken und deine Lernprozesse.")
  }
  
  if (kpis.actionable < 5) {
    suggestions.push("Überlege, welche konkreten Handlungen aus deinen Erkenntnissen folgen könnten.")
  }
  
  // Base feedback for all levels
  let feedback: {
    summary: string;
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
  } = {
    summary: "",
    strengths: [],
    improvements: [],
    nextSteps: []
  }
  
  // Adjust feedback based on the selected depth level
  switch (depthLevel) {
    case "basic":
      // Simple feedback with minimal details
      feedback.summary = `Deine Reflexion ist auf dem ${reflectionLevel} Niveau.`
      if (suggestions.length > 0) {
        feedback.improvements = [suggestions[0]]
      }
      break
      
    case "detailed":
      // Comprehensive feedback with lots of details
      feedback.summary = `Deine Reflexion zeigt ein ${reflectionLevel} Reflexionsniveau nach Moon's Modell. Die durchschnittliche Bewertung beträgt ${avgScore.toFixed(1)}/10.`
      
      // Strengths based on highest KPIs
      const strengths: string[] = []
      if (kpis.depth >= 7) strengths.push("Du gehst in die Tiefe und analysierst Situationen gründlich.")
      if (kpis.coherence >= 7) strengths.push("Deine Gedanken sind logisch strukturiert und gut verbunden.")
      if (kpis.metacognition >= 7) strengths.push("Du zeigst eine starke metakognitive Bewusstheit.")
      if (kpis.actionable >= 7) strengths.push("Deine Reflexion enthält konkrete Handlungsschritte.")
      feedback.strengths = strengths.length > 0 ? strengths : ["Du hast einen guten Anfang gemacht mit deiner Reflexion."]
      
      // Include all improvement suggestions
      feedback.improvements = suggestions.length > 0 ? suggestions : ["Kontinuierliches Üben wird deine Reflexionsfähigkeiten weiter verbessern."]
      
      // Next steps based on reflection level
      if (reflectionLevel === "descriptive") {
        feedback.nextSteps = ["Versuche, über die reine Beschreibung hinauszugehen und nach Gründen und Verbindungen zu suchen.", 
                             "Stelle dir Fragen wie 'Warum ist das passiert?' und 'Wie hängt das mit anderen Erfahrungen zusammen?'"]
      } else if (reflectionLevel === "analytical") {
        feedback.nextSteps = ["Betrachte das Thema aus verschiedenen Perspektiven.", 
                             "Hinterfrage grundlegende Annahmen und erwäge alternative Erklärungen."]
      } else {
        feedback.nextSteps = ["Deine Reflexion ist bereits auf einem hohen Niveau. Versuche, sie noch mehr mit konkreten Handlungen zu verbinden.",
                             "Überlege, wie du deine Erkenntnisse in verschiedenen Kontexten anwenden kannst."]
      }
      break
      
    case "standard":
    default:
      // Balanced feedback with moderate detail
      feedback.summary = `Deine Reflexion zeigt ein ${reflectionLevel} Reflexionsniveau mit einer Gesamtbewertung von ${avgScore.toFixed(1)}/10.`
      
      // One strength based on highest KPI
      const highestKpi = Object.entries(kpis).reduce((a, b) => a[1] > b[1] ? a : b)
      if (highestKpi[1] >= 5) {
        switch (highestKpi[0]) {
          case "depth":
            feedback.strengths = ["Du gehst gut in die Tiefe bei deiner Analyse."]
            break
          case "coherence":
            feedback.strengths = ["Deine Gedanken sind gut strukturiert und zusammenhängend."]
            break
          case "metacognition":
            feedback.strengths = ["Du zeigst gutes Bewusstsein für deine eigenen Denkprozesse."]
            break
          case "actionable":
            feedback.strengths = ["Deine Reflexion enthält gute handlungsorientierte Elemente."]
            break
        }
      } else {
        feedback.strengths = ["Du hast einen guten Anfang gemacht mit deiner Reflexion."]
      }
      
      // Limited improvement suggestions
      feedback.improvements = suggestions.slice(0, 2)
      
      // Basic next step
      if (reflectionLevel === "descriptive") {
        feedback.nextSteps = ["Versuche, mehr über die Gründe und Zusammenhänge nachzudenken."]
      } else if (reflectionLevel === "analytical") {
        feedback.nextSteps = ["Betrachte das Thema aus verschiedenen Perspektiven."]
      } else {
        feedback.nextSteps = ["Verbinde deine Erkenntnisse mit konkreten Handlungsschritten."]
      }
      break
  }
  
  return feedback
} 