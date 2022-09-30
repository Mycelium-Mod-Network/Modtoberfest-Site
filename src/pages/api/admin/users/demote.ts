import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { isAdmin } from "../../../../lib/utils";
import prisma from "../../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (await isAdmin({ right: session })) {
        await prisma.participant.update({
            data: {
                admin: false
            },
            where: {
                id: req.body.id
            }
        });
        return res.status(200).send("OK");
    }
    return res.status(403).send("forbidden");
}
