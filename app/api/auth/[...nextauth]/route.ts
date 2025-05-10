import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Ce service serait normalement connecté à une base de données
const authHandler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        // Dans une application réelle, vous vérifieriez les identifiants dans votre base de données
        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          return {
            id: "1",
            name: "Jean Dupont",
            email: "user@example.com",
          }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
})

export { authHandler as GET, authHandler as POST }
