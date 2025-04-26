import { cookies } from 'next/headers'

/**
 * A utility to safely get cookies in Next.js 15
 * Handles the case where cookies() is an async function
 */
export function getCookie(name: string): string | undefined {
  try {
    const cookieStore = cookies()
    // Try to access synchronously first (for backwards compatibility)
    try {
      return cookieStore.get(name)?.value
    } catch {
      // If synchronous access fails, return undefined
      // This avoids breaking the app if cookies() behavior changes
      return undefined
    }
  } catch (error) {
    console.error('Error getting cookie:', error)
    return undefined
  }
} 