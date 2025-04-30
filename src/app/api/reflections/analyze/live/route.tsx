import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import OpenAI from 'openai'
import { openaiLogger, apiLogger, safeApiLogger, safeOpenaiLogger } from "@/utils/logging"

// Initialize OpenAI client
let openai: OpenAI | undefined
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
  openaiLogger.info("OpenAI client initialized successfully for live analysis")
} catch (error: any) {
  openaiLogger.critical("Failed to initialize OpenAI client for live analysis", { 
    errorName: error?.name || 'UnknownError',
    errorMessage: error?.message || 'No error message available'
  })
  // Continue with undefined client - will be handled in functions
}

export async function POST(request: Request): Promise<Response> {
  apiLogger.info("Live reflection analysis request received")
  
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      apiLogger.warn("Unauthorized live analysis attempt", { userId: null })
      return new NextResponse(JSON.stringify({ error: "Nicht authentifiziert" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    apiLogger.info("Authenticated user for live analysis", { userId: user.id })
    
    // Get request body
    const { content, title, category } = await request.json()
    
    if (!content) {
      apiLogger.warn("Missing content for live analysis")
      return new NextResponse(JSON.stringify({ error: "Reflexionsinhalt ist erforderlich" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    apiLogger.info("Starting live analysis", { 
      contentLength: content.length,
      title,
      category
    })
    
    // Perform analysis for real-time feedback
    const analysis = await getLiveAnalysis(content, title, category)
    
    apiLogger.info("Live analysis completed successfully", {
      analysisScores: {
        depth: analysis.kpi_depth,
        coherence: analysis.kpi_coherence,
        metacognition: analysis.kpi_metacognition,
        actionable: analysis.kpi_actionable
      },
      reflectionLevel: analysis.reflection_level,
      promptsCount: analysis.adaptive_prompts.length
    })
    
    return new NextResponse(JSON.stringify({
      success: true,
      analysis
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (error: any) {
    safeApiLogger.errorSafe('Error analyzing reflection in real-time:', error)
    return new NextResponse(JSON.stringify({ error: "Interner Serverfehler" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// Enhanced analysis for real-time feedback using both basic NLP and OpenAI
async function getLiveAnalysis(content: string, title?: string, category?: string) {
  apiLogger.debug("Performing live analysis", { contentLength: content.length })
  
  try {
    // First perform basic text statistics analysis
    const words = content.split(/\s+/).length;
    const sentences = (content.match(/[.!?]+/g) || []).length || 1;
    const paragraphs = content.split(/\n\s*\n/).length;
    
    apiLogger.debug("Text statistics", { words, sentences, paragraphs })
    
    // Detect extremely short texts - scientific threshold based on reflection research
    const isVeryShortText = words < 7 || content.length < 50;
    
    if (isVeryShortText) {
      apiLogger.info("Text is too short for meaningful analysis", { words, length: content.length });
      
      // For extremely short texts, provide minimal scores that accurately reflect
      // the inability to demonstrate reflection qualities in such limited text
      return {
        kpi_depth: 0,
        kpi_coherence: 0,
        kpi_metacognition: 0,
        kpi_actionable: 0,
        reflection_level: "Beschreibend",
        adaptive_prompts: [
          "Könnten Sie Ihre Gedanken ausführlicher beschreiben?",
          "Was ist der Kontext dieser Situation?",
          "Welche Details können Sie hinzufügen, um ein vollständigeres Bild zu vermitteln?"
        ],
        quick_feedback: "Der Text ist zu kurz für eine aussagekräftige Analyse. Mehr Details würden eine tiefere Reflexion ermöglichen."
      };
    }
    
    // Calculate basic metrics using simple patterns
    const hasAnalyticalPhrases = /weil|daher|deshalb|dadurch|aus diesem grund|erkenne ich|verstehe ich/i.test(content);
    const hasCriticalPhrases = /kritisch|hinterfrage|alternative|verbessern|könnte ich|sollte ich|in zukunft/i.test(content);
    
    // Improved depth scoring with better text length normalization
    // Based on scientific research on reflection depth measurements
    let depthScore;
    if (words < 30) {
      // Short texts can't demonstrate much depth
      depthScore = Math.min(words / 10, 3);
    } else if (words < 100) {
      // Medium length texts have a medium potential for depth
      depthScore = Math.min(3 + (words - 30) / 25, 7);
    } else {
      // Longer texts can demonstrate significant depth, but
      // length alone doesn't guarantee depth
      const baseDepthScore = 7 + Math.min((words - 100) / 100, 3);
      depthScore = baseDepthScore * 0.7; // Length-based component
    }
    
    // Add quality factors
    if (hasAnalyticalPhrases) depthScore += 1.5;
    if (hasCriticalPhrases) depthScore += 2;
    
    // Normalize to scale
    depthScore = Math.min(Math.max(Math.round(depthScore), 0), 10);
    
    // Calculate coherence with scientific approaches from text linguistics
    // Length-adjusted scoring based on sentence structure and optimal length ranges
    const normalizedSentenceCount = sentences / Math.sqrt(words / 10);
    const textLengthFactor = Math.min(1, Math.max(0.3, Math.log10(words) / Math.log10(100)));
    
    // Calculate coherence based on sentence lengths - too short or too long sentences
    // both reduce coherence according to text linguistics research
    const avgSentenceLength = words / sentences;
    const optimalSentenceLength = 15; // Research-based optimal for German text
    const sentenceLengthDeviation = Math.abs(avgSentenceLength - optimalSentenceLength) / optimalSentenceLength;
    
    // Coherence score with scientific calibration
    const coherenceScore = Math.min(
      10,
      Math.max(
        0,
        Math.round(10 * textLengthFactor * (1 - sentenceLengthDeviation * 0.5))
      )
    );
    
    // Calculate metacognition and action orientation with simple pattern matching
    const metacognitiveTerms = [
      "ich denke", "ich fühle", "ich bemerke", "ich erkenne", "ich verstehe",
      "mir ist aufgefallen", "ich habe gelernt", "ich weiss nun", "ich bin mir bewusst",
      "reflektiere", "bewusstwerden", "nachdenken über", "mein denken", "meine gedanken",
      "selbstreflexion", "mir bewusst", "erkenntnis", "erkannt", "bewusstsein",
      "metakognitiv", "denkprozess", "meine perspektive", "meine sichtweise", "selbstkritisch",
      "hinterfragen", "ich realisiere", "bewusstwerdung", "mental", "kognitiv",
      "ich stelle fest", "ich beobachte", "wahrnehmung", "gedanken zum prozess", 
      "mein verhalten", "meine reaktion", "zeigt mir", "verstanden", "klarheit gewonnen"
    ];
    
    // Verbessere die Gewichtung für bestimmte starke metakognitive Muster
    const strongMetacognitivePatterns = [
      /über mein(e)?\s+.+\s+nachgedacht/i,
      /selbstreflexion/i,
      /mein(e)?\s+denkprozess(e)?/i,
      /mein(e)?\s+lernprozess(e)?/i,
      /bewusst(er)?\s+geworden/i,
      /metakognitiv/i,
      /reflektiere über/i
    ];
    
    // Zähle sowohl exakte Begriffe als auch Muster
    const metacognitiveMatches = metacognitiveTerms.filter(term => 
      content.toLowerCase().includes(term.toLowerCase())
    ).length;
    
    // Zähle starke Muster mit höherer Gewichtung
    const strongMetacognitiveMatchCount = strongMetacognitivePatterns.filter(pattern => 
      pattern.test(content.toLowerCase())
    ).length;
    
    // Berechne Metakognitions-Score mit verbesserter Gewichtung
    // Basis-Score aus einfachen Begriffen + Bonus für starke Muster
    const metacognitionScore = Math.min(
      metacognitiveMatches * 1.5 + strongMetacognitiveMatchCount * 2.5, 
      10
    );
    
    const actionTerms = [
      "ich werde", "nächstes mal", "zukünftig", "plan", "vorhaben", "umsetzen",
      "anwenden", "verbessern", "ändern", "in zukunft", "künftig", "ab sofort",
      "als nächstes", "mein ziel ist", "vornehmen", "implementieren", "anpassen",
      "nutzen", "einsetzen", "durchführen", "praktisch anwenden", "konkret",
      "aktionsplan", "strategie", "vorgehen", "schritte", "maßnahmen", "lösung"
    ];
    
    // Stärkere Muster für Handlungsorientierung
    const strongActionPatterns = [
      /ich werde (in zukunft|ab sofort|künftig)/i,
      /mein(e)? (nächste(r|n|s)?|konkrete(r|n|s)?) schritt(e)?/i,
      /ich (plane|habe vor|nehme mir vor)/i,
      /ziel ist es/i,
      /konkrete maßnahmen/i,
      /aktionsplan/i
    ];
    
    // Zähle einfache Begriffe
    const actionMatches = actionTerms.filter(term => 
      content.toLowerCase().includes(term.toLowerCase())
    ).length;
    
    // Zähle stärkere Muster mit höherer Gewichtung
    const strongActionMatchCount = strongActionPatterns.filter(pattern => 
      pattern.test(content.toLowerCase())
    ).length;
    
    // Verbesserte Berechnung mit Gewichtung
    const actionScore = Math.min(actionMatches * 1.5 + strongActionMatchCount * 2.5, 10);
    
    // Determine reflection level 
    let reflectionLevel = "Beschreibend";
    const overallScore = (depthScore + metacognitionScore + coherenceScore + actionScore) / 4;
    
    if (overallScore >= 8) {
      reflectionLevel = "Kritisch";
    } else if (overallScore >= 6) {
      reflectionLevel = "Analytisch";
    }
    
    // Generate adaptive prompts using OpenAI if available
    let adaptivePrompts: string[] = [];
    let quickFeedback = "";
    
    // Try to use OpenAI for more intelligent prompts and feedback
    if (openai && content.length >= 30) {
      try {
        apiLogger.debug("Requesting OpenAI assistance for live analysis");
        
        const systemPrompt = `Als Reflexionscoach analysierst du kurz einen Text und hilfst, ihn zu verbessern.
        
        Gib zurück:
        1. 3 hilfreiche Fragen, die den Autor zum tieferen Nachdenken anregen
        2. Ein kurzes, konstruktives Feedback (max. 1-2 Sätze)
        
        Antworte in einem validen JSON mit 'adaptive_prompts' (Array) und 'quick_feedback' (String).
        
        Reflexionskontext: ${category || 'Allgemein'}
        Titel: ${title || 'Keine Angabe'}`
        
        const response = await openai.chat.completions.create({
          model: "gpt-4.1",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: content }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 300
        });
        
        // Parse the response
        if (response.choices[0]?.message?.content) {
          const llmResponse = JSON.parse(response.choices[0].message.content);
          
          if (Array.isArray(llmResponse.adaptive_prompts)) {
            adaptivePrompts = llmResponse.adaptive_prompts;
          }
          
          if (typeof llmResponse.quick_feedback === 'string') {
            quickFeedback = llmResponse.quick_feedback;
          }
          
          apiLogger.debug("Successfully generated LLM-based feedback", {
            promptsCount: adaptivePrompts.length,
            feedbackLength: quickFeedback.length
          });
        }
      } catch (error: any) {
        apiLogger.error("Error generating LLM-based feedback", { 
          errorName: error?.name || 'UnknownError',
          errorMessage: error?.message || 'No error message available'
        });
        // Fallback to rule-based prompts if OpenAI fails
        adaptivePrompts = generateRuleBasedPrompts(content, words, hasAnalyticalPhrases, hasCriticalPhrases, metacognitionScore, actionScore);
        quickFeedback = generateBasicFeedback(overallScore);
      }
    } else {
      // Fallback to rule-based approach if OpenAI is unavailable
      adaptivePrompts = generateRuleBasedPrompts(content, words, hasAnalyticalPhrases, hasCriticalPhrases, metacognitionScore, actionScore);
      quickFeedback = generateBasicFeedback(overallScore);
    }
    
    const result = {
      kpi_depth: Math.round(depthScore),
      kpi_coherence: Math.round(coherenceScore),
      kpi_metacognition: Math.round(metacognitionScore),
      kpi_actionable: Math.round(actionScore),
      reflection_level: reflectionLevel,
      quick_feedback: quickFeedback,
      adaptive_prompts: adaptivePrompts,
      stats: {
        words,
        sentences,
        paragraphs
      }
    };
    
    apiLogger.info("Quick analysis results", {
      scores: {
        depth: result.kpi_depth,
        coherence: result.kpi_coherence,
        metacognition: result.kpi_metacognition,
        actionable: result.kpi_actionable,
      },
      reflectionLevel,
      promptsCount: adaptivePrompts.length
    });
    
    return result;
  } catch (error: any) {
    apiLogger.error("Error performing live analysis", { 
      errorName: error?.name || 'UnknownError',
      errorMessage: error?.message || 'No error message available'
    });
    
    // Return default values in case of error
    return {
      kpi_depth: 5,
      kpi_coherence: 5,
      kpi_metacognition: 5,
      kpi_actionable: 5,
      reflection_level: "Beschreibend",
      quick_feedback: "Die Analyse konnte nicht abgeschlossen werden.",
      adaptive_prompts: ["Fügen Sie mehr Details hinzu, um eine bessere Analyse zu ermöglichen."],
      stats: {
        words: 0,
        sentences: 0,
        paragraphs: 0
      }
    };
  }
}

// Fallback to generate rule-based prompts when OpenAI is unavailable
function generateRuleBasedPrompts(
  content: string,
  words: number,
  hasAnalyticalPhrases: boolean,
  hasCriticalPhrases: boolean,
  metacognitionScore: number,
  actionScore: number
): string[] {
  const prompts = [];
  
  // Check for different content patterns and add relevant prompts
  if (words < 50) {
    prompts.push("Versuchen Sie, mehr Details zu beschreiben. Was genau ist passiert?");
  } else if (!hasAnalyticalPhrases && words > 100) {
    prompts.push("Warum ist das passiert? Analysieren Sie die Ursachen und Zusammenhänge.");
  }
  
  if (!hasCriticalPhrases && words > 150) {
    prompts.push("Wie könnten Sie die Situation aus einer anderen Perspektive betrachten?");
  }
  
  if (metacognitionScore < 5 && words > 100) {
    prompts.push("Reflektieren Sie über Ihre eigenen Denk- und Lernprozesse: Was haben Sie über sich selbst gelernt?");
  }
  
  if (actionScore < 5 && words > 150) {
    prompts.push("Was werden Sie konkret tun, um diese Erkenntnisse in Zukunft anzuwenden?");
  }
  
  // If there are no suitable prompts yet, add some general ones
  if (prompts.length === 0) {
    prompts.push("Warum war diese Erfahrung wichtig für Sie?");
    if (words > 100) {
      prompts.push("Wie verändert diese Erkenntnis Ihr Verständnis?");
    }
    prompts.push("Welche Emotionen haben Sie während dieser Erfahrung empfunden und warum?");
  }
  
  // Limit to 3 most relevant prompts
  return prompts.slice(0, 3);
}

// Generate basic feedback based on overall score
function generateBasicFeedback(overallScore: number): string {
  if (overallScore < 5) {
    return "Versuchen Sie, tiefer in die Analyse zu gehen. Nicht nur was passiert ist, sondern auch warum und was Sie daraus gelernt haben.";
  } else if (overallScore < 7) {
    return "Gute Ansätze zur Reflexion. Vertiefen Sie Ihre Analyse und denken Sie über konkrete nächste Schritte nach.";
  } else {
    return "Sehr gute Reflexion mit tiefgehender Analyse. Achten Sie darauf, die Erkenntnisse auch in konkrete Handlungen zu überführen.";
  }
} 