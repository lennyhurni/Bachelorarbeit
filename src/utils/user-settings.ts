import { createClientBrowser } from "./supabase/client"

export interface UserSettings {
  feedbackDepth: string
  theme: string
  language: string
  notifications: boolean
  aiSuggestions: boolean
}

export const defaultSettings: UserSettings = {
  feedbackDepth: "standard",
  theme: "system",
  language: "de",
  notifications: true,
  aiSuggestions: true
}

/**
 * Updates a specific user setting in Supabase
 * @param userId User ID
 * @param key Setting key to update
 * @param value New setting value
 * @returns Promise resolving to success boolean
 */
export async function updateUserSetting<K extends keyof UserSettings>(
  userId: string,
  key: K,
  value: UserSettings[K]
): Promise<boolean> {
  const supabase = createClientBrowser()
  
  try {
    // First get current settings
    const { data: userData, error: fetchError } = await supabase
      .from('profiles')
      .select('settings')
      .eq('id', userId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching user settings:', fetchError)
      return false
    }
    
    // Create new settings object
    const currentSettings = userData?.settings || defaultSettings
    const newSettings = {
      ...currentSettings,
      [key]: value
    }
    
    // Update settings in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ settings: newSettings })
      .eq('id', userId)
    
    if (updateError) {
      console.error('Error updating user settings:', updateError)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Unexpected error updating user setting:', error)
    return false
  }
}

/**
 * Updates multiple user settings at once
 * @param userId User ID
 * @param settings Partial settings object
 * @returns Promise resolving to success boolean
 */
export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>
): Promise<boolean> {
  const supabase = createClientBrowser()
  
  try {
    // First get current settings
    const { data: userData, error: fetchError } = await supabase
      .from('profiles')
      .select('settings')
      .eq('id', userId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching user settings:', fetchError)
      return false
    }
    
    // Create new settings object
    const currentSettings = userData?.settings || defaultSettings
    const newSettings = {
      ...currentSettings,
      ...settings
    }
    
    // Update settings in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ settings: newSettings })
      .eq('id', userId)
    
    if (updateError) {
      console.error('Error updating user settings:', updateError)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Unexpected error updating user settings:', error)
    return false
  }
}

/**
 * Fetches user settings 
 * @param userId User ID
 * @returns Promise resolving to user settings
 */
export async function getUserSettings(userId: string): Promise<UserSettings> {
  const supabase = createClientBrowser()
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('settings')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user settings:', error)
      return defaultSettings
    }
    
    return data?.settings || defaultSettings
  } catch (error) {
    console.error('Unexpected error fetching user settings:', error)
    return defaultSettings
  }
} 