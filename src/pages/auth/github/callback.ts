import {github, lucia} from "@lib/auth";
import prisma from "@lib/db";
import {OAuth2RequestError} from "arctic";
import {generateIdFromEntropySize} from "lucia";
import type {APIContext} from "astro";
import {Octokit} from "octokit";

export async function GET(context: APIContext): Promise<Response> {
    const code = context.url.searchParams.get("code");
    const state = context.url.searchParams.get("state");
    const storedState = context.cookies.get("github_oauth_state")?.value ?? null;
    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    try {
        const tokens = await github.validateAuthorizationCode(code);

        const octokit = new Octokit({
            auth: tokens.accessToken
        });
        const githubUser = (await octokit.rest.users.getAuthenticated()).data
        const existingUser = await prisma.user.findFirst({
            select: {
                id: true
            },
            where: {
                github_id: githubUser.id,
            }
        })

        if (existingUser) {
            await prisma.user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    github_id: githubUser.id,
                    username: githubUser.login,
                    name: githubUser.name || "NA",
                    avatar: githubUser.avatar_url,
                    email: githubUser.email || "NA",
                    access_token: tokens.accessToken,
                }
            })
            const session = await lucia.createSession(existingUser.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            return context.redirect("/");
        }

        const userId = generateIdFromEntropySize(10);

        await prisma.user.create({
            data: {
                id: userId,
                github_id: githubUser.id,
                username: githubUser.login,
                name: githubUser.name || "NA",
                avatar: githubUser.avatar_url,
                email: githubUser.email || "NA",
                access_token: tokens.accessToken,
                admin: false
            }
        })

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        return context.redirect("/");
    } catch (e) {
        if (e instanceof OAuth2RequestError) {
            return new Response(null, {
                status: 400
            });
        }
        return new Response(null, {
            status: 500
        });
    }
}