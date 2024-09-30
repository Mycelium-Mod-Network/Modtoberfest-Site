import {Lucia} from "lucia";
import {PrismaAdapter} from "@lucia-auth/adapter-prisma";
import prisma from "./db";
import {GitHub} from "arctic";

// import type { DatabaseUser } from "./db";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: import.meta.env.PROD
        }
    },
    getUserAttributes: (attributes) => {
        return {
            githubId: attributes.github_id,
            username: attributes.username,
            avatar: attributes.avatar,
            name: attributes.name,
            email: attributes.email,
            admin: attributes.admin,
            access_token: attributes.access_token
        };
    }
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    github_id: number;
    username: string;
    avatar: string;
    name: string;
    email: string;
    admin: boolean;
    access_token: string;
}

export const github = new GitHub(
    import.meta.env.GITHUB_ID,
    import.meta.env.GITHUB_SECRET
);
