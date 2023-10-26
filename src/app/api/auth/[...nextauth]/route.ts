import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
    secret: "asdfs8345298345729834sdfjh",
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                let user = null
                if (credentials?.password === "passkey1") {
                    user = { id: "1", name: "Authorized" }
                }

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        })
    ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }