import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { RecentVotesTable } from "@/components/recent-votes-table"
import { VoteStatCards } from "@/components/vote-stat-cards"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { PollWithOptions } from "@/lib/types/database"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  // Récupérer les sondages de l'utilisateur
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  // Récupérer les sondages actifs
  const { data: activePolls } = await supabase
    .from("polls")
    .select(`
      *,
      poll_options(*)
    `)
    .eq("created_by", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  // Récupérer les sondages terminés
  const { data: completedPolls } = await supabase
    .from("polls")
    .select(`
      *,
      poll_options(*)
    `)
    .eq("created_by", userId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })

  // Récupérer les brouillons
  const { data: draftPolls } = await supabase
    .from("polls")
    .select(`
      *,
      poll_options(*)
    `)
    .eq("created_by", userId)
    .eq("status", "draft")
    .order("created_at", { ascending: false })

  // Récupérer le nombre total de votes pour les sondages de l'utilisateur
  const { count: votesCount } = await supabase
    .from("votes")
    .select("id", { count: "exact" })
    .in(
      "poll_id",
      [...(activePolls || []), ...(completedPolls || [])].map((poll) => poll.id),
    )

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <Link href="/dashboard/votes/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Nouveau vote
          </Button>
        </Link>
      </div>

      <VoteStatCards
        activeCount={activePolls?.length || 0}
        completedCount={completedPolls?.length || 0}
        draftCount={draftPolls?.length || 0}
        votesCount={votesCount || 0}
      />

      <Tabs defaultValue="active" className="mt-8">
        <TabsList>
          <TabsTrigger value="active">Votes actifs</TabsTrigger>
          <TabsTrigger value="completed">Votes terminés</TabsTrigger>
          <TabsTrigger value="drafts">Brouillons</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <RecentVotesTable polls={(activePolls as PollWithOptions[]) || []} status="active" />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <RecentVotesTable polls={(completedPolls as PollWithOptions[]) || []} status="completed" />
        </TabsContent>
        <TabsContent value="drafts" className="mt-4">
          <RecentVotesTable polls={(draftPolls as PollWithOptions[]) || []} status="draft" />
        </TabsContent>
      </Tabs>
    </>
  )
}
