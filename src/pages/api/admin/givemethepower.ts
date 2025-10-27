import type {APIContext} from "astro";
import prisma from "../../../lib/db";

export async function POST({request}: APIContext) {
    const body = await request.json();

    if (import.meta.env.ADMIN_SECRET !== "" && body.secret !== import.meta.env.ADMIN_SECRET) {
        return new Response(null, {
            status: 404
        })
    }

    await prisma.user.update({
        data: {
            admin: true
        },
        where: {
            github_id: Number(body.github_id)
        }
    })
    return new Response("You have the power!", {
        status: 200
    })
}