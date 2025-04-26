import { cookies as nextCookies } from 'next/headers'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

/**
 * Creates an async cookie store that works with Next.js 15
 * Handles the case where cookies() returns a Promise
 */
export async function createCookieStore() {
  const cookieStore = await nextCookies()
  
  return {
    get(name: string) {
      return cookieStore.get(name)
    },
    getAll() {
      return cookieStore.getAll()
    },
    set(name: string, value: string, options?: Partial<ResponseCookie>) {
      cookieStore.set(name, value, options)
    },
    delete(name: string, options?: Partial<ResponseCookie>) {
      cookieStore.delete({ name, ...options })
    }
  }
}

/**
 * A utility to safely get cookies in Next.js 15
 * Now uses the async cookie store
 */
export async function getCookie(name: string): Promise<string | undefined> {
  try {
    const cookieStore = await createCookieStore()
    return cookieStore.get(name)?.value
  } catch (error) {
    console.error('Error getting cookie:', error)
    return undefined
  }
} 