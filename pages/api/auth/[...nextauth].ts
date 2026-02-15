import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"

const providers: NextAuthOptions["providers"] = [
    CredentialsProvider({
        name: "Local Profile",
        credentials: {
            userId: { label: "User ID", type: "text" },
        },
        async authorize(credentials: any) {
            if (!credentials?.userId) return null;

            const user = await prisma.user.findUnique({
                where: { id: credentials.userId },
            });

            if (user) {
                return user;
            }
            return null;
        },
    }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    )
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers,
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.id;
            }
            return session;
        },
    },
}

export default NextAuth(authOptions)
