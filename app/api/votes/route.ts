import { NextResponse } from "next/server"

// Service de vote - dans une application réelle, ce service communiquerait avec une base de données
export async function GET() {
  // Simuler un délai de réseau
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Exemple de données
  const votes = [
    {
      id: "vote-1",
      title: "Élection du représentant",
      description: "Vote pour élire le représentant du département pour l'année 2023-2024.",
      participants: 245,
      created: "2023-05-10",
      endDate: "2023-05-17",
      status: "active",
    },
    {
      id: "vote-2",
      title: "Budget participatif 2023",
      description: "Choisissez les projets qui seront financés par le budget participatif cette année.",
      participants: 189,
      created: "2023-05-08",
      endDate: "2023-05-22",
      status: "active",
    },
    // Plus de données...
  ]

  return NextResponse.json(votes)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validation des données
    if (!data.title) {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 })
    }

    // Dans une application réelle, vous enregistreriez ces données dans une base de données
    // et retourneriez l'objet créé avec un ID généré

    return NextResponse.json(
      {
        id: "new-vote-" + Date.now(),
        ...data,
        created: new Date().toISOString().split("T")[0],
        status: data.isDraft ? "draft" : "active",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erreur lors de la création du vote:", error)
    return NextResponse.json({ error: "Erreur lors de la création du vote" }, { status: 500 })
  }
}
