"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Brain,
  PlusCircle, 
  Search,
  ChevronRight,
  Calendar,
  Clock,
  ListFilter
} from "lucide-react"

export default function ReflectionsPage() {
  const pathname = usePathname()
  let version = "adaptive"
  
  const reflections = [
    { 
      id: 1, 
      title: "JavaScript Fortgeschrittene Konzepte", 
      date: "18. März 2024",
      duration: "20 Minuten",
      score: 83,
      kpis: {
        depth: 85,
        coherence: 70,
        metacognition: 90,
        actionable: 65
      } 
    },
    { 
      id: 2, 
      title: "Projektmanagement-Methoden", 
      date: "12. März 2024",
      duration: "15 Minuten",
      score: 77,
      kpis: {
        depth: 75,
        coherence: 80,
        metacognition: 65,
        actionable: 90
      } 
    },
    { 
      id: 3, 
      title: "Effektive Teamkommunikation", 
      date: "7. März 2024",
      duration: "25 Minuten",
      score: 90,
      kpis: {
        depth: 95,
        coherence: 85,
        metacognition: 88,
        actionable: 92
      } 
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">KI-Reflexionen</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Reflexion suchen..." 
              className="pl-9 w-full md:w-[250px]"
            />
          </div>
          <Link href={`/${version}/reflections/new`}>
            <Button className="gap-2 whitespace-nowrap w-full sm:w-auto">
              <PlusCircle className="h-4 w-4" />
              Neue KI-Reflexion
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-4">
        <div className="bg-muted/40 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ListFilter className="h-4 w-4" />
            <span>Gesamt: {reflections.length} Reflexionen</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent/50">Neueste</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent/50">Älteste</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent/50">Beste KPIs</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent/50">Längste</Badge>
          </div>
        </div>
        
        {reflections.map(reflection => (
          <Link href={`/${version}/reflections/${reflection.id}`} key={reflection.id}>
            <Card className="hover:border-primary/40 hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{reflection.title}</CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    KPI-Score: {reflection.score}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between gap-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{reflection.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{reflection.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="font-medium">Details ansehen</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Tiefe</span>
                      <span className="font-medium">{reflection.kpis.depth}%</span>
                    </div>
                    <div className="h-1 bg-blue-100 rounded-full">
                      <div 
                        className="h-1 bg-blue-500 rounded-full" 
                        style={{ width: `${reflection.kpis.depth}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Kohärenz</span>
                      <span className="font-medium">{reflection.kpis.coherence}%</span>
                    </div>
                    <div className="h-1 bg-green-100 rounded-full">
                      <div 
                        className="h-1 bg-green-500 rounded-full" 
                        style={{ width: `${reflection.kpis.coherence}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Meta</span>
                      <span className="font-medium">{reflection.kpis.metacognition}%</span>
                    </div>
                    <div className="h-1 bg-purple-100 rounded-full">
                      <div 
                        className="h-1 bg-purple-500 rounded-full" 
                        style={{ width: `${reflection.kpis.metacognition}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Handlung</span>
                      <span className="font-medium">{reflection.kpis.actionable}%</span>
                    </div>
                    <div className="h-1 bg-orange-100 rounded-full">
                      <div 
                        className="h-1 bg-orange-500 rounded-full" 
                        style={{ width: `${reflection.kpis.actionable}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 