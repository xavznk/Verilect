"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, Settings, User, Vote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "./auth/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { getInitials } from "@/lib/utils"

export function DashboardHeader() {
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Vote className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">Verilect</span>
          </Link>
        </div>

        <nav className="hidden md:flex">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                href="/dashboard"
                className={`text-sm font-medium ${pathname === "/dashboard" ? "text-emerald-500" : "hover:text-emerald-500"}`}
              >
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/votes"
                className={`text-sm font-medium ${pathname.startsWith("/dashboard/votes") ? "text-emerald-500" : "hover:text-emerald-500"}`}
              >
                Mes votes
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/results"
                className={`text-sm font-medium ${pathname.startsWith("/dashboard/results") ? "text-emerald-500" : "hover:text-emerald-500"}`}
              >
                Résultats
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className={`text-sm font-medium ${pathname === "/dashboard/settings" ? "text-emerald-500" : "hover:text-emerald-500"}`}
              >
                Paramètres
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ""} alt="Avatar" />
                  <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.full_name || "Utilisateur"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
