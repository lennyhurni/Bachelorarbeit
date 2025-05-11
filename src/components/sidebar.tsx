"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Home,
  Settings,
  UserCircle,
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Brain,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  version: "simple" | "adaptive"
}

export function Sidebar({ version }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isAdaptive = version === "adaptive"

  const routes = [
    {
      title: "Dashboard",
      href: `/${version}/dashboard`,
      icon: Home
    },
    {
      title: "Reflexionen",
      href: `/${version}/reflections`,
      icon: FileText
    },
    {
      title: "Profil",
      href: `/${version}/profile`,
      icon: UserCircle
    },
    {
      title: "Einstellungen",
      href: `/${version}/settings`,
      icon: Settings
    },
    {
      title: "Hilfe",
      href: `/${version}/help`,
      icon: HelpCircle
    }
  ]

  return (
    <div
      className={cn(
        "bg-background border-r transition-all duration-300 relative h-full",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn(
        "flex flex-col gap-4 p-4 transition-all duration-300 h-full",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="flex items-center justify-between">
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            collapsed ? "opacity-0 w-0" : "opacity-100"
          )}>
            {isAdaptive ? (
              <Brain className="h-6 w-6 text-primary" />
            ) : (
              <BookOpen className="h-6 w-6 text-primary" />
            )}
            <span className="text-lg font-semibold">
              {isAdaptive ? "Prototyp B" : "Prototyp A"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "h-9 w-9 rounded-full transition-transform",
              collapsed && "rotate-180"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                pathname === route.href && "bg-primary/10 text-primary",
                collapsed ? "justify-center" : ""
              )}
            >
              <div className={cn(
                "transition-all duration-300",
                collapsed ? "h-8 w-8" : "h-5 w-5"
              )}>
                <route.icon className={cn(
                  "transition-all duration-300",
                  collapsed ? "h-8 w-8" : "h-5 w-5"
                )} />
              </div>
              <span className={cn(
                "transition-all duration-300",
                collapsed ? "hidden" : "block"
              )}>
                {route.title}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
} 
