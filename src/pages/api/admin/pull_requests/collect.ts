import type {PullRequest} from "@octokit/webhooks-types";
import type {APIContext} from "astro";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {Octokit} from "octokit";
import prisma from "@lib/db.ts";
import {info} from "@lib/discord-notifier.ts";


function getRepoData(data: PullRequest) {

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
        "merged": !!(data.merged_at ?? false)
    };
}

const OCTOBER_START = new Date(Date.UTC(2025, 9, 1, 0, 0, 0) - (12 * 60 * 60 * 1000));
const NOVEMBER_START = new Date(Date.UTC(2025, 10, 1, 12, 0, 0));

export async function POST({params, request}: APIContext) {

    const body = await request.json();
    if (body.secret !== import.meta.env.ADMIN_SECRET) {
        return new Response("forbidden", {
            status: 404
        })
    }

    const octokit = new Octokit({
        authStrategy: createOAuthAppAuth,
        auth: {
            clientId: import.meta.env.GITHUB_ID,
            clientSecret: import.meta.env.GITHUB_SECRET
        }
    });

    const repos = await prisma.repository.findMany({
        select: {
            cache: {
                select: {
                    owner: true,
                    name: true
                }
            }
        },
        where: {
            RepositoryStatus: {
                reviewed: true,
                invalid: false
            }
        }
    })

    const existingIds = (await prisma.pullRequest.findMany({
        select: {
            id: true,
            pr_id: true
        }
    })).reduce<Record<number, string>>((previousValue, currentValue) => {
        previousValue[Number(currentValue.pr_id)] = currentValue.id;
        return previousValue;
    }, {});

    for (let repo of repos) {

        const allPulls: PullRequest[] = [];
        let page = 1;
        // We only want this to run if the cache exists, used to be while true
        while (repo.cache) {
            const pagePulls = (await octokit.rest.pulls.list({
                owner: repo.cache.owner,
                repo: repo.cache.name,
                state: "all",
                per_page: 100,
                page: page++,
                sort: "created",
                direction: "desc"
            })).data as PullRequest[];
            const octoberPulls = pagePulls.filter(value => {
                const date = new Date(value.created_at);
                return date > OCTOBER_START && date < NOVEMBER_START;
            });
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
            const ownerOrCollab = pull.author_association === "OWNER" || pull.author_association === "COLLABORATOR" || pull.author_association === "MEMBER"
            const isInvalid = pull.labels.some(value => /.*(spam|invalid).*/.test(value.name))
            let reason = null;
            if (isBot) {
                reason = "Pull request was made by a bot account."
            }
            if (ownerOrCollab) {
                reason = "Pull requests for your own projects or projects you maintain will not count towards your progress in the challenge."
            }
            if (isInvalid) {
                reason = "Pull request has been marked as spam or invalid."
            }

            const prStatus = {
                invalid: reason !== null,
                reason: reason,
                reviewed: reason !== null
            }
            if (!existingId) {
                const pr = await prisma.pullRequest.create({
                    data: {
                        ...prData,
                        PullRequestStatus: {
                            create: prStatus
                        },
                        Repository: {
                            connect: {
                                repository_id: pull.base.repo.id.toString()
                            }
                        }
                    },
                    select: {
                        pr_id: true
                    }
                });
                if (!isBot && repo.cache) {
                    await info("New PR!", null, [
                        {
                            name: "Owner",
                            value: prData.owner
                        },
                        {
                            name: "Repo",
                            value: repo.cache.name
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


    return new Response(
        "Ok", {
            status: 200
        }
    );
}

