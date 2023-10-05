import {unstable_getServerSession} from "next-auth";
import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "../../auth/[...nextauth]";
import {isAdmin} from "../../../../lib/utils";
import prisma from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (await isAdmin({right: session})) {
        const pr_id = req.body.pr_id;
        await prisma.pullRequestStatus.update({
            data: {
                reviewed: true,
                reason: req.body.reason.length == 0 ? null : req.body.reason,
                invalid: req.body.invalid
            },
            where: {
                pr_id: pr_id
            }
        })


        return res.status(200).send("OK");
    }
    return res.status(403).send("forbidden");
}
