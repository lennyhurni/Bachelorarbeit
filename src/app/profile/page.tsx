"use client"

export const dynamic = 'force-dynamic'

import ProfileClient from "./profile-client"
import RequireAuth from "@/components/RequireAuth"

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileClient />
    </RequireAuth>
  )
} 