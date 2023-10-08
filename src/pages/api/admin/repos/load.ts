import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../../lib/db";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {Octokit} from "octokit";

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
        const data = (await octokit.rest.repos.get({owner: repo.owner, repo: repo.repo_name})).data;
        const queryData = {
            repository_id: data.id.toString(),
            url: data.html_url
        };
        const id = (await prisma.repository.create({
            select: {
                id: true
            },
            data: {
                ...queryData,
                RepositoryStatus: {
                    create: {
                        invalid: false,
                        reviewed: false,
                        reason: null
                    }
                }
            }
        })).id;
        await prisma.repositoryCache.upsert({
            where: {
                repository_id: id,
            },
            update: {
                name: data.name,
                owner: data.owner.login,
                ownerHtmlUrl: data.owner.html_url,
                ownerAvatarUrl: data.owner.avatar_url,
                url: data.html_url,
                description: data.description,
                stars: data.stargazers_count,
                openIssues: data.open_issues_count
            },
            create: {
                repository_id: id,
                name: data.name,
                owner: data.owner.login,
                ownerHtmlUrl: data.owner.html_url,
                ownerAvatarUrl: data.owner.avatar_url,
                url: data.html_url,
                description: data.description,
                stars: data.stargazers_count,
                openIssues: data.open_issues_count
            },
        })
    }

    return res.status(200).send("ok");
}
