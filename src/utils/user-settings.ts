import { createClient } from "./supabase/client"

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
  const supabase = createClient()
  
  try {
    // First get current settings
    const { data: userData, error: fetchError } = await supabase
      .from('profiles')
      .select('settings')
      .eq('id', userId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching user settings:', JSON.stringify(fetchError, null, 2))
      
      // If no profile exists yet, create one with default settings
      if (fetchError.code === 'PGRST116') {
        const newSettings = {
          ...defaultSettings,
          [key]: value
        }
        
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            settings: newSettings,
            updated_at: new Date().toISOString()
          })
        
        if (createError) {
          console.error('Error creating profile with settings:', JSON.stringify(createError, null, 2))
          return false
        }
        
        return true
      }
      
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
      console.error('Error updating user settings:', JSON.stringify(updateError, null, 2))
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
  const supabase = createClient()
  
  try {
    // First get current settings
    const { data: userData, error: fetchError } = await supabase
      .from('profiles')
      .select('settings')
      .eq('id', userId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching user settings:', JSON.stringify(fetchError, null, 2))
      
      // If no profile exists, create one with the provided settings
      if (fetchError.code === 'PGRST116') {
        const newSettings = {
          ...defaultSettings,
          ...settings
        }
        
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            settings: newSettings,
            updated_at: new Date().toISOString()
          })
        
        if (createError) {
          console.error('Error creating profile with settings:', JSON.stringify(createError, null, 2))
          return false
        }
        
        return true
      }
      
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
      console.error('Error updating user settings:', JSON.stringify(updateError, null, 2))
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
  const supabase = createClient()
  
  try {
    // First check if the profile exists
    const { data: profileExists, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()
      
    // If no profile exists, create one with default settings
    if (!profileExists) {
      try {
        // Attempt to create a profile with default settings
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            settings: defaultSettings,
            updated_at: new Date().toISOString()
          })
          
        if (createError) {
          if (createError.code === '23505') {
            // Duplicate key error - someone else created the profile
            console.log('Profile was created in parallel, continuing with defaults')
          } else {
            console.error('Error creating profile for settings in getUserSettings:', 
              JSON.stringify(createError, null, 2))
          }
        } else {
          // Successfully created profile with default settings
          return defaultSettings
        }
      } catch (err) {
        console.error('Unexpected error creating profile in getUserSettings:', err)
      }
    }
    
    // Try to get the settings
    const { data, error } = await supabase
      .from('profiles')
      .select('settings')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user settings in getUserSettings:', 
        JSON.stringify(error, null, 2))
      return defaultSettings
    }
    
    return data?.settings || defaultSettings
  } catch (error) {
    console.error('Unexpected error fetching user settings:', error)
    return defaultSettings
  }
} 