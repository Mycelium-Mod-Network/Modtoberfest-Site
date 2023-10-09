import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.body.secret !== process.env.ADMIN_SECRET) {
        return res.status(403).send("forbidden");
    }

    const missingPrs = (await prisma.pullRequest.findMany({
        select: {
            pr_id: true
        },
        where: {
            PullRequestStatus: null
        }
    }))

    for (let pr of missingPrs) {
        (await prisma.pullRequestStatus.upsert({
            create: {
                pr_id: pr.pr_id,
                invalid: false,
                reviewed: false,
                reason: null
            },
            update: {},
            where: {
                pr_id: pr.pr_id
            }
        }))
    }

    const missingRepos = (await prisma.repository.findMany({
        select: {
            repository_id: true
        },
        where: {
            RepositoryStatus: null
        }
    }))

    for (let repo of missingRepos) {
        (await prisma.repositoryStatus.upsert({
            create: {
                repository_id: repo.repository_id,
                invalid: false,
                reviewed: false,
                reason: null
            },
            update: {},
            where: {
                repository_id: repo.repository_id
            }
        }))
    }


    return res.status(200).send("ok");
}
