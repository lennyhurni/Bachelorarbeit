import { useState, useEffect } from "react"
import { createClientBrowser } from "@/utils/supabase/client"
import { UserSettings, defaultSettings, updateUserSetting, updateUserSettings } from "@/utils/user-settings"
import { useToast } from "@/components/ui/use-toast"
import { ensureUserProfile } from "@/utils/profile-manager"

export function useUserSettings() {
  const [userId, setUserId] = useState<string | null>(null)
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const supabase = createClientBrowser()
  const { toast } = useToast()

  // Helper function to retry loading profile with a delay
  const retryWithDelay = async (session: any, retries: number = 3, delay: number = 500) => {
    if (retries <= 0) return null;
    
    try {
      // Verwende die zentrale Profilverwaltung
      await ensureUserProfile(
        session.user.id, 
        session.user.email, 
        session.user.user_metadata?.full_name
      )
      
      // Get user profile with settings
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', session.user.id)
        .single()
      
      if (userError) {
        if (userError.code === 'PGRST116') {
          console.log(`Retry ${retryCount}: Profil noch nicht verfügbar, warte ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          setRetryCount(prev => prev + 1)
          return retryWithDelay(session, retries - 1, delay * 1.5)
        } else {
          console.error('Error fetching user settings:', JSON.stringify(userError, null, 2))
          return null
        }
      }
      
      return userData
    } catch (error) {
      console.error('Error retrying profile load:', JSON.stringify(error, null, 2))
      return null
    }
  }

  // Load user settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true)
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          console.log('No user session found')
          setLoading(false)
          return
        }
        
        setUserId(session.user.id)
        
        // Verwende die zentrale Profilverwaltung
        await ensureUserProfile(
          session.user.id, 
          session.user.email, 
          session.user.user_metadata?.full_name
        )
        
        // Get user profile with settings
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('settings')
          .eq('id', session.user.id)
          .single()
        
        if (userError) {
          console.error('Error fetching user settings:', JSON.stringify(userError, null, 2))
          
          // If no data was found, retry with delay
          if (userError.code === 'PGRST116' && retryCount < 3) {
            console.log('No profile data returned (PGRST116), attempting retry...')
            const retryData = await retryWithDelay(session, 3)
            if (retryData?.settings) {
              setSettings(retryData.settings)
            } else {
              console.log('Retries exhausted or still no data, using default settings')
            }
          }
        } else if (userData?.settings) {
          setSettings(userData.settings)
        }
      } catch (error) {
        console.error('Error loading user settings:', JSON.stringify(error, null, 2))
      } finally {
        setLoading(false)
      }
    }
    
    loadSettings()
  }, [supabase, toast, retryCount])

  // Function to update a single setting
  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ): Promise<boolean> => {
    if (!userId) return false
    
    try {
      // Update local state immediately for responsive UI
      setSettings(prev => ({ ...prev, [key]: value }))
      
      // Update in database
      const success = await updateUserSetting(userId, key, value)
      
      if (success) {
        toast({
          title: "Einstellung gespeichert",
          description: "Deine Einstellung wurde aktualisiert.",
          duration: 3000
        })
        return true
      } else {
        // Revert local state on error
        setSettings(prev => ({ ...prev, [key]: settings[key] }))
        
        toast({
          title: "Fehler",
          description: "Die Einstellung konnte nicht gespeichert werden.",
          variant: "destructive"
        })
        return false
      }
    } catch (error) {
      console.error('Error updating setting:', error)
      return false
    }
  }

  // Function to save all settings at once
  const saveSettings = async (): Promise<boolean> => {
    if (!userId) return false
    
    try {
      // Update all settings in database
      const success = await updateUserSettings(userId, settings)
      
      if (success) {
        toast({
          title: "Einstellungen gespeichert",
          description: "Deine Einstellungen wurden aktualisiert.",
          duration: 3000
        })
        return true
      } else {
        toast({
          title: "Fehler",
          description: "Die Einstellungen konnten nicht gespeichert werden.",
          variant: "destructive"
        })
        return false
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      return false
    }
  }

  // Function to reset settings to defaults
  const resetSettings = async (): Promise<boolean> => {
    if (!userId) return false
    
    try {
      // Set local state to defaults
      setSettings(defaultSettings)
      
      // Update in database
      const success = await updateUserSettings(userId, defaultSettings)
      
      if (success) {
        toast({
          title: "Einstellungen zurückgesetzt",
          description: "Deine Einstellungen wurden auf die Standardwerte zurückgesetzt.",
          duration: 3000
        })
        return true
      } else {
        toast({
          title: "Fehler",
          description: "Die Einstellungen konnten nicht zurückgesetzt werden.",
          variant: "destructive"
        })
        return false
      }
    } catch (error) {
      console.error('Error resetting settings:', error)
      return false
    }
  }

  return {
    settings,
    loading,
    userId,
    updateSetting,
    saveSettings,
    resetSettings
  }
} 