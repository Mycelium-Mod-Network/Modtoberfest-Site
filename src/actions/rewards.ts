import {ActionError, defineAction} from 'astro:actions';
import {z} from 'astro:schema';
import {isUserAdmin} from "@lib/util.ts";
import prisma from "@lib/db.ts";


export const rewards = {
    create: defineAction({
        accept: 'form',
        input: z.object({
            title: z.string(),
            summary: z.string(),
            description: z.string(),
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


            const {title, summary, description, logo_url, banner_url, digital, sponsor_id} = input
            await prisma.reward.create({
                data: {
                    title,
                    summary,
                    description,
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

            const {title, summary, description, logo_url, banner_url, digital, sponsor_id} = input
            await prisma.reward.update({
                data: {
                    title,
                    summary,
                    description,
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
            codes: z.string().array()
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

            await prisma.reward.updateMany({
                data: {

                },
                where:{
                    id: id
                }
            })

            return `Ok`
        }
    }),
}