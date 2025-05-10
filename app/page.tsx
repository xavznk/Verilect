import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Bell, Lock, Vote } from "lucide-react"
import { getSession } from "@/lib/supabase/server"

export default async function Home() {
  const session = await getSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vote className="h-8 w-8 text-emerald-500" />
            <span className="text-2xl font-bold">VoteHub</span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button>Tableau de bord</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Se connecter</Button>
                </Link>
                <Link href="/register">
                  <Button>S'inscrire</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12">
        <section className="mb-20 text-center">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-6xl">
            Plateforme de Vote <span className="text-emerald-500">Moderne</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            Une solution complète et sécurisée pour organiser des votes et des sondages en ligne.
          </p>
          <div className="flex justify-center gap-4">
            <Link href={session ? "/dashboard" : "/register"}>
              <Button size="lg" className="gap-2">
                Commencer <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                Voir la démo
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="mb-12 text-center text-3xl font-bold">Nos Services</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Lock className="mb-2 h-8 w-8 text-emerald-500" />
                <CardTitle>Authentification</CardTitle>
                <CardDescription>Gestion sécurisée des utilisateurs et des accès</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Authentification multi-facteurs, gestion des rôles et des permissions.</p>
              </CardContent>
              <CardFooter>
                <Link href="/services/auth" className="text-sm text-emerald-500 hover:underline">
                  En savoir plus
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Vote className="mb-2 h-8 w-8 text-emerald-500" />
                <CardTitle>Service de Vote</CardTitle>
                <CardDescription>Création et gestion des scrutins</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Création de votes, gestion des options, paramètres de confidentialité.</p>
              </CardContent>
              <CardFooter>
                <Link href="/services/voting" className="text-sm text-emerald-500 hover:underline">
                  En savoir plus
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="mb-2 h-8 w-8 text-emerald-500" />
                <CardTitle>Résultats</CardTitle>
                <CardDescription>Analyse et visualisation des résultats</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Tableaux de bord en temps réel, graphiques interactifs, exportation des données.</p>
              </CardContent>
              <CardFooter>
                <Link href="/services/results" className="text-sm text-emerald-500 hover:underline">
                  En savoir plus
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Bell className="mb-2 h-8 w-8 text-emerald-500" />
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Alertes et communications</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Notifications par email, SMS et push pour les événements importants.</p>
              </CardContent>
              <CardFooter>
                <Link href="/services/notifications" className="text-sm text-emerald-500 hover:underline">
                  En savoir plus
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="mb-12 text-center text-3xl font-bold">Comment ça marche</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 dark:bg-emerald-900">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="mb-2 text-xl font-bold">Créez votre scrutin</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Définissez les options, la durée et les paramètres de sécurité de votre vote.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 dark:bg-emerald-900">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="mb-2 text-xl font-bold">Invitez les participants</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Partagez le lien ou envoyez des invitations aux électeurs concernés.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 dark:bg-emerald-900">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="mb-2 text-xl font-bold">Analysez les résultats</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Visualisez les résultats en temps réel et générez des rapports détaillés.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-12 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Vote className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold">VoteHub</span>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-gray-600 hover:text-emerald-500 dark:text-gray-400">
                À propos
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-emerald-500 dark:text-gray-400">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-emerald-500 dark:text-gray-400">
                Confidentialité
              </Link>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} VoteHub. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
