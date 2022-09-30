import { unstable_getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../auth/[...nextauth]";
import { isAdmin } from "../../../../lib/utils";
import prisma from "../../../../lib/db";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import { Octokit } from "octokit";
import { Repository as GHRepo } from "@octokit/webhooks-types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.body.secret !== process.env.ADMIN_SECRET) {
        return res.status(403).send("forbidden");
    }

    const octokit = new Octokit({
        authStrategy: createOAuthAppAuth,
        auth: {
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }
    });

    const repos = req.body.repos;
    for (let repo of repos) {
        const data = (await octokit.rest.repos.get({ owner: repo.owner, repo: repo.repo_name })).data;
        const queryData = {
            repository_id: data.id.toString(),
            url: data.html_url
        };
        await prisma.repository.create({
            data: queryData,
            select: {
                id: true,
                repository_id: true,
                url: true,
                SponsoredRepository: {
                    select: {
                        sponsor: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
    }

    return res.status(200).send("ok");
}
