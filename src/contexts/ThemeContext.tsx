"use client"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useSession } from "./SessionContext"
import { updateUserSetting } from "@/utils/user-settings"

type ThemeType = "light" | "dark" | "system"

interface ThemeContextType {
  theme: ThemeType
  changeTheme: (theme: ThemeType) => void
  initialized: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  changeTheme: () => {},
  initialized: false
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("dark") // Default ist dark
  const [initialized, setInitialized] = useState(false)
  const { user, loading } = useSession()
  const updatePending = useRef(false);

  // 1. Beim ersten Laden - Verwende localStorage als initialen Wert
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark"
    setTheme(storedTheme as ThemeType)
  }, [])

  // 2. Sobald Benutzer geladen ist, synchronisiere mit Benutzereinstellungen
  useEffect(() => {
    if (!loading && user?.settings?.theme && !updatePending.current) {
      // Nur setzen, wenn sich der Wert unterscheidet (vermeidet Flackern)
      if (user.settings.theme !== theme) {
        setTheme(user.settings.theme as ThemeType)
        localStorage.setItem("theme", user.settings.theme)
      }
      setInitialized(true)
    }
  }, [user, loading]); // Removed theme from dependency to prevent loops

  const changeTheme = (newTheme: ThemeType) => {
    if (newTheme === theme) return; // Skip if theme is the same
    
    updatePending.current = true; // Mark update as in progress to prevent loops
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Benutzereinstellung aktualisieren, wenn ein Benutzer angemeldet ist
    if (user?.id) {
      updateUserSetting(user.id, 'theme', newTheme)
        .catch(error => console.error("Fehler beim Speichern des Themes:", JSON.stringify(error, null, 2)))
        .finally(() => {
          // Reset the update flag after a short delay to ensure pending state changes complete
          setTimeout(() => {
            updatePending.current = false;
          }, 100);
        });
    } else {
      // If no user, just clear the flag after a short delay
      setTimeout(() => {
        updatePending.current = false;
      }, 100);
    }
  }

  // Theme auf das HTML-Element anwenden
  useEffect(() => {
    if (!theme) return;
    
    document.documentElement.classList.remove("light", "dark", "system")
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, initialized }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext) 