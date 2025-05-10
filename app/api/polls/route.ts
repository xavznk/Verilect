import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/supabase/server"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const supabase = createClient()

    // Récupérer tous les votes créés par l'utilisateur
    const { data: polls, error } = await supabase
      .from("polls")
      .select(`
        id,
        title,
        description,
        status,
        created_at,
        end_date,
        vote_type,
        is_anonymous,
        is_public_results,
        is_realtime_results
      `)
      .eq("created_by", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erreur lors de la récupération des votes:", error)
      return NextResponse.json({ error: "Erreur lors de la récupération des votes" }, { status: 500 })
    }

    // Pour chaque vote, récupérer le nombre de votes
    const pollsWithVoteCount = await Promise.all(
      polls.map(async (poll) => {
        const { count, error: countError } = await supabase
          .from("votes")
          .select("*", { count: "exact", head: true })
          .eq("poll_id", poll.id)

        return {
          ...poll,
          vote_count: count || 0,
        }
      }),
    )

    return NextResponse.json(pollsWithVoteCount)
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      vote_type,
      end_date,
      is_anonymous,
      is_public_results,
      is_realtime_results,
      options,
      status,
    } = body

    // Validation
    if (!title) {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 })
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: "Au moins deux options sont requises" }, { status: 400 })
    }

    const supabase = createClient()

    // Insérer le vote
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        title,
        description,
        created_by: session.user.id,
        vote_type: vote_type || "single",
        end_date: end_date || null,
        is_anonymous: is_anonymous || false,
        is_public_results: is_public_results || true,
        is_realtime_results: is_realtime_results || false,
        status: status || "active",
        start_date: status === "active" ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (pollError) {
      console.error("Erreur lors de la création du vote:", pollError)
      return NextResponse.json({ error: "Erreur lors de la création du vote" }, { status: 500 })
    }

    // Insérer les options
    const optionsToInsert = options.map((text: string) => ({
      poll_id: poll.id,
      text,
    }))

    const { error: optionsError } = await supabase.from("poll_options").insert(optionsToInsert)

    if (optionsError) {
      console.error("Erreur lors de la création des options:", optionsError)
      return NextResponse.json({ error: "Erreur lors de la création des options" }, { status: 500 })
    }

    return NextResponse.json({ success: true, poll })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
