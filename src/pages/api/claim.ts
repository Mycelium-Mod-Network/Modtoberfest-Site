import { unstable_getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getAccount, isAdmin } from "../../lib/utils";
import prisma from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);
    const account = await getAccount({ right: session });
    const hasClaim = await prisma.claim.count({
        where: {
            account_id: account.id
        }
    });
    if(hasClaim){
        return res.status(400).send("Unable to claim multiple times!")
    } else {
        const data = (await prisma.claim.create({
            data: {
                account_id: account.id,
                ...req.body
            }
        }))
        return res.status(200).send({claimId: data.id})
    }
}