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

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClientBrowser()
    
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
        } else {
          setIsLoggedIn(false)
          setUserEmail("")
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
          router.push('/login')
          return
        }
        
        setIsLoggedIn(true)
        if (session.user.email) {
          setUserEmail(session.user.email)
        }
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false)
        setUserEmail("")
      }
    })
    
    return () => subscription.subscription.unsubscribe()
  }, [router])

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
            {isLoggedIn && (
              <>
                <NavigationMenuItem>
                  <Link href="/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent", 
                      pathname === '/dashboard' && "bg-accent"
                    )}>
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/reflections" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent", 
                      pathname.startsWith('/reflections') && "bg-accent"
                    )}>
                      Reflections
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        
        {/* Right aligned auth */}
        <div className="ml-auto flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link 
                href="/profile" 
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {getInitial()}
                </div>
                <span className="text-sm hidden md:inline">{userEmail || "Profile"}</span>
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