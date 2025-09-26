import {ActionError, defineAction} from 'astro:actions';
import {z} from 'astro:schema';
import {isUserAdmin} from "@lib/util.ts";
import prisma from "@lib/db.ts";


export const sponsor = {
    create: defineAction({
        accept: 'form',
        input: z.object({
            name: z.string(),
            summary: z.string(),
            image_url: z.string(),
            website: z.string().optional(),
            github: z.string().optional(),
            twitter: z.string().optional(),
            bluesky: z.string().optional(),
            discord: z.string().optional(),
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }
            const links = [];
            if (input.website) {
                links.push({
                    name: "website",
                    value: input.website
                });
            }
            if (input.github) {
                links.push({
                    name: "github",
                    value: input.github
                });
            }
            if (input.twitter) {
                links.push({
                    name: "twitter",
                    value: input.twitter
                });
            }
            if (input.bluesky) {
                links.push({
                    name: "bluesky",
                    value: input.bluesky
                });
            }
            if (input.discord) {
                links.push({
                    name: "discord",
                    value: input.discord
                });
            }

            await prisma.sponsor.create({
                select: {
                    id: true
                },
                data: {
                    name: input.name,
                    image_url: input.image_url,
                    summary: input.summary,
                    links: {
                        createMany: {
                            data: links,
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
            await prisma.sponsor.delete({
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
            name: z.string(),
            summary: z.string(),
            image_url: z.string(),
            website: z.string().optional(),
            github: z.string().optional(),
            twitter: z.string().optional(),
            bluesky: z.string().optional(),
            discord: z.string().optional(),
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }

            const links = [];
            if (input.website) {
                links.push({
                    name: "website",
                    value: input.website
                });
            }
            if (input.github) {
                links.push({
                    name: "github",
                    value: input.github
                });
            }
            if (input.twitter) {
                links.push({
                    name: "twitter",
                    value: input.twitter
                });
            }
            if (input.bluesky) {
                links.push({
                    name: "bluesky",
                    value: input.bluesky
                });
            }
            if (input.discord) {
                links.push({
                    name: "discord",
                    value: input.discord
                });
            }

            await prisma.sponsorLinks.deleteMany({
                where: {sponsor_id: input.id}
            })

            await prisma.sponsor.update({
                data: {
                    name: input.name,
                    image_url: input.image_url,
                    summary: input.summary,
                    links: {
                        createMany: {
                            data: links
                        }
                    }
                },
                where: {
                    id: input.id,
                }
            })

            return `Ok`
        }
    })
}
