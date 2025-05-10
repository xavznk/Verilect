import { AuthForm } from "@/components/auth/auth-form"
import { AuthHeader } from "@/components/auth-header"
import { getSession } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthHeader />
      <div className="container flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Créer un compte</h1>
            <p className="text-gray-500 dark:text-gray-400">Entrez votre email pour créer un compte</p>
          </div>
          <AuthForm type="register" />
        </div>
      </div>
    </div>
  )
}
