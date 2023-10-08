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

    const invalid = (await prisma.repositoryStatus.findFirst({
        select: {
            invalid: true
        },
        where: {
            repository_id: {
                equals: `${foundRepo.repository_id}`
            },
            invalid: {
                equals: true
            }
        }
    }) ?? {invalid: false}).invalid

    if (invalid) {
        return res.status(403).send("forbidden - Denied repositories state cannot be changed!")
    }

    await prisma.repository.delete({
        where: {
            repository_id: foundRepo.repository_id
        }
    })
    res.status(200).send("OK");
    return;
}
