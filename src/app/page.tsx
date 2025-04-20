"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container max-w-4xl">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Willkommen zur Reflexions-App
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Diese App unterstützt Sie dabei, durch strukturierte Reflexion Ihr Lernen zu vertiefen 
              und neue Erkenntnisse zu gewinnen.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-card rounded-lg p-6 border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">KI-gestütztes Reflexionstool</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Nutzen Sie die fortschrittliche KI-Analyse, um tiefere Einsichten aus Ihren Reflexionen zu gewinnen.
              </p>
              <Button className="w-full gap-2" asChild>
                <Link href="/adaptive/dashboard">
                  Dashboard öffnen <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Erstellen Sie Reflexionen, erhalten Sie Echtzeit-Feedback und verbessern Sie Ihre Reflexionskompetenz.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}