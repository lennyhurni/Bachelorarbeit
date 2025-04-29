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
import { useSession } from "@/contexts/SessionContext"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  
  // Verwenden des SessionContext statt lokalem State
  const { user, session, loading } = useSession()
  
  // Get user's initial for avatar
  const getInitial = () => {
    if (user?.full_name && user.full_name.length > 0) {
      return user.full_name.charAt(0).toUpperCase()
    }
    if (user?.email && user.email.length > 0) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  // Display name preference: username > full_name > email
  const displayName = user?.username || user?.full_name || user?.email || ""

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
          {session ? (
            <>
              <div className="flex items-center">
                <Link href="/profile" className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {displayName}
                  </span>
                  <Avatar className="h-7 w-7 border border-gray-200 dark:border-gray-800">
                    <AvatarImage src={user?.avatar_url || ""} alt={displayName || "User"} />
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