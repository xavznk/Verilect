"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

type Poll = {
  id: string
  title: string
  description: string
  status: "active" | "completed" | "draft"
  created_at: string
  end_date: string | null
  vote_count: number
}

export default function VotesPage() {
  const { toast } = useToast()
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch("/api/polls")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des votes")
        }
        const data = await response.json()
        setPolls(data)
      } catch (error) {
        console.error("Erreur:", error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos votes. Veuillez réessayer.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [toast])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Actif</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Terminé</Badge>
      case "draft":
        return <Badge variant="outline">Brouillon</Badge>
      default:
        return null
    }
  }

  const activePolls = polls.filter((poll) => poll.status === "active")
  const completedPolls = polls.filter((poll) => poll.status === "completed")
  const draftPolls = polls.filter((poll) => poll.status === "draft")

  const renderPollsList = (pollsList: Poll[]) => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="mb-4">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))
    }

    if (pollsList.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Aucun vote trouvé dans cette catégorie.
          </CardContent>
        </Card>
      )
    }

    return pollsList.map((poll) => (
      <Card key={poll.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{poll.title}</CardTitle>
            {getStatusBadge(poll.status)}
          </div>
          <CardDescription>
            Créé {formatDistanceToNow(new Date(poll.created_at), { addSuffix: true, locale: fr })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{poll.description}</p>
          <div className="flex flex-wrap gap-2">
            {poll.status === "draft" ? (
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/votes/edit/${poll.id}`}>Modifier</Link>
                </Button>
                <Button asChild size="sm" variant="default">
                  <Link href={`/dashboard/votes/${poll.id}`}>Publier</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/votes/${poll.id}`}>Détails</Link>
                </Button>
                <Button asChild size="sm" variant="default">
                  <Link href={`/dashboard/results/${poll.id}`}>Résultats</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mes votes</h1>
        <Button asChild>
          <Link href="/dashboard/votes/new">
            <Plus className="mr-2 h-4 w-4" /> Créer un vote
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Actifs ({activePolls.length})</TabsTrigger>
          <TabsTrigger value="completed">Terminés ({completedPolls.length})</TabsTrigger>
          <TabsTrigger value="draft">Brouillons ({draftPolls.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {renderPollsList(activePolls)}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {renderPollsList(completedPolls)}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {renderPollsList(draftPolls)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
