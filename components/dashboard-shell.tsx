import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return <main className="container space-y-6 px-4 py-6">{children}</main>
}
