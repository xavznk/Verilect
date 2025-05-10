import { NextResponse } from "next/server"

// Service de notification - dans une application réelle, ce service enverrait des notifications par email, SMS, etc.
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validation des données
    if (!data.userId || !data.message) {
      return NextResponse.json({ error: "userId et message sont requis" }, { status: 400 })
    }

    // Dans une application réelle, vous enverriez une notification à l'utilisateur
    // via email, SMS, notification push, etc.

    console.log(`Notification envoyée à l'utilisateur ${data.userId}: ${data.message}`)

    return NextResponse.json({
      success: true,
      id: "notification-" + Date.now(),
      sentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification:", error)
    return NextResponse.json({ error: "Erreur lors de l'envoi de la notification" }, { status: 500 })
  }
}
