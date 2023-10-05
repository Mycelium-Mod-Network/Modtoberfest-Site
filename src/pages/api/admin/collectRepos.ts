import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../lib/db";
import {Octokit} from "octokit";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {Repository as GHRepo} from "@octokit/webhooks-types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.body.secret !== process.env.ADMIN_SECRET) {
        return res.status(403).send("forbidden");
    }
    const repos = await prisma.repository.findMany({select: {repository_id: true}});
    const octokit = new Octokit({
        authStrategy: createOAuthAppAuth,
        auth: {
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }
    });


    for (let repo of repos) {
        const repoInfo = await octokit.request("GET /repositories/{repository_id}", {repository_id: repo.repository_id});
        const repoData: GHRepo = repoInfo.data;
        await prisma.repositoryCache.upsert({
            where: {
                repository_id: repo.repository_id,
            },
            update: {
                name: repoData.name,
                owner: repoData.owner.login,
                ownerHtmlUrl: repoData.owner.html_url,
                ownerAvatarUrl: repoData.owner.avatar_url,
                url: repoData.html_url,
                description: repoData.description,
                stars: repoData.stargazers_count,
                openIssues: repoData.open_issues_count,
                updatedAt: repoData.updated_at
            },
            create: {
                repository_id: repo.repository_id,
                name: repoData.name,
                owner: repoData.owner.login,
                ownerHtmlUrl: repoData.owner.html_url,
                ownerAvatarUrl: repoData.owner.avatar_url,
                url: repoData.html_url,
                description: repoData.description,
                stars: repoData.stargazers_count,
                openIssues: repoData.open_issues_count,
                updatedAt: repoData.updated_at
            },
        })
        await new Promise(resolve => setTimeout(resolve, 1000));
    }


    return res.status(200).send("OK");
}
