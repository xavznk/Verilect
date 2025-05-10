import { AuthForm } from "@/components/auth/auth-form"
import { getSession } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
              V
            </div>
            <span className="text-2xl font-bold">VoteHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/register">
              <Button variant="outline">S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <AuthForm type="login" />
        </div>
      </div>
    </div>
  )
}
