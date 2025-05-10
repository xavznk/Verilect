import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const pollId = params.id
    const supabase = createClient()

    // Récupérer le vote
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select(`
        id,
        title,
        description,
        status,
        created_at,
        start_date,
        end_date,
        vote_type,
        is_anonymous,
        is_public_results,
        is_realtime_results,
        created_by
      `)
      .eq("id", pollId)
      .single()

    if (pollError) {
      if (pollError.code === "PGRST116") {
        return NextResponse.json({ error: "Vote non trouvé" }, { status: 404 })
      }
      return NextResponse.json({ error: "Erreur lors de la récupération du vote" }, { status: 500 })
    }

    // Vérifier les autorisations pour voir les résultats
    const session = await getSession()

    // Si les résultats ne sont pas publics, seul le créateur peut les voir
    if (!poll.is_public_results && (!session || session.user.id !== poll.created_by)) {
      return NextResponse.json({ error: "Non autorisé à voir les résultats" }, { status: 403 })
    }

    // Si les résultats ne sont pas en temps réel et que le vote est actif,
    // seul le créateur peut les voir
    if (!poll.is_realtime_results && poll.status === "active" && (!session || session.user.id !== poll.created_by)) {
      return NextResponse.json({ error: "Les résultats ne sont pas disponibles pendant le vote" }, { status: 403 })
    }

    // Récupérer les options du vote
    const { data: options, error: optionsError } = await supabase
      .from("poll_options")
      .select("id, text")
      .eq("poll_id", pollId)
      .order("created_at", { ascending: true })

    if (optionsError) {
      return NextResponse.json({ error: "Erreur lors de la récupération des options" }, { status: 500 })
    }

    // Récupérer les votes pour chaque option
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select("option_id, created_at")
      .eq("poll_id", pollId)

    if (votesError) {
      return NextResponse.json({ error: "Erreur lors de la récupération des votes" }, { status: 500 })
    }

    // Calculer les résultats
    const results = options.map((option) => {
      const optionVotes = votes.filter((vote) => vote.option_id === option.id)
      return {
        id: option.id,
        text: option.text,
        votes: optionVotes.length,
      }
    })

    // Calculer les statistiques de participation par jour
    const participationByDay: Record<string, number> = {}

    if (votes.length > 0) {
      votes.forEach((vote) => {
        const date = new Date(vote.created_at).toISOString().split("T")[0]
        participationByDay[date] = (participationByDay[date] || 0) + 1
      })
    }

    // Convertir en tableau pour le graphique
    const participationStats = Object.entries(participationByDay)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      poll,
      results,
      totalVotes: votes.length,
      participationStats,
    })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
