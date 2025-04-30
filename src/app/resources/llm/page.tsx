import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Brain, Book, Sparkles, ChevronLeft, Lightbulb, Shapes, Code, Zap, BookOpen, Terminal, MessageSquareText, Database, FileText, BarChart, Cpu, ArrowRight, Layers } from "lucide-react"
import Image from "next/image"

export default function LLMResourcePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/resources" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zu Ressourcen
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Large Language Models (LLMs)</h1>
        <p className="text-xl text-muted-foreground">
          Die fortschrittlichsten KI-Systeme für Sprachverarbeitung und -generierung
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Was sind Large Language Models?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert">
              <p>
                Large Language Models (LLMs) sind hochkomplexe KI-Systeme, die auf tiefen neuronalen Netzwerken basieren und darauf 
                trainiert wurden, menschliche Sprache zu verstehen und zu generieren. Sie werden als "large" bezeichnet, weil sie 
                Milliarden oder sogar Billionen von Parametern enthalten und auf enormen Mengen an Textdaten trainiert wurden.
              </p>
              <p>
                LLMs wie GPT (Generative Pre-trained Transformer), Claude, Llama und andere haben die Fähigkeit, kontextbezogene 
                Konversationen zu führen, Texte in verschiedenen Stilen zu generieren, Code zu schreiben, Fragen zu beantworten und 
                eine Vielzahl weiterer sprachbezogener Aufgaben durchzuführen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grundlegende Architektur von LLMs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Layers className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Transformer-Architektur</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Die meisten modernen LLMs basieren auf der Transformer-Architektur, die 2017 von Google vorgestellt wurde. 
                    Diese nutzt Aufmerksamkeitsmechanismen, um Beziehungen zwischen Wörtern über lange Textpassagen hinweg zu erfassen.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Self-Attention</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Der Schlüsselmechanismus, der es LLMs ermöglicht, Kontext zu verstehen. Self-Attention gewichtet 
                    die Bedeutung jedes Wortes in Bezug auf andere Wörter im Text.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Vortraining und Feinabstimmung</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    LLMs durchlaufen zunächst ein Vortraining auf enormen Textkorpora, gefolgt von Feinabstimmung 
                    für spezifische Aufgaben und Reinforcement Learning from Human Feedback (RLHF).
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Parameter und Skalierung</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Die Leistungsfähigkeit von LLMs skaliert mit ihrer Größe. Moderne Modelle haben Hunderte von Milliarden 
                    Parameter, was zu emergenten Fähigkeiten führt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Die Evolution von GPT</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert">
              <p>
                Die GPT (Generative Pre-trained Transformer) Familie von OpenAI ist eine der bekanntesten LLM-Reihen und 
                hat die Entwicklung im Bereich der KI maßgeblich vorangetrieben.
              </p>
              
              <div className="not-prose">
                <div className="space-y-4 my-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-lg mb-2">GPT-1 (2018)</h4>
                    <p className="text-sm">
                      Das erste Modell der Serie mit 117 Millionen Parametern. Es zeigte bereits beeindruckende Fähigkeiten 
                      zur Textgenerierung, war aber noch begrenzt in Kontext und Verständnis.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-lg mb-2">GPT-2 (2019)</h4>
                    <p className="text-sm">
                      Mit 1,5 Milliarden Parametern zeigte GPT-2 dramatisch verbesserte Fähigkeiten und konnte kohärente, 
                      längere Texte generieren. OpenAI veröffentlichte es zunächst nicht vollständig aus Bedenken über Missbrauch.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-lg mb-2">GPT-3 (2020)</h4>
                    <p className="text-sm">
                      Ein Quantensprung mit 175 Milliarden Parametern. GPT-3 zeigte erstaunliche "few-shot learning" Fähigkeiten 
                      und konnte komplexe Aufgaben mit minimalen Anweisungen durchführen.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800/30">
                    <h4 className="font-medium text-lg mb-2">GPT-4 (2023)</h4>
                    <p className="text-sm">
                      Das bisher fortschrittlichste Modell mit multimodalen Fähigkeiten (Text und Bild). Es zeigt deutlich 
                      verbesserte Reasoning-Fähigkeiten, kontextuelle Verarbeitung und kann komplexere Aufgaben lösen.
                    </p>
                  </div>
                </div>
              </div>
              
              <p>
                Jede Generation von GPT hat nicht nur die Textgenerierung verbessert, sondern auch tiefere Verständnisfähigkeiten 
                und die Fähigkeit, aus Kontext zu lernen. Diese Modelle haben gezeigt, dass mit zunehmender Größe und Komplexität 
                emergente Fähigkeiten entstehen können - Fähigkeiten, die nicht explizit trainiert wurden, sondern aus der Skalierung resultieren.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800/30">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-400">LLM-Landschaft</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Die wichtigsten LLMs im Überblick:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-medium text-sm mb-1">GPT-4</h4>
                  <p className="text-xs text-muted-foreground">OpenAI (2023)</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-medium text-sm mb-1">Claude 3</h4>
                  <p className="text-xs text-muted-foreground">Anthropic (2024)</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-medium text-sm mb-1">Llama 3</h4>
                  <p className="text-xs text-muted-foreground">Meta (2024)</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-medium text-sm mb-1">Gemini</h4>
                  <p className="text-xs text-muted-foreground">Google (2023)</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-medium text-sm mb-1">Mixtral</h4>
                  <p className="text-xs text-muted-foreground">Mistral AI (2023)</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-medium text-sm mb-1">PaLM 2</h4>
                  <p className="text-xs text-muted-foreground">Google (2023)</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Die LLM-Landschaft entwickelt sich rasant weiter, mit neuen Modellen, die regelmäßig veröffentlicht werden und 
                immer neue Fähigkeiten und Verbesserungen bieten.
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fähigkeiten moderner LLMs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <MessageSquareText className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Natürliche Konversation und kontextbezogenes Verstehen</p>
                </div>
                <div className="flex gap-2">
                  <Code className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Code-Generierung und -Analyse in verschiedenen Programmiersprachen</p>
                </div>
                <div className="flex gap-2">
                  <FileText className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Übersetzung zwischen Sprachen und Zusammenfassung von Texten</p>
                </div>
                <div className="flex gap-2">
                  <Lightbulb className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Kreative Inhalte wie Geschichten, Gedichte oder Marketingtexte</p>
                </div>
                <div className="flex gap-2">
                  <Brain className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Logisches Denken und Problemlösung in komplexen Szenarien</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weiterführende Ressourcen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="https://openai.com/research/gpt-4" target="_blank" className="block p-3 border rounded-lg hover:bg-accent transition-colors">
                <h4 className="font-medium mb-1">OpenAI GPT-4 Dokumentation</h4>
                <p className="text-sm text-muted-foreground">Offizielle Informationen zu GPT-4</p>
              </Link>
              <Link href="https://huggingface.co/blog/llm-course" target="_blank" className="block p-3 border rounded-lg hover:bg-accent transition-colors">
                <h4 className="font-medium mb-1">Hugging Face LLM-Kurs</h4>
                <p className="text-sm text-muted-foreground">Kostenloser Online-Kurs zu LLMs</p>
              </Link>
              <Link href="https://stanford-cs324.github.io/winter2022/" target="_blank" className="block p-3 border rounded-lg hover:bg-accent transition-colors">
                <h4 className="font-medium mb-1">Stanford CS324: LLMs</h4>
                <p className="text-sm text-muted-foreground">Universitätskurs mit Materialien und Vorlesungen</p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">LLMs und Reflexionsanalyse</h2>
        <Card>
          <CardHeader>
            <CardTitle>Einsatz von LLMs zur Analyse von Reflexionen</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert">
            <p>
              Large Language Models bieten einzigartige Möglichkeiten für die Analyse von reflexiven Texten. Ihre Fähigkeit, 
              Kontext zu verstehen und komplexe sprachliche Nuancen zu erfassen, macht sie besonders wertvoll für die Bewertung 
              und Unterstützung von Reflexionsprozessen.
            </p>
            
            <h4>Anwendungsbereiche von LLMs in der Reflexionsanalyse:</h4>
            
            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart className="h-5 w-5 text-green-600" />
                  <h5 className="font-medium">Tiefenanalyse</h5>
                </div>
                <p className="text-sm">
                  LLMs können reflexive Texte analysieren und die Tiefe der Reflexion bewerten, indem sie kritisches Denken, 
                  Selbstwahrnehmung und Transformationspotenzial identifizieren.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                  <h5 className="font-medium">Personalisiertes Feedback</h5>
                </div>
                <p className="text-sm">
                  Basierend auf der Analyse können LLMs maßgeschneidertes Feedback geben, das auf die spezifischen Stärken und 
                  Entwicklungsbereiche des Reflektierenden eingeht.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquareText className="h-5 w-5 text-green-600" />
                  <h5 className="font-medium">Dialogische Unterstützung</h5>
                </div>
                <p className="text-sm">
                  LLMs können als dialogische Partner fungieren, die durch gezielte Fragen tiefere Reflexionen anregen und den 
                  Reflexionsprozess begleiten.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  <h5 className="font-medium">Aufdeckung von Mustern</h5>
                </div>
                <p className="text-sm">
                  Über mehrere Reflexionen hinweg können LLMs wiederkehrende Muster, Wachstumsbereiche und Entwicklungsfortschritte 
                  identifizieren.
                </p>
              </div>
            </div>
            
            <p>
              Die Integration von LLMs in Reflexionstools ermöglicht eine neue Dimension der Unterstützung für Lernende, die 
              über traditionelle Methoden hinausgeht. Dabei ist es wichtig, diese Technologien als Ergänzung und nicht als Ersatz 
              für menschliches Feedback zu betrachten und ethische Überlegungen bezüglich Privatsphäre und Interpretationshoheit zu berücksichtigen.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/resources/reflection-theory">
                Mehr über Reflexionstheorie erfahren
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 