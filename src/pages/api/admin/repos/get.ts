import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.body.secret !== process.env.ADMIN_SECRET) {
        return res.status(403).send("forbidden");
    }

    res.status(200).json(await prisma.repositoryCache.findFirst({
        where: {
            repository_id: req.body.repository_id
        }
    }));
}
