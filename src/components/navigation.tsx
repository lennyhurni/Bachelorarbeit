"use client"

import { useEffect, useState } from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Brain, User } from "lucide-react"
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
              const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(userData.avatar_url)
              setUserAvatar(publicUrl)
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
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(userData.avatar_url)
            setUserAvatar(publicUrl)
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
    if (userEmail && userEmail.length > 0) {
      return userEmail.charAt(0).toUpperCase()
    }
    return 'U'
  }

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <NavigationMenu className="flex-1">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent")}> 
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span className="font-bold">Reflectify</span>
                  </div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="ml-auto flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link 
                href="/profile" 
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback>{getInitial()}</AvatarFallback>
                </Avatar>
                <span className="text-sm hidden md:inline">{userName || userEmail || "Profile"}</span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm px-3 py-2 rounded-md hover:bg-accent">Login</Link>
              <Link href="/register" className="text-sm px-3 py-2 rounded-md bg-primary text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 