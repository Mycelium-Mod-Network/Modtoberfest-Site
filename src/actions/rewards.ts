import {ActionError, defineAction} from 'astro:actions';
import {z} from 'astro:schema';
import {errorIf, isUserAdmin, require} from "@lib/util.ts";
import prisma from "@lib/db.ts";


export const rewards = {
    create: defineAction({
        accept: 'form',
        input: z.object({
            title: z.string(),
            summary: z.string(),
            description: z.string(),
            redeem_info: z.string().optional(),
            logo_url: z.string(),
            banner_url: z.string(),
            digital: z.boolean(),
            sponsor_id: z.string()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }


            const {title, summary, description, redeem_info, logo_url, banner_url, digital, sponsor_id} = input
            await prisma.reward.create({
                data: {
                    title,
                    summary,
                    description,
                    redeem_info,
                    logo_url,
                    banner_url,
                    digital,
                    sponsor_id,
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
            await prisma.reward.delete({
                where: {
                    id: input.id,
                }
            })
            return `Ok`
        }
    }),
    edit: defineAction({
        accept: 'form',
        input: z.object({
            id: z.string(),
            title: z.string(),
            summary: z.string(),
            description: z.string(),
            redeem_info: z.string().optional(),
            logo_url: z.string(),
            banner_url: z.string(),
            digital: z.boolean(),
            sponsor_id: z.string()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }

            const {title, summary, description, redeem_info, logo_url, banner_url, digital, sponsor_id} = input
            await prisma.reward.update({
                data: {
                    title,
                    summary,
                    description,
                    redeem_info: redeem_info ?? null,
                    logo_url,
                    banner_url,
                    digital,
                    sponsor_id,
                },
                where: {
                    id: input.id
                }
            })

            return `Ok`
        }
    }),
    add_codes: defineAction({
        accept: 'form',
        input: z.object({
            id: z.string(),
            codes: z.string()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }

            const {id, codes} = input

            await prisma.digitalRewardCodes.createMany({
                data: codes.split("\n").map((code: string) => {
                    return {code: code.trim(), reward_id: id}
                })
            })

            return `Ok`
        }
    }),
    claim_digital: defineAction({
        accept: 'form',
        input: z.object({
            id: z.string()
        }),
        handler: async (input, context) => {
            const {id} = input;
            const user = require(context.locals.user, "UNAUTHORIZED", "User is not logged in");
            errorIf(!user, "UNAUTHORIZED", "User is not logged in")
            const reward = require(await prisma.reward.findUnique({
                select: {
                    id: true,
                    digital: true,
                    required_prs: true,
                    DigitalRewardCodes: {
                        where: {
                            ClaimedCode: {
                                claimer_id: user.id
                            }
                        }
                    },
                    PhysicalRewardClaim: true
                }, where: {id}
            }), "BAD_REQUEST", "No reward for given id")
            errorIf((reward.DigitalRewardCodes.length + reward.PhysicalRewardClaim.length) > 0, "FORBIDDEN", "Unable to claim the same reward multiple times!")
            errorIf(!reward.digital, "BAD_REQUEST", "Reward is not digital!")

            const github_id = require(await prisma.user.findUnique({
                select: {
                    github_id: true
                },
                where: {
                    id: user.id
                }
            }).then(value => value?.github_id), "BAD_REQUEST", "User is not linked to github") // this error should never happen
            const validPrs = await prisma.pullRequest.count({
                where: {
                    author_id: `${github_id}`,
                    PullRequestStatus: {
                        reviewed: true,
                        invalid: false
                    }
                }
            })
            errorIf(validPrs < reward.required_prs, "UNAUTHORIZED", "User doesn't have enough valid PRs")
            const code = require(await prisma.digitalRewardCodes.findFirst({
                select: {
                    id: true,
                    code: true
                },
                where: {
                    ClaimedCode: null,
                    reward_id: id
                }
            }), "BAD_REQUEST", "No free codes found for this reward! Please reach out on discord!")

            await prisma.digitalRewardCodes.update({
                data: {
                    ClaimedCode: {
                        create: {
                            claimer_id: user.id
                        }
                    }
                },
                where: {
                    id: code.id
                }
            })

            return `Ok`
        }
    }),
    claim_physical: defineAction({
        accept: 'form',
        input: z.object({
            id: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            address1: z.string(),
            address2: z.string().optional(),
            city: z.string(),
            zip: z.string(),
            state: z.string(),
            country: z.string(),
            email: z.string().email(),
            phone: z.string().optional()

        }),
        handler: async (input, context) => {
            const {id, firstName, lastName, address1, address2, city, zip, state, country, email, phone} = input;
            const user = require(context.locals.user, "UNAUTHORIZED", "User is not logged in");
            errorIf(!user, "UNAUTHORIZED", "User is not logged in")
            const reward = require(await prisma.reward.findUnique({
                select: {
                    id: true,
                    digital: true,
                    required_prs: true,

                    DigitalRewardCodes: {
                        where: {
                            ClaimedCode: {
                                claimer_id: user.id
                            }
                        }
                    },
                    PhysicalRewardClaim: true
                }, where: {id}
            }), "BAD_REQUEST", "No reward for given id")
            errorIf((reward.DigitalRewardCodes.length + reward.PhysicalRewardClaim.length) > 0, "FORBIDDEN", "Unable to claim the same reward multiple times!")
            errorIf(reward.digital, "BAD_REQUEST", "Reward is not physical!")

            const github_id = require(await prisma.user.findUnique({
                select: {
                    github_id: true
                },
                where: {
                    id: user.id
                }
            }).then(value => value?.github_id), "BAD_REQUEST", "User is not linked to github") // this error should never happen
            const validPrs = await prisma.pullRequest.count({
                where: {
                    author_id: `${github_id}`,
                    PullRequestStatus: {
                        reviewed: true,
                        invalid: false
                    }
                }
            })
            errorIf(validPrs < reward.required_prs, "UNAUTHORIZED", "User doesn't have enough valid PRs")

            await prisma.physicalRewardClaim.create({
                data: {
                    reward_id: id,
                    firstName,
                    lastName,
                    address1,
                    address2,
                    city,
                    zip,
                    state,
                    country,
                    email,
                    phoneNumber: phone,
                    claimer_id: user.id
                }
            })

            return `Ok`
        }
    }),
}