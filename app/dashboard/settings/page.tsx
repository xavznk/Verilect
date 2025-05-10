import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Gérez vos préférences de notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notifications par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez des emails pour les nouveaux votes, résultats et activités
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="vote-reminders">Rappels de vote</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez des rappels pour les votes auxquels vous n'avez pas encore participé
                </p>
              </div>
              <Switch id="vote-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="result-notifications">Notifications de résultats</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez des notifications lorsque les résultats d'un vote sont disponibles
                </p>
              </div>
              <Switch id="result-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Confidentialité</CardTitle>
            <CardDescription>Gérez vos paramètres de confidentialité</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-profile">Profil public</Label>
                <p className="text-sm text-muted-foreground">
                  Permettre aux autres utilisateurs de voir votre profil et vos votes publics
                </p>
              </div>
              <Switch id="public-profile" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="anonymous-voting">Vote anonyme par défaut</Label>
                <p className="text-sm text-muted-foreground">
                  Voter de manière anonyme par défaut lorsque cette option est disponible
                </p>
              </div>
              <Switch id="anonymous-voting" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Compte</CardTitle>
            <CardDescription>Gérez les paramètres de votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Changer le mot de passe</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mettez à jour votre mot de passe pour sécuriser votre compte
              </p>
              <Button variant="outline">Changer le mot de passe</Button>
            </div>

            <Separator />

            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-medium text-destructive">Zone de danger</h3>
              <p className="text-sm text-muted-foreground">
                Cette action est irréversible et supprimera toutes vos données, y compris vos votes et sondages.
              </p>
              <Button variant="destructive" className="mt-2 w-fit">
                Supprimer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    </div>
  )
}
