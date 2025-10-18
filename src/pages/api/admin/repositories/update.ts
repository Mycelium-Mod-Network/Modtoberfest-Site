import type {Repository as GHRepo} from "@octokit/webhooks-types";
import type {APIContext} from "astro";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {Octokit} from "octokit";
import prisma from "../../../../lib/db.ts";

export async function POST({request}: APIContext) {

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
            repository_id: true
        },
        where: {
            RepositoryStatus: {
                reviewed: true,
                invalid: false
            }
        }
    });
    const result: any = {}
    for (let repo of repos) {
        const repoData: GHRepo | { error: boolean, invalidate: boolean, reason: string } = await octokit.request("GET /repositories/{repository_id}", {repository_id: repo.repository_id}).then(value => {
            const data = value.data;

            if (data.disabled || data.archived) {
                return {error: false, invalidate: true, reason: "Repository is archived or disabled"}
            }
            return data;
        }).catch(reason => {
            const err = reason.response.data.message
            // We only want to invalidate if it isn't found
            return {error: true, invalidate: err === "Not Found", reason: err};
        })

        if ("error" in repoData && "invalidate" in repoData && "reason" in repoData) {
            if (repoData.invalidate) {
                await prisma.repository.update({
                    data: {
                        RepositoryStatus: {
                            update: {
                                invalid: true,
                                reason: `[AUTO] ${repoData.reason}`,
                                reviewed: true
                            }
                        }
                    },
                    where: {
                        repository_id: `${repo.repository_id}`
                    }
                })
            }
            result[repo.repository_id] = {
                error: repoData.error,
                reason: repoData.reason
            }
            continue;
        }

        await prisma.repository.update({
            data: {
                cache: {
                    upsert: {
                        create: {
                            name: repoData.name,
                            owner: repoData.owner.login,
                            ownerHtmlUrl: repoData.owner.html_url,
                            ownerAvatarUrl: repoData.owner.avatar_url,
                            url: repoData.html_url,
                            description: repoData.description,
                            stars: repoData.stargazers_count,
                            openIssues: repoData.has_issues ? repoData.open_issues_count : 0,
                            updatedAt: repoData.pushed_at as string,
                            license: repoData.license ? repoData.license.name : undefined,
                            language: repoData.language ? {
                                connect: {
                                    name: repoData.language ?? ""
                                }
                            } : undefined
                        },
                        update: {
                            name: repoData.name,
                            owner: repoData.owner.login,
                            ownerHtmlUrl: repoData.owner.html_url,
                            ownerAvatarUrl: repoData.owner.avatar_url,
                            url: repoData.html_url,
                            description: repoData.description,
                            stars: repoData.stargazers_count,
                            openIssues: repoData.has_issues ? repoData.open_issues_count : 0,
                            updatedAt: repoData.pushed_at as string,
                            language: repoData.language ? {
                                connect: {
                                    name: repoData.language ?? ""
                                }
                            } : undefined,
                            license: repoData.license ? repoData.license.name : undefined
                        }
                    }
                }
            },
            where: {
                repository_id: repo.repository_id
            }
        })
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(
        JSON.stringify(result), {
            status: 200
        }
    );
}
