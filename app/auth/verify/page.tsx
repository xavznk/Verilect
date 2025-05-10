import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">
            V
          </div>
          <h1 className="mt-4 text-3xl font-bold">Verilect</h1>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Vérifiez votre email</CardTitle>
            <CardDescription>
              Nous avons envoyé un lien de vérification à votre adresse email. Veuillez cliquer sur ce lien pour activer
              votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
              <p>
                Si vous ne recevez pas l'email dans les prochaines minutes, veuillez vérifier votre dossier de spam ou
                de courrier indésirable.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" asChild>
              <Link href="/login">Retour à la connexion</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
