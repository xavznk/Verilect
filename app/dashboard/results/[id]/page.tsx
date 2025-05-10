import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { ResultsChart } from "@/components/results-chart"
import { ParticipationStats } from "@/components/participation-stats"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/supabase/server"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Récupérer le sondage
  const { data: poll, error: pollError } = await supabase.from("polls").select("*").eq("id", params.id).single()

  if (pollError || !poll) {
    notFound()
  }

  // Vérifier si l'utilisateur peut voir les résultats
  if (!poll.is_public_results && poll.created_by !== session.user.id) {
    redirect("/dashboard")
  }

  // Si le sondage est en cours et que les résultats en temps réel ne sont pas activés
  if (poll.status === "active" && !poll.is_realtime_results && poll.created_by !== session.user.id) {
    redirect("/dashboard")
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

  // Calculer la participation par jour
  const participationByDay = calculateParticipationByDay(votes || [])

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard">
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
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Exporter
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" /> Partager
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participation</CardTitle>
            <CardDescription>Évolution de la participation au cours du vote</CardDescription>
          </CardHeader>
          <CardContent>
            <ParticipationStats data={participationByDay} />
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
    </div>
  )
}

function calculateParticipationByDay(votes: any[]) {
  if (votes.length === 0) return []

  const participationMap = new Map()
  const uniqueUsers = new Set()

  votes.forEach((vote) => {
    const date = new Date(vote.created_at).toISOString().split("T")[0]
    if (!participationMap.has(date)) {
      participationMap.set(date, 0)
    }

    // Ne compter chaque utilisateur qu'une fois par jour
    const userDayKey = `${vote.user_id}-${date}`
    if (!uniqueUsers.has(userDayKey)) {
      uniqueUsers.add(userDayKey)
      participationMap.set(date, participationMap.get(date) + 1)
    }
  })

  // Convertir la Map en tableau et trier par date
  return Array.from(participationMap.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day))
}
