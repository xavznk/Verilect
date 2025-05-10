"use client"

interface Option {
  id: string
  name: string
  votes: number
}

interface ResultsChartProps {
  options: Option[]
}

export function ResultsChart({ options }: ResultsChartProps) {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0)

  // Trier les options par nombre de votes (décroissant)
  const sortedOptions = [...options].sort((a, b) => b.votes - a.votes)

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {sortedOptions.map((option) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0

          return (
            <div key={option.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{option.name}</div>
                <div className="text-sm text-muted-foreground">
                  {option.votes} votes ({percentage}%)
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg border p-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Votes totaux</div>
          <div className="text-3xl font-bold">{totalVotes}</div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm text-muted-foreground">Option gagnante</div>
            <div className="font-medium">{sortedOptions.length > 0 ? sortedOptions[0].name : "Aucune"}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Écart avec le 2ème</div>
            <div className="font-medium">
              {sortedOptions.length > 1 ? `${sortedOptions[0].votes - sortedOptions[1].votes} votes` : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
