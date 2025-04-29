"use client"

import { useEffect, useState } from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Brain } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import LogoutButton from "./LogoutButton"
import { createClientBrowser } from "@/utils/supabase/client"
import { Session } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userAvatar, setUserAvatar] = useState("")
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClientBrowser()

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          // Check if session is expired
          if (session.expires_at && session.expires_at * 1000 < Date.now()) {
            console.log('Navigation: Session expired, logging out')
            await supabase.auth.signOut()
            setIsLoggedIn(false)
            setUserEmail("")
            router.push('/login')
            return
          }
          
          setIsLoggedIn(true)
          if (session.user.email) {
            setUserEmail(session.user.email)
          }

          // Fetch user profile including avatar
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('avatar_url, username, full_name')
            .eq('id', session.user.id)
            .single()

          if (!userError && userData) {
            setUserName(userData.username || userData.full_name || "")
            if (userData.avatar_url) {
              // Use the avatar_url directly as it should now contain the full public URL
              setUserAvatar(userData.avatar_url)
            }
          }
        } else {
          setIsLoggedIn(false)
          setUserEmail("")
          setUserAvatar("")
          setUserName("")
        }
      } catch (error) {
        console.error('Error checking auth state:', error)
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
    
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        // Check if the new session is expired
        if (session.expires_at && session.expires_at * 1000 < Date.now()) {
          console.log('Navigation: New session is expired, logging out')
          await supabase.auth.signOut()
          setIsLoggedIn(false)
          setUserEmail("")
          setUserAvatar("")
          setUserName("")
          router.push('/login')
          return
        }
        
        setIsLoggedIn(true)
        if (session.user.email) {
          setUserEmail(session.user.email)
        }

        // Fetch user profile including avatar on sign in
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('avatar_url, username, full_name')
          .eq('id', session.user.id)
          .single()

        if (!userError && userData) {
          setUserName(userData.username || userData.full_name || "")
          if (userData.avatar_url) {
            // Use the avatar_url directly as it should now contain the full public URL
            setUserAvatar(userData.avatar_url)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false)
        setUserEmail("")
        setUserAvatar("")
        setUserName("")
      }
    })
    
    return () => subscription.subscription.unsubscribe()
  }, [router, supabase])

  // Get user's initial for avatar
  const getInitial = () => {
    if (userName && userName.length > 0) {
      return userName.charAt(0).toUpperCase()
    }
    if (userEmail && userEmail.length > 0) {
      return userEmail.charAt(0).toUpperCase()
    }
    return 'U'
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm text-gray-900 dark:text-white">Reflectify</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="flex items-center">
                <Link href="/profile" className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userName || userEmail}
                  </span>
                  <Avatar className="h-7 w-7 border border-gray-200 dark:border-gray-800">
                    <AvatarImage src={userAvatar} alt={userName || userEmail || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary-foreground">
                      {getInitial()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary/90 dark:text-gray-900"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 