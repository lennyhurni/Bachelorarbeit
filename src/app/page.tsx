"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, BookOpen, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">


      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container max-w-4xl">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Willkommen zum Usability Test
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vielen Dank für Ihre Teilnahme an unserem Usability Test. Sie werden zwei verschiedene Versionen 
              unserer Reflexions-App testen. Bitte wählen Sie unten, mit welcher Version Sie beginnen möchten.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card rounded-lg p-6 border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Version A</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Einfaches Reflexionsdashboard mit simpleren darstellungen.
              </p>
              <Button className="w-full gap-2" asChild>
                <Link href="/simple/dashboard">
                  Version A starten <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="bg-card rounded-lg p-6 border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Version B</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Erweitertes Reflexionsdashboard mit vortgeschrittener Darstellungen.
              </p>
              <Button className="w-full gap-2" asChild>
                <Link href="/adaptive/dashboard">
                  Version B starten <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Bitte testen Sie beide Versionen und geben Sie uns anschliessend Ihr Feedback.
            </p>
          </div>
        </div>
      </main>

    </div>
  )
}
