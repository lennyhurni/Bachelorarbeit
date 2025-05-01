"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, Check, RefreshCw } from "lucide-react";

export default function ProcessReflections() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reflections, setReflections] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [failed, setFailed] = useState(0);
  const [processingPrompts, setProcessingPrompts] = useState(false);
  const [promptsGenerated, setPromptsGenerated] = useState(0);

  useEffect(() => {
    const checkAdminAndLoadReflections = async () => {
      setLoading(true);
      try {
        // Get user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/login?redirectTo=/admin/process-reflections");
          return;
        }

        // Check if user is an admin (you may need to implement this logic based on your app)
        const { data: userSettings } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        // This is a simple check - implement proper admin validation as needed
        const adminEmails = ["admin@example.com", "your-admin-email@domain.com"];
        const isUserAdmin = adminEmails.includes(user.email?.toLowerCase() || "") || userSettings?.is_admin === true;
        
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          toast({
            title: "Zugriff verweigert",
            description: "Du hast keine Berechtigung, auf diese Seite zuzugreifen.",
            variant: "destructive",
          });
          router.push("/dashboard");
          return;
        }

        // Get all reflections that need processing
        const { data: unprocessedReflections } = await supabase
          .from("reflections")
          .select("*")
          .is("analyzed_at", null)
          .order("created_at", { ascending: false });
        
        const { data: allReflections } = await supabase
          .from("reflections")
          .select("id, title, created_at, analyzed_at")
          .order("created_at", { ascending: false });

        setReflections(allReflections || []);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Fehler",
          description: "Beim Laden der Seite ist ein Fehler aufgetreten.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadReflections();
  }, [supabase, router]);

  const processAllReflections = async () => {
    setProcessing(true);
    setCurrentIndex(0);
    setCompleted(0);
    setFailed(0);

    try {
      // Only process reflections that don't have analysis yet
      const { data: unprocessedReflections } = await supabase
        .from("reflections")
        .select("*")
        .is("analyzed_at", null)
        .order("created_at", { ascending: true });

      if (!unprocessedReflections || unprocessedReflections.length === 0) {
        toast({
          title: "Information",
          description: "Es gibt keine unverarbeiteten Reflexionen.",
        });
        setProcessing(false);
        return;
      }

      // Process each reflection sequentially
      for (let i = 0; i < unprocessedReflections.length; i++) {
        setCurrentIndex(i + 1);
        const reflection = unprocessedReflections[i];

        try {
          // Call the analyze endpoint
          const response = await fetch("/api/reflections/analyze", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reflectionId: reflection.id,
              content: reflection.content,
              title: reflection.title,
              category: reflection.category
            }),
          });

          if (response.ok) {
            setCompleted(prev => prev + 1);
          } else {
            setFailed(prev => prev + 1);
            console.error(`Error processing reflection ${reflection.id}:`, await response.text());
          }

          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          setFailed(prev => prev + 1);
          console.error(`Error processing reflection ${reflection.id}:`, error);
        }
      }

      // Refresh the reflections list
      const { data: updatedReflections } = await supabase
        .from("reflections")
        .select("id, title, created_at, analyzed_at")
        .order("created_at", { ascending: false });

      setReflections(updatedReflections || []);

      toast({
        title: "Verarbeitung abgeschlossen",
        description: `${completed} Reflexionen erfolgreich verarbeitet, ${failed} fehlgeschlagen.`,
      });
    } catch (error) {
      console.error("Error in batch processing:", error);
      toast({
        title: "Fehler",
        description: "Bei der Verarbeitung der Reflexionen ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const generatePromptsForAllUsers = async () => {
    setProcessingPrompts(true);
    setPromptsGenerated(0);
    
    try {
      // Get all users
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id");
      
      if (!profiles || profiles.length === 0) {
        toast({
          title: "Information",
          description: "Es wurden keine Benutzer gefunden.",
        });
        setProcessingPrompts(false);
        return;
      }
      
      // For each user, generate a prompt if they have reflections
      for (const profile of profiles) {
        try {
          // Check if user has reflections
          const { count } = await supabase
            .from("reflections")
            .select("id", { count: 'exact', head: true })
            .eq("user_id", profile.id);
          
          if (count && count > 0) {
            // Generate a prompt by calling the API with the user's session
            const response = await fetch("/api/reflections/generate-prompt", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Admin-Override": "true", // Custom header to indicate admin action - implement handling on server
                "X-Target-User": profile.id, // Custom header to specify target user - implement handling on server
              },
            });
            
            if (response.ok) {
              setPromptsGenerated(prev => prev + 1);
            }
            
            // Add a delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.error(`Error generating prompt for user ${profile.id}:`, error);
        }
      }
      
      toast({
        title: "Prompt-Generierung abgeschlossen",
        description: `${promptsGenerated} Prompts für Benutzer generiert.`,
      });
    } catch (error) {
      console.error("Error generating prompts:", error);
      toast({
        title: "Fehler",
        description: "Bei der Generierung der Prompts ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setProcessingPrompts(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 space-y-8">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-60" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Zugriff verweigert</AlertTitle>
          <AlertDescription>
            Du hast keine Berechtigung, auf diese Seite zuzugreifen.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reflexionen verarbeiten</h1>
        <p className="text-muted-foreground mt-2">
          Hier kannst du alle unverarbeiteten Reflexionen in einem Batch-Prozess analysieren lassen.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reflexionsanalyse</CardTitle>
          <CardDescription>
            Verarbeite alle Reflexionen, die noch keine KI-Analyse haben.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Gesamtzahl der Reflexionen: {reflections.length}</span>
              <span>Analysiert: {reflections.filter(r => r.analyzed_at).length}</span>
              <span>Nicht analysiert: {reflections.filter(r => !r.analyzed_at).length}</span>
            </div>

            {processing && (
              <div className="space-y-2">
                <Progress value={(currentIndex / reflections.filter(r => !r.analyzed_at).length) * 100} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Fortschritt: {currentIndex} / {reflections.filter(r => !r.analyzed_at).length}</span>
                  <span>Erfolgreich: {completed}</span>
                  <span>Fehlgeschlagen: {failed}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={processAllReflections} 
            disabled={processing || reflections.filter(r => !r.analyzed_at).length === 0}
            className="w-full"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reflexionen werden verarbeitet...
              </>
            ) : reflections.filter(r => !r.analyzed_at).length === 0 ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Alle Reflexionen analysiert
              </>
            ) : (
              "Alle Reflexionen analysieren"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reflexionsimpulse generieren</CardTitle>
          <CardDescription>
            Generiere für alle Benutzer personalisierte Reflexionsimpulse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Diese Funktion generiert für jeden Benutzer mit Reflexionen einen neuen, personalisierten Reflexionsimpuls.
            </p>
            {processingPrompts && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generiere Impulse... ({promptsGenerated} bisher)</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={generatePromptsForAllUsers} 
            disabled={processingPrompts}
            className="w-full"
            variant="outline"
          >
            {processingPrompts ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Impulse werden generiert...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Neue Impulse für alle Benutzer generieren
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Reflexionsstatus</h2>
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Titel
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Erstellt am
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {reflections.slice(0, 20).map((reflection) => (
                <tr key={reflection.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{reflection.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{reflection.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(reflection.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reflection.analyzed_at ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Analysiert
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Nicht analysiert
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reflections.length > 20 && (
            <div className="px-6 py-3 bg-muted text-sm text-muted-foreground">
              Zeige 20 von {reflections.length} Reflexionen
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 