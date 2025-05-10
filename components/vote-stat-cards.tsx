import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Clock, Users, Vote } from "lucide-react"

interface VoteStatCardsProps {
  activeCount: number
  completedCount: number
  draftCount: number
  votesCount: number
}

export function VoteStatCards({ activeCount, completedCount, draftCount, votesCount }: VoteStatCardsProps) {
  const totalPolls = activeCount + completedCount + draftCount
  const participationRate = totalPolls > 0 ? Math.round((votesCount / totalPolls) * 100) : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Votes actifs</CardTitle>
          <Vote className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCount}</div>
          <p className="text-xs text-muted-foreground">
            {totalPolls > 0 ? `${Math.round((activeCount / totalPolls) * 100)}% de tous les votes` : "Aucun vote"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Participants</CardTitle>
          <Users className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{votesCount}</div>
          <p className="text-xs text-muted-foreground">
            {activeCount > 0 ? `${Math.round(votesCount / activeCount)} par vote actif` : "Aucun vote actif"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de participation</CardTitle>
          <BarChart3 className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{participationRate}%</div>
          <p className="text-xs text-muted-foreground">
            {completedCount > 0 ? `Basé sur ${completedCount} votes terminés` : "Aucun vote terminé"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Votes en attente</CardTitle>
          <Clock className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{draftCount}</div>
          <p className="text-xs text-muted-foreground">
            {draftCount > 0 ? "En attente de publication" : "Aucun brouillon"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
