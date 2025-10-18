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

    const ids = body.ids;

    const result: any = {}
    for (let id of ids) {
        try {
            const repoData: GHRepo | { error: boolean, reason: string } = await octokit.request("GET /repositories/{repository_id}", {repository_id: id}).then(value => {
                return value.data;
            }).catch(reason => {
                const err = reason.response.data.message
                return {error: true, reason: err};
            })
            if ("error" in repoData && "reason" in repoData) {
                result[id] = {
                    error: true,
                    reason: repoData.reason
                }
                continue;
            }
            await prisma.repository.upsert({
                create: {
                    repository_id: `${repoData.id}`,
                    cache: {
                        create: {
                            name: repoData.name,
                            owner: repoData.owner.login,
                            ownerHtmlUrl: repoData.owner.html_url,
                            ownerAvatarUrl: repoData.owner.avatar_url,
                            url: repoData.html_url,
                            description: repoData.description,
                            stars: repoData.stargazers_count,
                            openIssues: repoData.has_issues ? repoData.open_issues_count : 0,
                            language: repoData.language ? {
                                connect: {
                                    name: repoData.language ?? ""
                                }
                            } : undefined,
                            license: repoData.license ? repoData.license.name : undefined
                        }
                    },
                    RepositoryStatus: {
                        create: {
                            invalid: false,
                            reviewed: true,
                        }
                    }
                },
                update: {
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
                    repository_id: `${repoData.id}`
                }
            })
        } catch (e: any) {
            console.log(e);
        }
    }

    return new Response(
        JSON.stringify(result), {
            status: 200
        }
    );
}
