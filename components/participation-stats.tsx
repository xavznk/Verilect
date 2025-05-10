"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ParticipationData {
  day: string
  count: number
}

interface ParticipationStatsProps {
  data?: ParticipationData[]
}

export function ParticipationStats({ data = [] }: ParticipationStatsProps) {
  // Si aucune donnée n'est fournie, utiliser des données de démonstration
  const participationData =
    data.length > 0
      ? data
      : [
          { day: "2023-05-01", count: 78 },
          { day: "2023-05-02", count: 42 },
          { day: "2023-05-03", count: 35 },
          { day: "2023-05-04", count: 25 },
          { day: "2023-05-05", count: 18 },
          { day: "2023-05-06", count: 32 },
          { day: "2023-05-07", count: 15 },
        ]

  const maxCount = Math.max(...participationData.map((d) => d.count), 1)
  const totalVotes = participationData.reduce((sum, d) => sum + d.count, 0)
  const averageVotes = participationData.length > 0 ? Math.round(totalVotes / participationData.length) : 0

  // Trouver le jour avec le plus de votes
  const mostActiveDay = [...participationData].sort((a, b) => b.count - a.count)[0]

  return (
    <div className="space-y-4">
      <div className="flex h-[200px] flex-col justify-end space-y-2">
        <div className="flex h-full items-end gap-2">
          {participationData.map((data, i) => (
            <div key={i} className="relative flex h-full w-full flex-col justify-end">
              <div
                className="w-full rounded-sm bg-emerald-500"
                style={{ height: `${(data.count / maxCount) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex w-full justify-between">
          {participationData.map((data, i) => (
            <div key={i} className="text-xs text-muted-foreground">
              {format(new Date(data.day), "dd/MM", { locale: fr })}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm text-muted-foreground">Jour le plus actif</div>
            <div className="font-medium">
              {mostActiveDay
                ? `${format(new Date(mostActiveDay.day), "dd MMM", { locale: fr })} (${mostActiveDay.count} votes)`
                : "Aucune donnée"}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Moyenne par jour</div>
            <div className="font-medium">{averageVotes} votes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
