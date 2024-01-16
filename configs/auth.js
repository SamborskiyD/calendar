import CredentialsProvider from "next-auth/providers/credentials"
import { findUser } from "@/db/actions"

export const authOptions = {
    
    providers: [
        CredentialsProvider({
            
            credentials: {
                email: { label: 'Email', type: 'email', required: true },
                password: { label: 'Password', type: 'password', required: true },
            },

            async authorize(credentials) {

                let user
                let findedUser = await findUser(credentials.email)
                if (findedUser.error) {
                    user = {error: findedUser.error}
                }
                if (!credentials?.email || !credentials?.password) {
                    user = null
                }
                else if (credentials.email === findedUser.email && credentials.password !== findedUser.password) {
                    user = {error: "Wrong password"}
                }
                else if (credentials.email === findedUser.email && credentials.password === findedUser.password) {
                    user = findedUser
                }
                
                return user
            },
        }),
    ],
    callbacks: {
        async signIn({user}) {
            if (user.error) {
                throw new Error(user.error)
            }
            else return user
        },

        async jwt({ token, user }) {
            return { ...token, ...user };
        },

        async session({ session, token, user }) {
            session.user = token;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET
}