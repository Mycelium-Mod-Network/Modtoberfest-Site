import {unstable_getServerSession} from "next-auth";
import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "../../auth/[...nextauth]";
import {isAdmin} from "../../../../lib/utils";
import prisma from "../../../../lib/db";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {Octokit} from "octokit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (await isAdmin({right: session})) {

        const octokit = new Octokit({
            authStrategy: createOAuthAppAuth,
            auth: {
                clientId: process.env.GITHUB_ID,
                clientSecret: process.env.GITHUB_SECRET
            }
        });

        const data = (await octokit.rest.repos.get({owner: req.body.owner, repo: req.body.repo_name})).data;
        const queryData = {
            repository_id: data.id.toString(),
            url: data.html_url,
            valid: true
        }
        if (req.body.sponsor) {
            queryData["SponsoredRepository"] = {
                create: {
                    sponsor_id: req.body.sponsor
                }
            }
        }
        const addedRepo = await prisma.repository.create({
            data: {
                ...queryData,
                RepositoryStatus: {
                    create: {
                        reason: null,
                        invalid: false,
                        reviewed: false
                    }
                }
            },
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

        await prisma.repositoryCache.upsert({
            where: {
                repository_id: addedRepo.repository_id,
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
                repository_id: addedRepo.repository_id,
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

        res.status(200).json({
            ...addedRepo,
            description: data.description,
            name: data.name,
            owner: data.owner.login,
            ownerHtmlUrl: data.owner.html_url,
            ownerAvatarUrl: data.owner.avatar_url,
            stars: data.stargazers_count,
            openIssues: data.open_issues_count,
            sponsor: (addedRepo.SponsoredRepository ?? {sponsor: {name: ""}}).sponsor.name,
            sponsored: req.body.sponsor
        });
        return;
    }
    return res.status(403).send("forbidden");
}
