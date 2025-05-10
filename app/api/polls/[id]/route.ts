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

    // Récupérer les options du vote
    const { data: options, error: optionsError } = await supabase
      .from("poll_options")
      .select("id, text")
      .eq("poll_id", pollId)
      .order("created_at", { ascending: true })

    if (optionsError) {
      return NextResponse.json({ error: "Erreur lors de la récupération des options" }, { status: 500 })
    }

    // Vérifier si l'utilisateur a déjà voté
    const session = await getSession()
    let hasVoted = false

    if (session) {
      const { count, error: voteError } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("poll_id", pollId)
        .eq("user_id", session.user.id)

      hasVoted = count !== null && count > 0
    }

    // Récupérer le nombre total de votes
    const { count: voteCount, error: countError } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("poll_id", pollId)

    return NextResponse.json({
      ...poll,
      options,
      hasVoted,
      voteCount: voteCount || 0,
    })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const pollId = params.id
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

    const supabase = createClient()

    // Vérifier que l'utilisateur est le créateur du vote
    const { data: poll, error: pollCheckError } = await supabase
      .from("polls")
      .select("created_by")
      .eq("id", pollId)
      .single()

    if (pollCheckError) {
      if (pollCheckError.code === "PGRST116") {
        return NextResponse.json({ error: "Vote non trouvé" }, { status: 404 })
      }
      return NextResponse.json({ error: "Erreur lors de la vérification du vote" }, { status: 500 })
    }

    if (poll.created_by !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé à modifier ce vote" }, { status: 403 })
    }

    // Mettre à jour le vote
    const updateData: any = {
      title,
      description,
      vote_type: vote_type || "single",
      end_date: end_date || null,
      is_anonymous: is_anonymous || false,
      is_public_results: is_public_results || true,
      is_realtime_results: is_realtime_results || false,
      status: status || "active",
      updated_at: new Date().toISOString(),
    }

    // Si le statut passe de brouillon à actif, définir la date de début
    if (status === "active") {
      const { data: currentPoll } = await supabase.from("polls").select("status").eq("id", pollId).single()

      if (currentPoll && currentPoll.status === "draft") {
        updateData.start_date = new Date().toISOString()
      }
    }

    const { error: updateError } = await supabase.from("polls").update(updateData).eq("id", pollId)

    if (updateError) {
      console.error("Erreur lors de la mise à jour du vote:", updateError)
      return NextResponse.json({ error: "Erreur lors de la mise à jour du vote" }, { status: 500 })
    }

    // Si des options sont fournies, les mettre à jour
    if (options && Array.isArray(options)) {
      // Récupérer les options existantes
      const { data: existingOptions } = await supabase.from("poll_options").select("id, text").eq("poll_id", pollId)

      const existingOptionsMap = existingOptions
        ? existingOptions.reduce((acc: Record<string, any>, option) => {
            acc[option.id] = option
            return acc
          }, {})
        : {}

      // Traiter les options
      for (const option of options) {
        if (option.id && existingOptionsMap[option.id]) {
          // Mettre à jour l'option existante
          if (option.text !== existingOptionsMap[option.id].text) {
            await supabase.from("poll_options").update({ text: option.text }).eq("id", option.id)
          }
        } else if (!option.id && option.text) {
          // Ajouter une nouvelle option
          await supabase.from("poll_options").insert({
            poll_id: pollId,
            text: option.text,
          })
        }
      }

      // Supprimer les options qui ne sont plus présentes
      if (existingOptions) {
        const updatedOptionIds = options.filter((o) => o.id).map((o) => o.id)

        const optionsToDelete = existingOptions.filter((o) => !updatedOptionIds.includes(o.id)).map((o) => o.id)

        if (optionsToDelete.length > 0) {
          await supabase.from("poll_options").delete().in("id", optionsToDelete)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const pollId = params.id
    const supabase = createClient()

    // Vérifier que l'utilisateur est le créateur du vote
    const { data: poll, error: pollCheckError } = await supabase
      .from("polls")
      .select("created_by")
      .eq("id", pollId)
      .single()

    if (pollCheckError) {
      if (pollCheckError.code === "PGRST116") {
        return NextResponse.json({ error: "Vote non trouvé" }, { status: 404 })
      }
      return NextResponse.json({ error: "Erreur lors de la vérification du vote" }, { status: 500 })
    }

    if (poll.created_by !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé à supprimer ce vote" }, { status: 403 })
    }

    // Supprimer les votes associés
    await supabase.from("votes").delete().eq("poll_id", pollId)

    // Supprimer les options
    await supabase.from("poll_options").delete().eq("poll_id", pollId)

    // Supprimer le vote
    const { error: deleteError } = await supabase.from("polls").delete().eq("id", pollId)

    if (deleteError) {
      console.error("Erreur lors de la suppression du vote:", deleteError)
      return NextResponse.json({ error: "Erreur lors de la suppression du vote" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
