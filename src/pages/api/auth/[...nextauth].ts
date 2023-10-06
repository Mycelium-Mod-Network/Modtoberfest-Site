import NextAuth, {NextAuthOptions} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions:NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        newUser: "/new"
    },
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: {
                    scope: "user:email,read:org"
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            await prisma.account.update({
                data: {
                    access_token: account.access_token,
                    token_type: account.token_type,
                    scope: account.scope
                },
                where: {
                    provider_providerAccountId: {
                        provider: "github",
                        providerAccountId: account.providerAccountId
                    }
                }
            })
            return true
        },
    }
};
export default NextAuth(authOptions);