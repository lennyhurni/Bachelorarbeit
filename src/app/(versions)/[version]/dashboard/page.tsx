"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardRedirect() {
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    // Redirect to the adaptive version
    router.replace("/adaptive/dashboard")
  }, [router])
  
  return null
} 