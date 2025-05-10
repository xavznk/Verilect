"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Plus, Trash } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function NewVotePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [voteType, setVoteType] = useState<"single" | "multiple" | "ranked">("single")
  const [endDate, setEndDate] = useState<Date>()
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isPublicResults, setIsPublicResults] = useState(true)
  const [isRealtimeResults, setIsRealtimeResults] = useState(false)
  const [options, setOptions] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addOption = () => {
    const newId = options.length > 0 ? Math.max(...options.map((o) => o.id)) + 1 : 1
    setOptions([...options, { id: newId, text: "" }])
  }

  const removeOption = (id: number) => {
    if (options.length <= 2) return
    setOptions(options.filter((option) => option.id !== id))
  }

  const updateOption = (id: number, text: string) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, text } : option)))
  }

  const handleSubmit = async (isDraft = false) => {
    setError(null)
    setLoading(true)

    try {
      // Validation
      if (!title) {
        throw new Error("Le titre est requis")
      }

      if (options.some((option) => !option.text)) {
        throw new Error("Toutes les options doivent avoir un texte")
      }

      const response = await fetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          vote_type: voteType,
          end_date: endDate ? endDate.toISOString() : null,
          is_anonymous: isAnonymous,
          is_public_results: isPublicResults,
          is_realtime_results: isRealtimeResults,
          options: options.map((o) => o.text),
          status: isDraft ? "draft" : "active",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Une erreur est survenue")
      }

      toast({
        title: isDraft ? "Brouillon enregistré" : "Vote créé avec succès",
        description: isDraft
          ? "Votre brouillon a été enregistré. Vous pourrez le modifier plus tard."
          : "Votre vote est maintenant actif et prêt à recevoir des participants.",
      })

      router.push("/dashboard/votes")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Créer un nouveau vote</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>Définissez les paramètres de base de votre vote</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du vote</Label>
            <Input
              id="title"
              placeholder="Ex: Élection du représentant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez l'objectif de ce vote et donnez toutes les informations nécessaires aux participants."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Type de vote</Label>
            <RadioGroup
              value={voteType}
              onValueChange={(value) => setVoteType(value as "single" | "multiple" | "ranked")}
              className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3"
            >
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single" className="flex flex-col">
                  <span>Choix unique</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Les participants ne peuvent sélectionner qu'une seule option
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple" className="flex flex-col">
                  <span>Choix multiple</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Les participants peuvent sélectionner plusieurs options
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="ranked" id="ranked" />
                <Label htmlFor="ranked" className="flex flex-col">
                  <span>Vote par classement</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Les participants classent les options par ordre de préférence
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Date de fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Options de vote</CardTitle>
          <CardDescription>Ajoutez les options parmi lesquelles les participants pourront choisir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <Input
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeOption(option.id)}
                disabled={options.length <= 2}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" className="gap-2" onClick={addOption}>
            <Plus className="h-4 w-4" /> Ajouter une option
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres avancés</CardTitle>
          <CardDescription>Configurez les options de sécurité et de confidentialité</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="anonymous">Vote anonyme</Label>
              <p className="text-sm text-muted-foreground">
                Les identités des votants ne seront pas liées à leurs votes
              </p>
            </div>
            <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-results">Résultats publics</Label>
              <p className="text-sm text-muted-foreground">Les résultats seront visibles par tous les participants</p>
            </div>
            <Switch id="public-results" checked={isPublicResults} onCheckedChange={setIsPublicResults} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="realtime-results">Résultats en temps réel</Label>
              <p className="text-sm text-muted-foreground">Afficher les résultats pendant que le vote est en cours</p>
            </div>
            <Switch id="realtime-results" checked={isRealtimeResults} onCheckedChange={setIsRealtimeResults} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => handleSubmit(true)} disabled={loading}>
            {loading ? "Chargement..." : "Enregistrer comme brouillon"}
          </Button>
          <Button onClick={() => handleSubmit(false)} disabled={loading}>
            {loading ? "Chargement..." : "Créer le vote"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
