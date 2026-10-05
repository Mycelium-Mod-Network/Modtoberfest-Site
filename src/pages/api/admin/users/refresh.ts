import type {APIContext} from "astro";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {Octokit} from "octokit";
import prisma from "@lib/db.ts";

export async function POST({request}: APIContext) {

    const body = await request.json();
    if (body.secret !== import.meta.env.ADMIN_SECRET) {
        return new Response("forbidden", {
            status: 404
        })
    }

    const octokit = new Octokit({
        authStrategy: createOAuthAppAuth,
        auth: {
            clientId: import.meta.env.GITHUB_ID,
            clientSecret: import.meta.env.GITHUB_SECRET
        }
    });

    const users = (await prisma.user.findMany({
        select: {
            id: true,
            github_id: true,
            username: true,
            email: true,
            avatar: true,
            name: true
        }
    }));


    let updated = 0;
    for (let user of users) {
        try {
            const newUser = (await octokit.rest.users.getById({
                account_id: user.github_id
            })).data

            const {name, avatar_url, email, login} = newUser;
            let changed = false;
            if (user.username !== login) {
                user.username = login;
                changed = true;
            }
            if (email && user.email !== email) {
                user.email = email;
                changed = true;
            }
            if (name && user.name !== name) {
                user.name = name;
                changed = true;
            }
            if (user.avatar !== avatar_url) {
                user.avatar = avatar_url;
                changed = true;
            }
            if (changed) {
                await prisma.user.update({
                    data: {
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        avatar: user.avatar
                    },
                    where: {
                        id: user.id,
                    }
                })
                updated++;
            }
        } catch (e) {
            console.log(user);
            console.log(e);
        }
    }

    return new Response(
        JSON.stringify({updated}), {
            status: 200
        }
    );
}
