"use client"

import { ReactNode } from "react"
import { Info, Lock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface TransparencyInfoProps {
  title?: string
  description: string
  details?: string
  icon?: "info" | "lock" | "alert"
  variant?: "default" | "muted" | "primary"
  className?: string
}

export function TransparencyInfo({
  title,
  description,
  details,
  icon = "info",
  variant = "default",
  className,
}: TransparencyInfoProps) {
  // Determine the icon
  const IconComponent = 
    icon === "lock" ? Lock :
    icon === "alert" ? AlertCircle : 
    Info

  // Determine the styling based on variant
  const containerStyles = cn(
    "text-xs rounded-md p-3 border",
    variant === "muted" && "bg-muted/60 border-border/50 text-muted-foreground",
    variant === "primary" && "bg-primary/10 border-primary/20 text-primary-foreground",
    variant === "default" && "bg-background border-border",
    className
  )

  return (
    <div className={containerStyles}>
      <div className="flex items-center gap-2 mb-1">
        <IconComponent className="h-3.5 w-3.5" />
        <span className="font-medium">{title || "Transparenzinformation"}</span>
        {variant === "primary" && (
          <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4 bg-primary/10 text-primary-foreground border-primary/20">
            KI-System
          </Badge>
        )}
      </div>
      <p className="mb-2">{description}</p>
      {details && (
        <div className="mt-1 pt-1 border-t border-border/30 text-xs opacity-80">
          {details}
        </div>
      )}
    </div>
  )
}

export function TransparencyInfoGroup({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  )
} 