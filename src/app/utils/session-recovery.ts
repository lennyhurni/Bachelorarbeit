import { createClient } from "@/utils/supabase/client"

/**
 * Attempts to perform a full session recovery
 * 
 * This function:
 * 1. Signs out the current session
 * 2. Clears potentially corrupted cookies
 * 3. Returns a boolean indicating success/failure
 */
export async function resetSession(): Promise<boolean> {
  try {
    console.log("Attempting session recovery...")
    const supabase = createClient()
    
    // 1. Sign out to clear Supabase session
    await supabase.auth.signOut()
    
    // 2. Manually clear problematic cookies
    clearAuthCookies()
    
    console.log("Session reset successful")
    return true
  } catch (error) {
    console.error("Session reset failed:", error)
    return false
  }
}

/**
 * Clear all authentication-related cookies
 */
function clearAuthCookies() {
  try {
    // Clear all common Supabase and auth-related cookies
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token',
      '__session',
      'sb-provider-token',
      'sb-auth-token'
    ]
    
    cookiesToClear.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
    })
    
    console.log("Auth cookies cleared")
  } catch (e) {
    console.error("Error clearing cookies:", e)
  }
} 