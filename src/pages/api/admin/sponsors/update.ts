import { unstable_getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../auth/[...nextauth]";
import { isAdmin } from "../../../../lib/utils";
import prisma from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (await isAdmin({ right: session })) {
        const { id, ...body } = req.body;
        const sponsor = await prisma.sponsor.update({
            data: body,
            where: {
                id: id
            }
        });
        res.status(200).json({ id: sponsor.id });
        return;
    }
    return res.status(403).send("forbidden");
}
