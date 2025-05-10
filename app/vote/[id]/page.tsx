import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { VoteForm } from "@/components/vote-form"
import { getSession } from "@/lib/supabase/server"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function PublicVotePage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  // Récupérer le sondage avec ses options
  const { data: poll, error } = await supabase
    .from("polls")
    .select(`
      *,
      poll_options(*)
    `)
    .eq("id", params.id)
    .single()

  if (error || !poll) {
    notFound()
  }

  // S'assurer que poll_options existe et est un tableau
  if (!poll.poll_options) {
    poll.poll_options = []
  }

  // Vérifier si le sondage est actif
  const isActive = poll.status === "active"

  // Vérifier si l'utilisateur a déjà voté (s'il est connecté)
  let hasVoted = false
  if (session) {
    const { data: existingVotes } = await supabase
      .from("votes")
      .select("*")
      .eq("poll_id", params.id)
      .eq("user_id", session.user.id)

    hasVoted = existingVotes && existingVotes.length > 0
  }

  // Récupérer le nombre total de votes
  const { count } = await supabase.from("votes").select("*", { count: "exact" }).eq("poll_id", params.id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vote className="h-8 w-8 text-emerald-500" />
            <span className="text-2xl font-bold">VoteHub</span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button>Tableau de bord</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Se connecter</Button>
                </Link>
                <Link href="/register">
                  <Button>S'inscrire</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {!isActive ? (
                  <div className="rounded-md bg-amber-50 p-4 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                    Ce sondage n'est plus actif. Vous ne pouvez plus voter.
                  </div>
                ) : !session ? (
                  <div className="rounded-md bg-blue-50 p-4 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    <p className="mb-2">Vous devez être connecté pour voter.</p>
                    <div className="flex gap-2">
                      <Link href={`/login?redirect=/vote/${params.id}`}>
                        <Button size="sm">Se connecter</Button>
                      </Link>
                      <Link href={`/register?redirect=/vote/${params.id}`}>
                        <Button size="sm" variant="outline">
                          S'inscrire
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : hasVoted ? (
                  <div className="rounded-md bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                    Vous avez déjà voté pour ce sondage.
                  </div>
                ) : (
                  <VoteForm poll={poll} />
                )}
              </CardContent>
              {isActive && poll.is_public_results && (poll.is_realtime_results || hasVoted) && (
                <CardFooter>
                  <Button asChild>
                    <Link href={`/vote/${params.id}/results`}>Voir les résultats</Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Créé le</p>
                  <p className="font-medium">{format(new Date(poll.created_at), "PPP", { locale: fr })}</p>
                </div>
                {poll.end_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Se termine le</p>
                    <p className="font-medium">{format(new Date(poll.end_date), "PPP", { locale: fr })}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Type de vote</p>
                  <p className="font-medium">
                    {poll.vote_type === "single"
                      ? "Choix unique"
                      : poll.vote_type === "multiple"
                        ? "Choix multiple"
                        : "Vote par classement"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nombre d'options</p>
                  <p className="font-medium">{poll.poll_options.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Votes reçus</p>
                  <p className="font-medium">{count || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paramètres</p>
                  <ul className="mt-1 space-y-1 text-sm">
                    <li>{poll.is_anonymous ? "Vote anonyme" : "Vote non anonyme"}</li>
                    <li>{poll.is_public_results ? "Résultats publics" : "Résultats privés"}</li>
                    <li>
                      {poll.is_realtime_results
                        ? "Résultats en temps réel"
                        : "Résultats visibles uniquement à la fin du vote"}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
