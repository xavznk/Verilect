import { NextResponse } from "next/server"

// Service de résultats - dans une application réelle, ce service communiquerait avec une base de données
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simuler un délai de réseau
  await new Promise((resolve) => setTimeout(resolve, 500))

  const id = params.id

  // Exemple de données
  const results = {
    id,
    title: "Élection du représentant",
    description: "Vote pour élire le représentant du département pour l'année 2023-2024.",
    startDate: "10 mai 2023",
    endDate: "17 mai 2023",
    totalVoters: 245,
    eligibleVoters: 312,
    options: [
      { name: "Marie Dubois", votes: 98 },
      { name: "Thomas Martin", votes: 87 },
      { name: "Sophie Petit", votes: 45 },
      { name: "Lucas Bernard", votes: 15 },
    ],
    participationByDay: [
      { day: "Jour 1", count: 78 },
      { day: "Jour 2", count: 42 },
      { day: "Jour 3", count: 35 },
      { day: "Jour 4", count: 25 },
      { day: "Jour 5", count: 18 },
      { day: "Jour 6", count: 32 },
      { day: "Jour 7", count: 15 },
    ],
  }

  return NextResponse.json(results)
}
