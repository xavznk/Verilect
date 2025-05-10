import { AuthHeader } from "@/components/auth-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function VerifyPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthHeader />
      <div className="container flex flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Vérifiez votre email</CardTitle>
            <CardDescription>Nous avons envoyé un lien de connexion à votre adresse email.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Veuillez vérifier votre boîte de réception et cliquer sur le lien pour vous connecter. Si vous ne trouvez
              pas l'email, vérifiez votre dossier spam.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
