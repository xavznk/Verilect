import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/supabase/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const pollId = params.id
    const body = await request.json()
    const { selectedOptions } = body

    if (!selectedOptions || !Array.isArray(selectedOptions) || selectedOptions.length === 0) {
      return NextResponse.json({ error: "Aucune option sélectionnée" }, { status: 400 })
    }

    const supabase = createClient()

    // Vérifier que le vote existe et est actif
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("status, vote_type")
      .eq("id", pollId)
      .single()

    if (pollError) {
      if (pollError.code === "PGRST116") {
        return NextResponse.json({ error: "Vote non trouvé" }, { status: 404 })
      }
      return NextResponse.json({ error: "Erreur lors de la vérification du vote" }, { status: 500 })
    }

    if (poll.status !== "active") {
      return NextResponse.json({ error: "Ce vote n'est pas actif" }, { status: 400 })
    }

    // Vérifier si l'utilisateur a déjà voté
    const { count, error: voteCheckError } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("poll_id", pollId)
      .eq("user_id", session.user.id)

    if (voteCheckError) {
      return NextResponse.json({ error: "Erreur lors de la vérification du vote" }, { status: 500 })
    }

    if (count && count > 0) {
      return NextResponse.json({ error: "Vous avez déjà voté" }, { status: 400 })
    }

    // Vérifier que les options sélectionnées existent pour ce vote
    const { data: options, error: optionsError } = await supabase
      .from("poll_options")
      .select("id")
      .eq("poll_id", pollId)

    if (optionsError) {
      return NextResponse.json({ error: "Erreur lors de la vérification des options" }, { status: 500 })
    }

    const validOptionIds = options.map((o) => o.id)
    const invalidOptions = selectedOptions.filter((o) => !validOptionIds.includes(o.optionId))

    if (invalidOptions.length > 0) {
      return NextResponse.json({ error: "Options invalides sélectionnées" }, { status: 400 })
    }

    // Enregistrer les votes
    const votes = selectedOptions.map((option, index) => ({
      poll_id: pollId,
      option_id: option.optionId,
      user_id: session.user.id,
      ranking: poll.vote_type === "ranked" ? option.ranking || index + 1 : 1,
    }))

    const { error: insertError } = await supabase.from("votes").insert(votes)

    if (insertError) {
      console.error("Erreur lors de l'enregistrement du vote:", insertError)
      return NextResponse.json({ error: "Erreur lors de l'enregistrement du vote" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
