import {ActionError, defineAction} from 'astro:actions';
import {z} from 'astro:schema';
import {isUserAdmin} from "@lib/util.ts";
import prisma from "@lib/db.ts";
import {Octokit} from "octokit";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";


export const repository = {
    create: defineAction({
        accept: 'form',
        input: z.object({
            owner: z.string(),
            name: z.string(),
            sponsor: z.string().optional(),
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }

            const {owner, name, sponsor} = input;

            const octokit = new Octokit({
                authStrategy: createOAuthAppAuth,
                auth: {
                    clientId: import.meta.env.GITHUB_ID,
                    clientSecret: import.meta.env.GITHUB_SECRET
                }
            });

            const data = (await octokit.rest.repos.get({owner: owner, repo: name})).data;
            if (data.archived) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Repository is archived",
                });
            }
            if (data.private) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Repository is private",
                });
            }
            await prisma.repository.create({
                data: {
                    repository_id: `${data.id}`,
                    submitter: user.id,
                    SponsoredRepository: sponsor ? {
                        create: {
                            sponsor_id: sponsor,
                        }
                    } : undefined,
                    cache: {
                        create: {
                            name: data.name,
                            owner: data.owner.login,
                            ownerHtmlUrl: data.owner.html_url,
                            ownerAvatarUrl: data.owner.avatar_url,
                            url: data.html_url,
                            description: data.description,
                            stars: data.stargazers_count,
                            openIssues: data.open_issues_count,
                            language: data.language ? {
                                connect: {
                                    name: data.language ?? ""
                                }
                            } : undefined,
                            license: data.license ? data.license.name : undefined
                        }
                    },
                    RepositoryStatus: {
                        create: {
                            reviewed_by: user.id,
                            reviewed: true,
                            invalid: false
                        }
                    }
                }
            })

            return `Ok`
        }
    }),
    delete: defineAction({
        accept: 'form',
        input: z.object({
            id: z.string()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }
            await prisma.repository.delete({
                where: {
                    repository_id: input.id,
                }
            })
            return `Ok`
        }
    }),
    approve: defineAction({
        accept: 'form',
        input: z.object({
            id: z.string()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }

            await prisma.repositoryStatus.update({
                data: {
                    invalid: false,
                    reviewed_by: user.id,
                    reviewed: true,
                    reason: null
                },
                where: {
                    repository_id: input.id,
                }
            })

            return `Ok`
        }
    }),
    deny: defineAction({
        accept: 'form',
        input: z.object({
            id: z.string(),
            reason: z.string()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }

            await prisma.repositoryStatus.update({
                data: {
                    invalid: true,
                    reviewed_by: user.id,
                    reason: input.reason,
                    reviewed: true
                },
                where: {
                    repository_id: input.id,
                }
            })

            return `Ok`
        }
    }),
    submit: defineAction({
        accept: 'form',
        input: z.object({
            repository_id: z.string(),
            tags: z.string().array()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!user) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Not logged in",
                });
            }

            const {repository_id, tags} = input;

            if(tags.length === 0) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "No tags selected",
                });
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
                return repo.id.toString() === repository_id
            })

            if (foundRepos.length === 0) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User does not have access to the repository!",
                });
            }

            const foundRepo = foundRepos[0];

            const exists = await prisma.repository.count({
                where: {
                    repository_id: repository_id
                }
            })
            if (exists) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Repository is already submitted!",
                });
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
                            updatedAt: foundRepo.pushed_at ? new Date(foundRepo.pushed_at) : undefined,
                        }
                    },
                    tags: {
                        createMany: {
                            data: tags.map(tag => {
                                return {tag_name: tag}
                            })
                        }
                    }
                }
            })

            return `Ok`
        }
    }),
    remove: defineAction({
        accept: 'form',
        input: z.object({
            repository_id: z.string()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!user) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Not logged in",
                });
            }

            const {repository_id} = input;

            const exists = await prisma.repository.count({
                where: {
                    repository_id: repository_id
                }
            })
            if (!exists) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Repository does not exist!",
                });
            }
            const sponsored = await prisma.sponsoredRepository.count({
                where: {
                    repository_id: repository_id
                }
            })
            if (sponsored) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Cannot remove a sponsored repository!",
                });
            }
            // The repo exists, so if this fails, it means the user does not have permission to remove the repo
            await prisma.repository.delete({
                select: {
                    repository_id: true
                },
                where: {
                    repository_id: repository_id,
                    OR: [
                        {user: null},
                        {
                            user: {
                                id: user.id
                            }
                        }
                    ]
                }
            })

            return `Ok`
        }
    }),
    tag: defineAction({
        accept: 'form',
        input: z.object({
            repository_id: z.string(),
            tags: z.string().array()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!user) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Not logged in",
                });
            }

            const {repository_id, tags} = input;

            const exists = await prisma.repository.count({
                where: {
                    repository_id: repository_id
                }
            })
            if (!exists) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Repository does not exist!",
                });
            }

            await prisma.repository.update({
                data: {
                    tags: {
                        createMany: {
                            data: tags.map(tag => {
                                return {tag_name: tag}
                            })
                        }
                    }
                },
                where: {
                    repository_id: repository_id
                }
            })

            return `Ok`
        }
    }),
    sponsor: defineAction({
        accept: 'form',
        input: z.object({
            repository_id: z.string(),
            sponsor_id: z.string()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!user) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Not logged in",
                });
            }

            const {repository_id, sponsor_id} = input;

            const exists = await prisma.repository.count({
                where: {
                    repository_id: repository_id
                }
            })
            if (!exists) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Repository does not exist!",
                });
            }

            await prisma.sponsoredRepository.create({
                data: {
                    repository_id,
                    sponsor_id
                }
            })

            return `Ok`
        }
    }),
    unsponsor: defineAction({
        accept: 'form',
        input: z.object({
            repository_id: z.string()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!user) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Not logged in",
                });
            }

            const {repository_id} = input;

            const exists = await prisma.repository.count({
                where: {
                    repository_id: repository_id
                }
            })
            if (!exists) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Repository does not exist!",
                });
            }

            await prisma.sponsoredRepository.delete({
                where: {
                    repository_id
                }
            })

            return `Ok`
        }
    })
}
