import Link from "next/link"
import { Vote } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AuthHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Vote className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">VoteHub</span>
          </Link>
        </div>
        <div>
          <Button variant="ghost" asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
