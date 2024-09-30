import {ActionError, defineAction} from 'astro:actions';
import {z} from 'astro:schema';
import {isUserAdmin} from "@lib/util.ts";
import prisma from "@lib/db.ts";


export const tag = {
    create: defineAction({
        accept: 'form',
        input: z.object({
            name: z.string(),
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }

            await prisma.tag.create({
                data: {
                    name: input.name,
                }
            })

            return `Ok`
        }
    }),
    delete: defineAction({
        accept: 'form',
        input: z.object({
            name: z.string()
        }),
        handler: async (input, context) => {
            const user = context.locals.user;
            if (!isUserAdmin(user)) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "User is not an admin",
                });
            }
            await prisma.tag.delete({
                where: {
                    name: input.name,
                }
            })
            return `Ok`
        }
    })
}