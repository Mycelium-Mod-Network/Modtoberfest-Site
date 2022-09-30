import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.body.secret === process.env.ADMIN_SECRET) {
        await prisma.participant.update({
            data: {
                admin: true
            },
            where: {
                accountId: req.body.id
            }
        });
        return res.status(200).send("You have the power");
    }

    return res.status(403).send("Try again later, but please don't, you won't get the password");
}
