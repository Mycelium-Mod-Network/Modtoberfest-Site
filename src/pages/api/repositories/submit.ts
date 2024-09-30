import type {APIContext} from "astro";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {Octokit} from "octokit";
import prisma from "@lib/db.ts";

export async function POST({params, request, locals}: APIContext) {

    const body = await request.json();
    const user = locals.user
    if (!user) {
        return new Response("forbidden", {
            status: 404
        })
    }
    const {repository_id, tags} = body;
    if (!repository_id || !tags || tags.length === 0) {
        return new Response("bad request", {
            status: 400
        })
    }

    const octokit = new Octokit({
        auth: user.access_token
    });

    const userRepos = (await octokit.paginate("GET /user/repos", {
        visibility: "public",
        sort: "full_name",
        per_page: 100
    }))

    const foundRepos = userRepos.filter(repo => {
        // github returns a number, we store it as a string, so we want the type ignoring check
        return repo.id == repository_id
    })

    if(foundRepos.length === 0) {
        return new Response("User does not have access to the repository!", {
            status: 403
        })
    }

    const foundRepo = foundRepos[0];

    const exists = await prisma.repository.count({
        where: {
            repository_id: repository_id
        }
    })
    if(exists) {
        return new Response("Repository is already submitted!", {
            status: 400
        })
    }
    await prisma.repository.create({
        data: {
            repository_id: foundRepo.id.toString(),
            user: {
                connect: {
                    id: user.id
                }
            },
            RepositoryStatus: {
                create: {
                    invalid: false,
                    reviewed: false
                }
            },
            cache: {
                create: {
                    name: foundRepo.name,
                    owner: foundRepo.owner.login,
                    ownerHtmlUrl: foundRepo.owner.html_url,
                    ownerAvatarUrl: foundRepo.owner.avatar_url,
                    url: foundRepo.html_url,
                    description: foundRepo.description,
                    stars: foundRepo.stargazers_count,
                    openIssues: foundRepo.open_issues_count,
                    language: foundRepo.language ? {
                        connect: {
                            name: foundRepo.language ?? ""
                        }
                    } : undefined,
                    license: foundRepo.license ? foundRepo.license.name : undefined,
                    updatedAt: foundRepo.updated_at ? new Date(foundRepo.updated_at) : undefined,
                }
            }
        }
    })
    return new Response(
        JSON.stringify({
            submitted:true
        }), {
            status: 200
        }
    );
}