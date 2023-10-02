import { unstable_getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../auth/[...nextauth]";
import { isAdmin } from "../../../../lib/utils";
import prisma from "../../../../lib/db";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import { Octokit } from "octokit";
import { Repository as GHRepo } from "@octokit/webhooks-types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (await isAdmin({ right: session })) {

        const octokit = new Octokit({
            authStrategy: createOAuthAppAuth,
            auth: {
                clientId: process.env.GITHUB_ID,
                clientSecret: process.env.GITHUB_SECRET
            }
        });

        const data = (await octokit.rest.repos.get({ owner: req.body.owner, repo: req.body.repo_name })).data;
        const queryData = {
            repository_id: data.id.toString(),
            url: data.html_url,
        }
        if(req.body.sponsor){
            queryData["SponsoredRepository"] = {
                create: {
                    sponsor_id: req.body.sponsor
                }
            }
        }
        const addedRepo = await prisma.repository.create({
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
        const repoData: GHRepo = (await octokit.request("GET /repositories/{repository_id}", { repository_id: addedRepo.repository_id })).data;

        await prisma.repositoryCache.upsert({
            where: {
                repository_id: addedRepo.repository_id,
            },
            update: {
                name: repoData.name,
                owner: repoData.owner.login,
                ownerHtmlUrl: repoData.owner.html_url,
                ownerAvatarUrl: repoData.owner.avatar_url,
                url: repoData.html_url,
                description: repoData.description,
                stars: repoData.stargazers_count,
                openIssues: repoData.open_issues_count
            },
            create: {
                repository_id: addedRepo.repository_id,
                name: repoData.name,
                owner: repoData.owner.login,
                ownerHtmlUrl: repoData.owner.html_url,
                ownerAvatarUrl: repoData.owner.avatar_url,
                url: repoData.html_url,
                description: repoData.description,
                stars: repoData.stargazers_count,
                openIssues: repoData.open_issues_count
            },
        })

        res.status(200).json({
            ...addedRepo,
            description: repoData.description,
            name: repoData.name,
            owner: repoData.owner.login,
            ownerHtmlUrl: repoData.owner.html_url,
            ownerAvatarUrl: repoData.owner.avatar_url,
            stars: repoData.stargazers_count,
            openIssues: repoData.open_issues_count,
            sponsor: (addedRepo.SponsoredRepository ?? { sponsor: { name: "" } }).sponsor.name,
            sponsored: req.body.sponsor
        });
        return;
    }
    return res.status(403).send("forbidden");
}
