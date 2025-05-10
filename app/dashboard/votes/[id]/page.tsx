import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Share2 } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { VoteForm } from "@/components/vote-form"
import { getSession } from "@/lib/supabase/server"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function VotePage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

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

  // Vérifier si l'utilisateur a déjà voté
  const { data: existingVotes } = await supabase
    .from("votes")
    .select("*")
    .eq("poll_id", params.id)
    .eq("user_id", session.user.id)

  const hasVoted = existingVotes && existingVotes.length > 0

  // Vérifier si le sondage est actif
  const isActive = poll.status === "active"

  // Récupérer le nombre total de votes
  const { count } = await supabase.from("votes").select("*", { count: "exact" }).eq("poll_id", params.id)

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{poll.title}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Voter</CardTitle>
              <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {!isActive ? (
                <div className="rounded-md bg-amber-50 p-4 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                  Ce sondage n'est plus actif. Vous ne pouvez plus voter.
                </div>
              ) : hasVoted ? (
                <div className="rounded-md bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                  Vous avez déjà voté pour ce sondage.
                </div>
              ) : (
                <VoteForm poll={poll} />
              )}
            </CardContent>
            {isActive && (
              <CardFooter>
                <Button variant="outline" className="gap-2" asChild>
                  <Link href={`/vote/${params.id}`}>
                    <Share2 className="h-4 w-4" /> Partager ce vote
                  </Link>
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
                <p className="font-medium">{count}</p>
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
            {(poll.is_realtime_results || poll.status === "completed") && (
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={`/dashboard/results/${params.id}`}>Voir les résultats</Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
