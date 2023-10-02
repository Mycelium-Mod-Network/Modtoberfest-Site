import {unstable_getServerSession} from "next-auth";
import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "../../auth/[...nextauth]";
import {isAdmin} from "../../../../lib/utils";
import prisma from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (await isAdmin({right: session})) {
        const repo = await prisma.repository.delete({
            where: {
                id: req.body.id
            }
        });
        await prisma.repositoryCache.delete({
            where: {
                repository_id: repo.repository_id
            }
        })
        res.status(200).json({id: repo.id});
        return;
    }
    return res.status(403).send("forbidden");
}
