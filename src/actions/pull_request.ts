import {ActionError, defineAction} from 'astro:actions';
import {z} from 'astro:schema';
import {isUserAdmin} from "@lib/util.ts";
import prisma from "@lib/db.ts";

export const pull_request = {
    approve: defineAction({
        accept: 'form',
        input: z.object({
            id: z.number(),
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

            await prisma.pullRequest.update({
                data: {
                    PullRequestStatus: {
                        update: {
                            data: {
                                invalid: false,
                                reviewed: true,
                                reason: input.reason,
                                reviewed_by:  user.id,
                            }
                        }
                    }
                },
                where: {
                    pr_id: input.id
                }
            })

            return `Ok`
        }
    }),
    deny: defineAction({
        accept: 'form',
        input: z.object({
            id: z.number(),
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

            await prisma.pullRequest.update({
                data: {
                    PullRequestStatus: {
                        update: {
                            data: {
                                invalid: true,
                                reviewed: true,
                                reason: input.reason,
                                reviewed_by:  user.id,
                            }
                        }
                    }
                },
                where: {
                    pr_id: input.id
                }
            })

            return `Ok`
        }
    }),
    reset_status: defineAction({
        accept: 'form',
        input: z.object({
            id: z.number()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }

            await prisma.pullRequest.update({
                data: {
                    PullRequestStatus: {
                        update: {
                            data: {
                                invalid: false,
                                reviewed: false,
                                reason: null,
                                reviewed_by:  null,
                            }
                        }
                    }
                },
                where: {
                    pr_id: input.id
                }
            })

            return `Ok`
        }
    }),
}
