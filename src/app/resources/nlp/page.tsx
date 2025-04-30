import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Code, MessageSquareText, Database, FileText, Lightbulb, BarChart, Cpu, LayoutList, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function NLPResourcePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/resources" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zu Ressourcen
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Natural Language Processing (NLP)</h1>
        <p className="text-xl text-muted-foreground">
          Die Technologie hinter der computergestützten Verarbeitung und dem Verständnis natürlicher Sprache
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Was ist Natural Language Processing?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert">
              <p>
                NLP ist ein Teilgebiet der Künstlichen Intelligenz, das sich mit der Interaktion zwischen Computern und menschlicher Sprache beschäftigt. 
                Es bezieht sich auf die Fähigkeit eines Computers, menschliche Sprache zu verstehen, zu interpretieren und zu generieren.
              </p>
              <p>
                Die moderne NLP-Technologie ermöglicht es Computern, Texte zu analysieren, Muster zu erkennen, Stimmungen zu erfassen und sogar 
                semantische Beziehungen zwischen Wörtern und Sätzen zu verstehen. Diese Technologien sind die Grundlage für eine Vielzahl von Anwendungen, 
                von Sprachassistenten bis hin zu automatisierten Analysetools für Reflexionen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kernkonzepte der NLP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Tokenisierung</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Der Prozess, Text in kleinere Einheiten (Token) wie Wörter oder Zeichen zu zerlegen. 
                    Dies ist der erste Schritt bei der Textverarbeitung.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <LayoutList className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Part-of-Speech Tagging</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Die Kennzeichnung von Wörtern nach ihren grammatischen Eigenschaften (Substantiv, Verb, Adjektiv usw.) 
                    zur besseren Verarbeitung.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquareText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Stimmungsanalyse</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Die Identifizierung und Extraktion subjektiver Informationen aus Text, um die Stimmung oder 
                    emotionale Einstellung des Autors zu bestimmen.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Vektorrepräsentation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Die Umwandlung von Text in numerische Vektoren, wodurch Computer diese verarbeiten können. 
                    Diese "Einbettungen" erfassen semantische Bedeutungen.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>BERT: Ein Meilenstein in NLP</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert">
              <p>
                BERT (Bidirectional Encoder Representations from Transformers) ist ein wegweisendes NLP-Modell, das 2018 von Google 
                entwickelt wurde. Es hat die Art und Weise revolutioniert, wie Maschinen Sprache verstehen.
              </p>
              <h4>Wichtige Eigenschaften von BERT:</h4>
              <ul>
                <li>
                  <strong>Bidirektionales Verständnis:</strong> Im Gegensatz zu früheren Modellen versteht BERT Text in beide Richtungen und erfasst so 
                  den vollständigen Kontext eines Wortes aus der gesamten Umgebung (links und rechts).
                </li>
                <li>
                  <strong>Kontextbezogene Einbettungen:</strong> BERT erzeugt für das gleiche Wort unterschiedliche Einbettungen je nach Kontext, 
                  was ein tieferes Verständnis der Bedeutung ermöglicht.
                </li>
                <li>
                  <strong>Vortrainiert und anpassbar:</strong> BERT wird auf großen Textkorpora vortrainiert und kann dann für spezifische 
                  Aufgaben wie Klassifikation oder Frage-Antwort-Systeme feinabgestimmt werden.
                </li>
              </ul>
              <p>
                BERT und seine Ableger (wie RoBERTa, DistilBERT, ALBERT) haben die Grundlage für moderne NLP-Anwendungen gelegt und 
                sind Vorläufer der Large Language Models, die wir heute kennen.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-blue-700 dark:text-blue-400">BERT Visualisierung</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative w-full h-64 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border">
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                  BERT-Architektur Visualisierung
                  {/* In einer realen Anwendung würde hier ein echtes Bild stehen */}
                  {/* <Image src="/images/bert-architecture.png" alt="BERT Architecture" fill className="object-contain" /> */}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Die Architektur von BERT basiert auf dem Transformer-Modell mit mehreren Encoder-Schichten, 
                die bidirektionale Aufmerksamkeitsmechanismen verwenden.
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Einsatz von NLP in der Reflexionsanalyse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                NLP-Technologien wie BERT spielen eine entscheidende Rolle bei der Analyse von Reflexionstexten:
              </p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <BarChart className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Identifizierung der Reflexionstiefe basierend auf sprachlichen Merkmalen</p>
                </div>
                <div className="flex gap-2">
                  <MessageSquareText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Erkennung von emotionalen Komponenten in Reflexionen</p>
                </div>
                <div className="flex gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Extraktion von Schlüsselerkenntnissen und Lernmomenten</p>
                </div>
                <div className="flex gap-2">
                  <Cpu className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Automatisiertes Feedback und Vorschläge zur Verbesserung</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weiterführende Ressourcen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="https://huggingface.co/docs/transformers/model_doc/bert" target="_blank" className="block p-3 border rounded-lg hover:bg-accent transition-colors">
                <h4 className="font-medium mb-1">BERT bei Hugging Face</h4>
                <p className="text-sm text-muted-foreground">Ausführliche Dokumentation und Implementierungen</p>
              </Link>
              <Link href="https://www.youtube.com/watch?v=xI0HHN5XKDo" target="_blank" className="block p-3 border rounded-lg hover:bg-accent transition-colors">
                <h4 className="font-medium mb-1">Illustrated BERT (Video)</h4>
                <p className="text-sm text-muted-foreground">Visuelle Erklärung der BERT-Architektur</p>
              </Link>
              <Link href="https://github.com/google-research/bert" target="_blank" className="block p-3 border rounded-lg hover:bg-accent transition-colors">
                <h4 className="font-medium mb-1">Google's BERT GitHub</h4>
                <p className="text-sm text-muted-foreground">Offizielles Repository mit Code und Beispielen</p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Praktische Übungen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Text-Klassifikation mit BERT</CardTitle>
              <CardDescription>
                Lerne, wie BERT für die Klassifikation von Texten verwendet wird
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                In diesem Tutorial lernst du, wie du ein vortrainiertes BERT-Modell für die Klassifikation 
                von Reflexionstexten nach Tiefe und Qualität verwenden kannst.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <Code className="block text-sm mb-2">
                  <pre>
{`# Beispielcode für BERT-Finetuning
from transformers import BertTokenizer, BertForSequenceClassification
import torch

# Tokenizer laden
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# Modell für Klassifikation laden (z.B. 3 Klassen für Reflexionstiefe)
model = BertForSequenceClassification.from_pretrained(
    'bert-base-uncased', 
    num_labels=3
)`}
                  </pre>
                </Code>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/resources/tutorials/bert-classification">
                  Zum vollständigen Tutorial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Semantische Textanalyse</CardTitle>
              <CardDescription>
                Extrahiere Bedeutung und Kontext aus Reflexionstexten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Diese Übung zeigt, wie du mit NLP-Techniken semantische Ähnlichkeiten zwischen Texten berechnen 
                und Schlüsselthemen in Reflexionen identifizieren kannst.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <Code className="block text-sm mb-2">
                  <pre>
{`# Beispielcode für semantische Ähnlichkeit
from sentence_transformers import SentenceTransformer

# Modell laden
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Einbettungen für zwei Texte erzeugen
embedding1 = model.encode("Ich habe gelernt, dass Teamarbeit wichtig ist.")
embedding2 = model.encode("Die Zusammenarbeit im Team war eine wertvolle Erfahrung.")`}
                  </pre>
                </Code>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/resources/tutorials/semantic-analysis">
                  Zum vollständigen Tutorial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 