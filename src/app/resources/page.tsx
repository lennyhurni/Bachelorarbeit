import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, Search, Database, BarChart4, NetworkIcon, BookOpen, Sparkles, Code, Lightbulb, Bot, Tablet } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">KI-Lernressourcen</h1>
        <p className="text-xl text-muted-foreground">
          Entdecke Materialien, um dein Verständnis von künstlicher Intelligenz zu vertiefen 
          und das Beste aus deinen Reflexionen herauszuholen.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800/30 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center bg-violet-100 dark:bg-violet-900/50">
              <Brain className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <CardTitle className="text-xl">Large Language Models</CardTitle>
            <CardDescription>
              Verstehe die Technologie hinter KI-Sprachmodellen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Erfahre, wie LLMs wie GPT-4, Claude und Llama funktionieren, ihre Stärken und Grenzen, 
              und wie sie deine Reflexionen bewerten können.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-violet-100/50 dark:bg-violet-900/20">Transformers</Badge>
              <Badge variant="outline" className="bg-violet-100/50 dark:bg-violet-900/20">Prompt Engineering</Badge>
              <Badge variant="outline" className="bg-violet-100/50 dark:bg-violet-900/20">NLP</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/resources/llm">
                Zu LLMs lernen
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800/30 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50">
              <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl">Natural Language Processing</CardTitle>
            <CardDescription>
              Die Wissenschaft der Textanalyse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Lerne über die Grundlagen und fortgeschrittenen Techniken des NLP, einschließlich 
              BERT, Tokenisierung, Vektoreinbettungen und semantischer Analyse.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/20">BERT</Badge>
              <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/20">Semantische Analyse</Badge>
              <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/20">Tokenisierung</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/resources/nlp">
                Zu NLP lernen
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800/30 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center bg-amber-100 dark:bg-amber-900/50">
              <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-xl">Reflexionstheorie</CardTitle>
            <CardDescription>
              Wissenschaftliche Grundlagen der Reflexion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Entdecke die wissenschaftlichen Modelle, die unseren Reflexionsanalysen 
              zugrunde liegen, wie Moons Reflexionsebenen und Schöns reflektierender Praktiker.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-amber-100/50 dark:bg-amber-900/20">Moons Modell</Badge>
              <Badge variant="outline" className="bg-amber-100/50 dark:bg-amber-900/20">Metakognition</Badge>
              <Badge variant="outline" className="bg-amber-100/50 dark:bg-amber-900/20">Lernprozess</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/resources/reflection-theory">
                Zur Reflexionstheorie
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-6">Weitere Themen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/resources/neural-networks" className="group">
            <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <NetworkIcon className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Neuronale Netze</h3>
              </div>
              <p className="text-sm text-muted-foreground">Grundlagen und Architektur neuronaler Netzwerke</p>
            </div>
          </Link>
          
          <Link href="/resources/prompt-engineering" className="group">
            <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Prompt Engineering</h3>
              </div>
              <p className="text-sm text-muted-foreground">Die Kunst, effektive Prompts für KI zu erstellen</p>
            </div>
          </Link>
          
          <Link href="/resources/data-visualization" className="group">
            <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <BarChart4 className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Datenvisualisierung</h3>
              </div>
              <p className="text-sm text-muted-foreground">Techniken zur visuellen Darstellung von Daten</p>
            </div>
          </Link>
          
          <Link href="/resources/databases" className="group">
            <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Datenbanken</h3>
              </div>
              <p className="text-sm text-muted-foreground">Speicherung und Abfrage von Daten</p>
            </div>
          </Link>
          
          <Link href="/resources/chatbots" className="group">
            <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Chatbots</h3>
              </div>
              <p className="text-sm text-muted-foreground">Entwicklung und Anwendung von Konversationsagenten</p>
            </div>
          </Link>
          
          <Link href="/resources/mobile-ai" className="group">
            <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Tablet className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Mobile KI</h3>
              </div>
              <p className="text-sm text-muted-foreground">KI-Anwendungen für mobile Geräte</p>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Lernpfade
            </CardTitle>
            <CardDescription>
              Strukturierte Wege zum Erlernen von KI-Konzepten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                KI-Grundlagen für Anfänger
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ein 5-Wochen-Kurs, der dich von den Grundlagen der KI bis hin zu einfachen 
                Anwendungen führt. Keine Vorkenntnisse erforderlich.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/resources/paths/beginners">
                  Zum Lernpfad
                </Link>
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Fortgeschrittene LLM-Nutzung
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Lerne fortgeschrittene Techniken wie Few-Shot Learning, Chain-of-Thought Prompting 
                und Prompt-Optimierung für leistungsstarke LLM-Anwendungen.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/resources/paths/advanced-llm">
                  Zum Lernpfad
                </Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="block text-sm text-muted-foreground">
            <p>
              Alle Lernpfade sind so konzipiert, dass sie deinem individuellen Tempo und Lernstil entsprechen. 
              Dein Fortschritt wird automatisch gespeichert, sodass du jederzeit unterbrechen und später fortfahren kannst.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 