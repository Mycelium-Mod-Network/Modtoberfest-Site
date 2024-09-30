import {ActionError, defineAction} from 'astro:actions';
import {z} from 'astro:schema';
import {isUserAdmin} from "@lib/util.ts";
import prisma from "@lib/db.ts";

export const user = {
    promote: defineAction({
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
            await prisma.user.update({
                data: {
                    admin: true
                },
                where: {
                    id: input.id,
                }
            })
            return `Ok`
        }
    }),
    demote: defineAction({
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
            await prisma.user.update({
                data: {
                    admin: false
                },
                where: {
                    id: input.id,
                }
            })
            return `Ok`
        }
    })
}