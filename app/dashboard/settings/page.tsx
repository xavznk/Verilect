import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardShell>
        <div className="grid gap-6">
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-gray-500 dark:text-gray-400">Gérez vos préférences et paramètres de compte.</p>
          </div>
          <Separator />
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configurez comment et quand vous souhaitez être notifié.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">
                      Notifications par email
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recevez des emails lorsque quelqu'un vote sur vos sondages.
                    </p>
                  </div>
                  <Switch id="email-notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="results-notifications" className="font-medium">
                      Résultats finaux
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recevez une notification lorsqu'un de vos sondages est terminé.
                    </p>
                  </div>
                  <Switch id="results-notifications" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Confidentialité</CardTitle>
                <CardDescription>Gérez vos paramètres de confidentialité.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public-profile" className="font-medium">
                      Profil public
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Permettre aux autres utilisateurs de voir votre profil.
                    </p>
                  </div>
                  <Switch id="public-profile" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-votes" className="font-medium">
                      Afficher mes votes
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Permettre aux autres utilisateurs de voir vos votes publics.
                    </p>
                  </div>
                  <Switch id="show-votes" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Compte</CardTitle>
                <CardDescription>Gérez les paramètres de votre compte.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="delete-account" className="font-medium text-red-500">
                    Supprimer le compte
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cette action est irréversible et supprimera toutes vos données.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive">Supprimer mon compte</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </DashboardShell>
    </div>
  )
}
