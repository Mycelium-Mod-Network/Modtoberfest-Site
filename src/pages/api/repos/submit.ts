import {unstable_getServerSession} from "next-auth";
import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "../auth/[...nextauth]";
import {getAccessToken} from "../../../lib/utils";
import prisma from "../../../lib/db";
import {Octokit} from "octokit";

type RepoInfo = { owner: string, repo_name: string, repository_id: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);
    const token = await getAccessToken(session);
    if (!session || !token) {
        return res.status(403).send("forbidden - No token!");
    }
    const octokit = new Octokit({
        auth: token
    });
    let repositoryId = req.body.repository_id;
    let page = 1;
    let foundRepo: RepoInfo = undefined
    while (true) {
        const foundRepos = (await octokit.rest.repos.listForAuthenticatedUser({
            visibility: "public",
            sort: "full_name",
            per_page: 100,
            page: page++
        })).data.map<RepoInfo>(repo => {
            return {
                repository_id: `${repo.id}`,
                repo_name: repo.name,
                owner: repo.owner.login,
            }
        })

        if (foundRepos.length == 0) {
            break;
        } else {
            let maybeRepo = foundRepos.find(value => value.repository_id === repositoryId)
            if (maybeRepo) {
                foundRepo = {owner: maybeRepo.owner, repo_name: maybeRepo.repo_name, repository_id: maybeRepo.repository_id}
                break;
            }
        }
    }
    if (!foundRepo) {
        return res.status(403).send("forbidden - User does not have access to the repo!");
    }

    const data = (await octokit.rest.repos.get({owner: foundRepo.owner, repo: foundRepo.repo_name})).data;
    const queryData = {
        repository_id: data.id.toString(),
        url: data.html_url,
    }
    const addedRepo = await prisma.repository.create({
        data: queryData,
        select: {
            id: true,
            repository_id: true,
            url: true
        }
    });
    const repoData = data;
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

    res.status(200).send("OK");
    return;
}
