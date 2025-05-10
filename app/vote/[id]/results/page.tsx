import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Vote } from "lucide-react"
import { ResultsChart } from "@/components/results-chart"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function PublicResultsPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  // Récupérer le sondage
  const { data: poll, error: pollError } = await supabase.from("polls").select("*").eq("id", params.id).single()

  if (pollError || !poll) {
    notFound()
  }

  // Vérifier si les résultats sont publics
  if (!poll.is_public_results) {
    redirect(`/vote/${params.id}`)
  }

  // Si le sondage est en cours et que les résultats en temps réel ne sont pas activés
  if (poll.status === "active" && !poll.is_realtime_results) {
    redirect(`/vote/${params.id}`)
  }

  // Récupérer les options et le nombre de votes pour chaque option
  const { data: options, error: optionsError } = await supabase
    .from("poll_options")
    .select("id, text")
    .eq("poll_id", params.id)

  if (optionsError || !options) {
    notFound()
  }

  // Récupérer les votes pour chaque option
  const { data: votes, error: votesError } = await supabase.from("votes").select("*").eq("poll_id", params.id)

  if (votesError) {
    notFound()
  }

  // Calculer le nombre de votes par option
  const optionsWithVotes = options.map((option) => ({
    id: option.id,
    name: option.text,
    votes: votes ? votes.filter((vote) => vote.option_id === option.id).length : 0,
  }))

  // Calculer le nombre total de participants uniques
  const uniqueParticipants = votes ? new Set(votes.map((vote) => vote.user_id)).size : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vote className="h-8 w-8 text-emerald-500" />
            <span className="text-2xl font-bold">VoteHub</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href={`/vote/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{poll.title} - Résultats</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Résumé du vote</CardTitle>
              <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date de début</p>
                    <p className="font-medium">{format(new Date(poll.start_date), "PPP", { locale: fr })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de fin</p>
                    <p className="font-medium">
                      {poll.end_date ? format(new Date(poll.end_date), "PPP", { locale: fr }) : "Non définie"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="font-medium">{uniqueParticipants}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Votes totaux</p>
                    <p className="font-medium">{votes ? votes.length : 0}</p>
                  </div>
                </div>
                <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                  <p className="text-sm">
                    {poll.status === "active"
                      ? "Ce vote est actuellement en cours. Les résultats peuvent encore changer."
                      : "Ce vote est terminé. Les résultats sont définitifs."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div
                    className={`rounded-full px-4 py-2 text-white ${
                      poll.status === "active"
                        ? "bg-emerald-500"
                        : poll.status === "completed"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                    }`}
                  >
                    {poll.status === "active" ? "En cours" : poll.status === "completed" ? "Terminé" : "Brouillon"}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Type de vote</p>
                  <p className="font-medium">
                    {poll.vote_type === "single"
                      ? "Choix unique"
                      : poll.vote_type === "multiple"
                        ? "Choix multiple"
                        : "Vote par classement"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Options</p>
                  <p className="font-medium">{options.length} options disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Résultats du vote</CardTitle>
            <CardDescription>Répartition des votes entre les différentes options</CardDescription>
          </CardHeader>
          <CardContent>
            <ResultsChart options={optionsWithVotes} />
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-100 py-12 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Vote className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold">VoteHub</span>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-gray-600 hover:text-emerald-500 dark:text-gray-400">
                À propos
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-emerald-500 dark:text-gray-400">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-emerald-500 dark:text-gray-400">
                Confidentialité
              </Link>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} VoteHub. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
