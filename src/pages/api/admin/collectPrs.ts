import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../lib/db";
import {Octokit} from "octokit";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {PullRequest} from "@octokit/webhooks-types";
import {info} from "../../../lib/discord-notifier";

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

const OCTOBER_START = new Date(Date.UTC(2023, 9, 1, 0, 0, 0));
const NOVEMBER_START = new Date(Date.UTC(2023, 10, 1, 0, 0, 0));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.body.secret !== process.env.ADMIN_SECRET) {
        return res.status(403).send("forbidden");
    }

    const repos = await prisma.repository.findMany({
        select: {
            cache: {
                select: {
                    owner: true,
                    name: true
                }
            }
        }
    })
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

        const allPulls: PullRequest[] = [];
        let page = 1;
        while (true) {
            const pagePulls = (await octokit.rest.pulls.list({
                owner: repo.cache.owner,
                repo: repo.cache.name,
                state: "all",
                per_page: 100,
                page: page++,
                sort: "created"
            })).data;
            const octoberPulls: PullRequest[] = pagePulls.filter(value => {
                const date = new Date(value.created_at);
                return date > OCTOBER_START && date < NOVEMBER_START;
            }) as any[]; // ts is dumb
            if (octoberPulls.length == 0) {
                break;
            } else {
                allPulls.push(...octoberPulls)
            }
        }

        for (let pull of allPulls) {
            const prData = getRepoData(pull);
            const existingId = existingIds[prData.pr_id];
            const isBot = pull.user.type === "Bot"
            const isInvalid = pull.labels.some(value => /.*(spam|invalid).*/.test(value.name))
            const prStatus = {
                invalid: isBot || isInvalid,
                reason: isBot ? "Pull requests was made by a bot account" : isInvalid ? "The repository owner has marked this PR as spam or invalid" : null,
                reviewed: isBot || isInvalid
            }
            if (!existingId) {
                const pr = await prisma.pullRequest.create({
                    data: {
                        ...prData
                    },
                    select: {
                        pr_id: true
                    }
                });
                await prisma.pullRequestStatus.create({
                    data: {
                        pr_id: pr.pr_id,
                        ...prStatus
                    }
                });
                if (!isBot) {
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
                }
            } else {
                const status = (await prisma.pullRequestStatus.findFirst({
                    select: {
                        invalid: true,
                        reason: true,
                        reviewed: true
                    },
                    where: {
                        pr_id: {
                            equals: prData.pr_id
                        }
                    }
                }))
                let newStatus = prStatus;
                if (status && status.reviewed) {
                    newStatus = status
                }

                await prisma.pullRequest.update({
                    data: {
                        id: existingId,
                        ...prData,
                        PullRequestStatus: {
                            upsert: {
                                create: newStatus,
                                update: newStatus
                            }
                        }
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
