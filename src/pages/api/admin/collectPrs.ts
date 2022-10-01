import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/db";
import { Octokit } from "octokit";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import { PullRequest } from "@octokit/webhooks-types";
import { info } from "../../../lib/discord-notifier";

function getRepoData(data) {

    return {
        "pr_id": data.id,
        "html_url": data.html_url,
        "number": data.number,
        "state": data.state,
        "title": data.title,
        "author": data.user.login,
        "author_id": data.user.id.toString(),
        "created_at": data.created_at,
        "owner": data.base.user.login,
        "owner_id": data.base.user.id.toString(),
        "owner_avatar_url": data.base.user.avatar_url,
        "repo_id": data.base.repo.id.toString(),
        "repo_name": data.base.repo.name,
        "merged": !!(data.merged_at ?? false)
    };
}

const OCTOBER_START = new Date(Date.UTC(2022, 9, 1, 0, 0, 0));
const OCTOBER_LAST = new Date(Date.UTC(2022, 9, 31, 0, 0, 0));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.body.secret !== process.env.ADMIN_SECRET) {
        return res.status(403).send("forbidden");
    }

    const repos = await prisma.repository.findMany({ select: { repository_id: true } });
    const octokit = new Octokit({
        authStrategy: createOAuthAppAuth,
        auth: {
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }
    });


    const existingIds = (await prisma.pullRequest.findMany({
        select: {
            id: true,
            pr_id: true
        }
    })).reduce((previousValue, currentValue) => {
        previousValue[currentValue.pr_id] = currentValue.id;
        return previousValue;
    }, {});

    for (let repo of repos) {
        const pulls: PullRequest[] = (await octokit.request("GET /repositories/{repository_id}/pulls?state=all", { repository_id: repo.repository_id })).data;
        const octoberPulls = pulls.filter(value => {
            const date = new Date(value.created_at);
            return date > OCTOBER_START && date < OCTOBER_LAST;
        });
        for (let pull of octoberPulls) {
            const prData = getRepoData(pull);
            const existingId = existingIds[prData.pr_id];

            if (!existingId) {
                await prisma.pullRequest.create({
                    data: prData
                });
                await info("New PR!", null, [
                    {
                        name: "Owner",
                        value: prData.owner
                    },
                    {
                        name: "Repo",
                        value: prData.repo_name
                    },
                    {
                        name: "Title",
                        value: prData.title
                    },
                    {
                        name: "Link",
                        value: prData.html_url
                    },
                    {
                        name: "Author",
                        value: prData.author
                    }
                ]);
            } else {
                await prisma.pullRequest.update({
                    data: {
                        id: existingId,
                        ...prData
                    },
                    where: {
                        id: existingId
                    }
                });
            }
        }
    }


    return res.status(200).send("ok");
}
