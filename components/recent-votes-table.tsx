"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Edit, ExternalLink, MoreHorizontal, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { PollWithOptions } from "@/lib/types/database"

interface RecentVotesTableProps {
  polls: PollWithOptions[]
  status: "active" | "completed" | "draft"
}

export function RecentVotesTable({ polls, status }: RecentVotesTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [votes, setVotes] = useState<PollWithOptions[]>(polls)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/polls/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du vote")
      }

      setVotes(votes.filter((vote) => vote.id !== id))

      toast({
        title: "Vote supprimé",
        description: "Le vote a été supprimé avec succès.",
      })

      router.refresh()
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Chargement des votes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Options</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Date de fin</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {votes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Aucun vote trouvé.
              </TableCell>
            </TableRow>
          ) : (
            votes.map((vote) => (
              <TableRow key={vote.id}>
                <TableCell className="font-medium">{vote.title}</TableCell>
                <TableCell>{vote.poll_options?.length || 0} options</TableCell>
                <TableCell>{format(new Date(vote.created_at), "dd MMM yyyy", { locale: fr })}</TableCell>
                <TableCell>
                  {vote.end_date ? format(new Date(vote.end_date), "dd MMM yyyy", { locale: fr }) : "Non défini"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      vote.status === "active" ? "default" : vote.status === "completed" ? "secondary" : "outline"
                    }
                  >
                    {vote.status === "active" ? "Actif" : vote.status === "completed" ? "Terminé" : "Brouillon"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/votes/${vote.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Voir</span>
                        </Link>
                      </DropdownMenuItem>
                      {(vote.status === "completed" || vote.is_realtime_results) && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/results/${vote.id}`}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            <span>Résultats</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {vote.status !== "completed" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/votes/edit/${vote.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Modifier</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(vote.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
