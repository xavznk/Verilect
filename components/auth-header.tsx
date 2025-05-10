import Link from "next/link"
import { Vote } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AuthHeader() {
  return (
    <header className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Vote className="h-8 w-8 text-emerald-500" />
          <span className="text-2xl font-bold">Verilect</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline">Se connecter</Button>
          </Link>
          <Link href="/register">
            <Button>S'inscrire</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
