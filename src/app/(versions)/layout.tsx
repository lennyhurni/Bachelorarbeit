"use client"

import { Sidebar } from "@/components/sidebar"

export default function VersionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full" style={{ height: '100%', overflow: 'hidden' }}>
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}