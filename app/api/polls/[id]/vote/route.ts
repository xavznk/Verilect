import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/supabase/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const pollId = params.id
    const body = await request.json()
    const { option_id } = body

    if (!option_id) {
      return NextResponse.json({ error: "Aucune option sélectionnée" }, { status: 400 })
    }

    // Vérifier que le vote existe et est actif
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("status, vote_type")
      .eq("id", pollId)
      .single()

    if (pollError) {
      console.error("Erreur lors de la vérification du sondage:", pollError)
      if (pollError.code === "PGRST116") {
        return NextResponse.json({ error: "Sondage non trouvé" }, { status: 404 })
      }
      return NextResponse.json({ error: "Erreur lors de la vérification du sondage" }, { status: 500 })
    }

    if (poll.status !== "active") {
      return NextResponse.json({ error: "Ce sondage n'est pas actif" }, { status: 400 })
    }

    // Pour les votes à choix unique, supprimer les votes précédents de l'utilisateur
    if (poll.vote_type === "single") {
      const { error: deleteError } = await supabase
        .from("votes")
        .delete()
        .eq("poll_id", pollId)
        .eq("user_id", session.user.id)

      if (deleteError) {
        console.error("Erreur lors de la suppression des votes précédents:", deleteError)
        return NextResponse.json({ error: "Erreur lors de la suppression des votes précédents" }, { status: 500 })
      }
    }

    // Vérifier que l'option sélectionnée existe pour ce sondage
    const { data: option, error: optionError } = await supabase
      .from("poll_options")
      .select("id")
      .eq("id", option_id)
      .eq("poll_id", pollId)
      .single()

    if (optionError || !option) {
      console.error("Erreur lors de la vérification de l'option:", optionError)
      return NextResponse.json({ error: "Option invalide sélectionnée" }, { status: 400 })
    }

    // Enregistrer le vote
    const { error: insertError } = await supabase.from("votes").insert({
      poll_id: pollId,
      option_id: option_id,
      user_id: session.user.id,
      ranking: 1, // Par défaut pour les votes simples
    })

    if (insertError) {
      console.error("Erreur lors de l'enregistrement du vote:", insertError)
      // Si l'erreur est due à une contrainte unique, c'est que l'utilisateur a déjà voté pour cette option
      if (insertError.code === "23505") {
        return NextResponse.json({ error: "Vous avez déjà voté pour cette option" }, { status: 400 })
      }
      return NextResponse.json({ error: "Erreur lors de l'enregistrement du vote" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  // Vérifier si le sondage existe
  const { data: poll, error: pollError } = await supabase.from("polls").select("*").eq("id", params.id).single()

  if (pollError) {
    return NextResponse.json({ error: pollError.message }, { status: 500 })
  }

  if (!poll) {
    return NextResponse.json({ error: "Sondage non trouvé" }, { status: 404 })
  }

  // Vérifier si l'utilisateur peut voir les résultats
  if (!poll.is_public_results && poll.created_by !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé à voir les résultats" }, { status: 403 })
  }

  // Si le sondage est en cours et que les résultats en temps réel ne sont pas activés
  if (poll.status === "active" && !poll.is_realtime_results && poll.created_by !== session.user.id) {
    return NextResponse.json({ error: "Les résultats ne sont pas encore disponibles" }, { status: 403 })
  }

  // Récupérer les options et le nombre de votes pour chaque option
  const { data: options, error: optionsError } = await supabase
    .from("poll_options")
    .select(`
      id,
      text,
      votes:votes(count)
    `)
    .eq("poll_id", params.id)

  if (optionsError) {
    return NextResponse.json({ error: optionsError.message }, { status: 500 })
  }

  // Récupérer le nombre total de participants uniques
  const { data: participants, error: participantsError } = await supabase
    .from("votes")
    .select("user_id")
    .eq("poll_id", params.id)
    .is("user_id", "not.null")

  if (participantsError) {
    return NextResponse.json({ error: participantsError.message }, { status: 500 })
  }

  // Compter les participants uniques
  const uniqueParticipants = new Set(participants.map((p) => p.user_id)).size

  return NextResponse.json({
    poll,
    options: options.map((option) => ({
      id: option.id,
      text: option.text,
      votes: option.votes[0].count,
    })),
    totalParticipants: uniqueParticipants,
  })
}
