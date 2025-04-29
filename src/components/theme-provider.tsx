"use client"

import * as React from "react"
import { ThemeProvider as CustomThemeProvider } from "@/contexts/ThemeContext"

interface ThemeProviderProps {
  children: React.ReactNode
  [key: string]: any
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Die alte ThemeProvider-Implementierung wird durch unsere neue ersetzt
  // Die alten props werden ignoriert, aber akzeptiert für Abwärtskompatibilität
  return (
    <CustomThemeProvider>
      {children}
    </CustomThemeProvider>
  )
} 