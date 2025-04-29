import { createClientBrowser } from "./supabase/client"
import { UserSettings, defaultSettings } from "./user-settings"

// Flag, um zu verfolgen, ob gerade eine Profilerstellung läuft
let isCreatingProfile = false

/**
 * Hilfsfunktion, um eine kurze Verzögerung einzubauen
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Zentrale Funktion zum Erstellen oder Abrufen eines Benutzerprofils
 * Verwendet ein Lock-Mechanismus, um Race-Conditions zu vermeiden
 */
export async function ensureUserProfile(userId: string, userEmail: string | undefined, fullName: string | undefined = "") {
  // Frühzeitige Rückgabe, wenn keine Benutzer-ID vorhanden ist
  if (!userId) {
    console.log("Keine Benutzer-ID vorhanden, kann kein Profil erstellen/abrufen")
    return null
  }

  const supabase = createClientBrowser()

  try {
    // Zuerst prüfen, ob das Profil bereits existiert
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, settings')
      .eq('id', userId)
      .maybeSingle()

    // Wenn das Profil bereits existiert, keine weiteren Aktionen notwendig
    if (existingProfile) {
      console.log("Bestehendes Profil gefunden:", existingProfile.id)
      return existingProfile
    }

    // Wenn bereits ein Erstellungsprozess läuft, abbrechen
    if (isCreatingProfile) {
      console.log("Profilerstellung läuft bereits, überspringe Duplikaterstellung")
      return null
    }

    // Lock setzen
    isCreatingProfile = true

    // Sicherheitsüberprüfung - nochmals prüfen, ob das Profil inzwischen existiert
    const { data: doubleCheck, error: doubleCheckError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, settings')
      .eq('id', userId)
      .maybeSingle()

    if (doubleCheck) {
      console.log("Profil wurde in der Zwischenzeit erstellt, überspringe Erstellung")
      isCreatingProfile = false
      return doubleCheck
    }

    // Profil erstellen
    console.log("Erstelle neues Benutzerprofil für:", userId)
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: userEmail,
        full_name: fullName || '',
        settings: defaultSettings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      if (createError.code === '23505') {
        console.log("Profil existiert bereits (Duplikatfehler), ignoriere Fehler")
      } else {
        console.error("Fehler beim Erstellen des Profils:", JSON.stringify(createError, null, 2))
        return null
      }
    }

    // Kurze Verzögerung einbauen, um sicherzustellen, dass die Datenbank die Änderung verarbeitet hat
    await delay(300)

    // Prüfen, ob das Profil jetzt vorhanden ist
    const { data: verifiedProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, settings')
      .eq('id', userId)
      .maybeSingle()

    if (verifyError) {
      console.error("Fehler beim Verifizieren des erstellten Profils:", JSON.stringify(verifyError, null, 2))
    } else if (!verifiedProfile) {
      console.warn("Profil wurde angelegt, kann aber noch nicht abgerufen werden (Timing-Problem)")
    } else {
      console.log("Profil erfolgreich erstellt und verifiziert:", verifiedProfile.id)
    }

    return newProfile || verifiedProfile
  } catch (error) {
    console.error("Unerwarteter Fehler beim Erstellen/Abrufen des Profils:", JSON.stringify(error, null, 2))
    return null
  } finally {
    // Lock zurücksetzen
    isCreatingProfile = false
  }
}

/**
 * Prüft, ob ein Benutzerprofil existiert
 */
export async function checkUserProfileExists(userId: string) {
  if (!userId) return false
  
  const supabase = createClientBrowser()
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()
      
    return !!data
  } catch (error) {
    console.error("Fehler beim Prüfen des Profils:", JSON.stringify(error, null, 2))
    return false
  }
} 