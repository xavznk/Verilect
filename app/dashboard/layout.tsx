import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { RequireAuth } from "@/components/auth/require-auth"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <main className="container space-y-6 px-4 py-6">{children}</main>
      </div>
    </RequireAuth>
  )
}
