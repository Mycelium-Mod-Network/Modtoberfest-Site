import type {APIContext} from "astro";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {Octokit} from "octokit";
import prisma from "@lib/db.ts";
import {parse} from 'yaml'

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

    const yml = (await octokit.rest.repos.getContent({
        owner: "github-linguist", repo: "linguist", path: "lib/linguist/languages.yml", mediaType: {
            format: "raw"
        }
    })).data.toString();

    const languages: { [key: string]: { color?: string } } = parse(yml);

    for (let key of Object.keys(languages)) {
        await prisma.language.upsert({
            create: {
                name: key,
                color: languages[key].color
            },
            update: {
                color: languages[key].color
            },
            where: {
                name: key
            }
        })
    }

    return new Response(
        JSON.stringify(languages), {
            status: 200
        }
    );
}
