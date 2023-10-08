import {unstable_getServerSession} from "next-auth";
import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "../../auth/[...nextauth]";
import {isAdmin} from "../../../../lib/utils";
import prisma from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (await isAdmin({right: session})) {
        const repository_id = req.body.repository_id;
        await prisma.repositoryStatus.update({
            data: {
                reviewed: true,
                reason: req.body.reason.length == 0 ? null : req.body.reason,
                invalid: req.body.invalid
            },
            where: {
                repository_id: repository_id
            }
        })

        res.status(200).json(repository_id);
        return;
    }
    return res.status(403).send("forbidden");
}
