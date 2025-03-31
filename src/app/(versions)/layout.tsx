"use client"

import { Sidebar } from "@/components/sidebar"
import { usePathname } from "next/navigation"

export default function VersionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Extract version from pathname
  let version = "simple"
  if (pathname.startsWith("/simple")) {
    version = "simple"
  } else if (pathname.startsWith("/adaptive")) {
    version = "adaptive"
  }

  return (
    <div className="flex h-full" style={{ height: '100%', overflow: 'hidden' }}>
      <Sidebar version={version as "simple" | "adaptive"} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}