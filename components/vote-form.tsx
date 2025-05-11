"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface VoteFormProps {
  poll: any // Utiliser any pour éviter les problèmes de typage avec poll_options vs options
}

export function VoteForm({ poll }: VoteFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // S'assurer que les options sont accessibles, quelle que soit leur structure
  const options = poll.poll_options || poll.options || []

  const handleSingleOptionChange = (optionId: string) => {
    setSelectedOptions([optionId])
  }

  const handleMultipleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId])
    } else {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (selectedOptions.length === 0) {
        throw new Error("Veuillez sélectionner au moins une option")
      }

      // Pour les votes à choix unique, on n'envoie qu'une seule requête
      if (poll.vote_type === "single") {
        const response = await fetch(`/api/polls/${poll.id}/vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            option_id: selectedOptions[0],
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Une erreur est survenue lors du vote")
        }
      } else {
        // Pour les votes à choix multiples, on envoie une requête par option sélectionnée
        const promises = selectedOptions.map((optionId) =>
          fetch(`/api/polls/${poll.id}/vote`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              option_id: optionId,
            }),
          }),
        )

        const responses = await Promise.all(promises)
        const hasError = responses.some((response) => !response.ok)

        if (hasError) {
          throw new Error("Une erreur est survenue lors du vote")
        }
      }

      toast({
        title: "Vote enregistré",
        description: "Votre vote a été enregistré avec succès.",
      })

      // Rediriger vers les résultats si disponibles, sinon vers le dashboard
      if (poll.is_realtime_results && poll.is_public_results) {
        router.push(`/vote/${poll.id}/results`)
      } else {
        router.push("/dashboard")
      }
      router.refresh()
    } catch (err: any) {
      console.error("Erreur lors du vote:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {poll.vote_type === "single" ? (
        <RadioGroup value={selectedOptions[0]} onValueChange={handleSingleOptionChange}>
          <div className="space-y-3">
            {options.map((option: any) => (
              <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      ) : (
        <div className="space-y-3">
          {options.map((option: any) => (
            <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3">
              <Checkbox
                id={option.id}
                checked={selectedOptions.includes(option.id)}
                onCheckedChange={(checked) => handleMultipleOptionChange(option.id, checked as boolean)}
              />
              <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                {option.text}
              </Label>
            </div>
          ))}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Envoi en cours..." : "Voter"}
      </Button>
    </form>
  )
}
