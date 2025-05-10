import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white dark:bg-gray-950">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
              V
            </div>
            <span className="text-2xl font-bold">Verilect</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Se connecter</Button>
            </Link>
            <Link href="/register">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-100 py-20 dark:from-gray-950 dark:to-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
              Créez et partagez des votes <span className="text-emerald-500">simplement</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              VoteHub est la plateforme idéale pour créer des sondages, recueillir des opinions et prendre des décisions
              collectives en toute simplicité.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="px-8">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-8">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Pourquoi choisir VoteHub?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-4 dark:bg-emerald-900">
                  <div className="h-8 w-8 text-emerald-500 flex items-center justify-center">✓</div>
                </div>
                <h3 className="mb-2 text-xl font-bold">Simple et rapide</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Créez un vote en quelques clics et partagez-le instantanément avec vos participants.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-4 dark:bg-emerald-900">
                  <div className="h-8 w-8 text-emerald-500 flex items-center justify-center">🔒</div>
                </div>
                <h3 className="mb-2 text-xl font-bold">Sécurisé et confidentiel</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Vos données sont protégées et vous pouvez choisir de rendre les votes anonymes.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-4 dark:bg-emerald-900">
                  <div className="h-8 w-8 text-emerald-500 flex items-center justify-center">📊</div>
                </div>
                <h3 className="mb-2 text-xl font-bold">Résultats en temps réel</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Visualisez les résultats instantanément avec des graphiques clairs et détaillés.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20 dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">Prêt à commencer?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-gray-600 dark:text-gray-400">
              Rejoignez des milliers d'utilisateurs qui font confiance à VoteHub pour leurs sondages et votes.
            </p>
            <Link href="/register">
              <Button size="lg" className="px-8">
                Créer un compte gratuit
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white py-8 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                V
              </div>
              <span className="text-xl font-bold">Verilect</span>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500 dark:text-gray-400">
                À propos
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500 dark:text-gray-400">
                Confidentialité
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500 dark:text-gray-400">
                Conditions
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500 dark:text-gray-400">
                Contact
              </Link>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">© 2023 VoteHub. Tous droits réservés.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
