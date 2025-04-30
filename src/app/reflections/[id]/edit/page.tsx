"use client"

import { useEffect, useState, FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Save, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import RequireAuth from "@/components/RequireAuth"

interface Reflection {
  id: string
  title: string
  content: string
  created_at: string
  category: string
  is_public: boolean
}

export default function EditReflectionPage() {
  const [reflection, setReflection] = useState<Reflection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("Allgemein")
  const [isPublic, setIsPublic] = useState(false)
  
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  // Load reflection using API
  const fetchReflection = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/reflections/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Diese Reflexion wurde nicht gefunden.')
        } else if (response.status === 401) {
          router.push('/login')
          return
        } else {
          setError('Fehler beim Laden der Reflexion.')
        }
        return
      }
      
      const data = await response.json()
      setReflection(data)
      
      // Initialize form state
      setTitle(data.title)
      setContent(data.content)
      setCategory(data.category || "Allgemein")
      setIsPublic(data.is_public || false)
      
    } catch (error) {
      console.error('Error loading reflection:', error)
      setError('Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }
  
  // Save updated reflection
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Titel ein",
        variant: "destructive"
      })
      return
    }
    
    if (!content.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Inhalt ein",
        variant: "destructive"
      })
      return
    }
    
    try {
      setSubmitting(true)
      
      const response = await fetch(`/api/reflections/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category,
          is_public: isPublic
        }),
      })
      
      if (!response.ok) {
        throw new Error('Fehler beim Speichern der Reflexion')
      }
      
      const data = await response.json()
      
      toast({
        title: "Gespeichert",
        description: "Deine Reflexion wurde erfolgreich aktualisiert."
      })
      
      // Navigate to the reflection detail page
      router.push(`/reflections/${params.id}`)
      
    } catch (error) {
      console.error('Error updating reflection:', error)
      toast({
        title: "Fehler",
        description: "Die Reflexion konnte nicht gespeichert werden.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  useEffect(() => {
    if (params.id) {
      fetchReflection()
    }
  }, [params.id])
  
  if (loading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }
  
  if (error || !reflection) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Fehler
            </CardTitle>
            <CardDescription>
              {error || 'Die Reflexion konnte nicht gefunden werden.'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/reflections">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zu allen Reflexionen
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  return (
    <RequireAuth>
      <div className="container py-8 max-w-4xl mx-auto overflow-y-auto h-[calc(100vh-4rem)]">
        <Button variant="ghost" asChild className="mb-8 -ml-4 hover:bg-accent/50">
          <Link href={`/reflections/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zur Reflexion
          </Link>
        </Button>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Reflexion bearbeiten</CardTitle>
              <CardDescription>
                Bearbeite deine Reflexion und speichere die Änderungen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Gib einen aussagekräftigen Titel ein" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Inhalt</Label>
                <Textarea 
                  id="content" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Beschreibe deine Erfahrungen und Erkenntnisse..."
                  className="min-h-[300px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorie</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Allgemein">Allgemein</SelectItem>
                      <SelectItem value="Beruf">Beruf</SelectItem>
                      <SelectItem value="Ausbildung">Ausbildung</SelectItem>
                      <SelectItem value="Persönlich">Persönlich</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="isPublic" className="cursor-pointer">Öffentlich</Label>
                  <Switch
                    id="isPublic"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/reflections/${params.id}`}>Abbrechen</Link>
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Änderungen speichern
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </RequireAuth>
  )
} 