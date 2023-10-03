import {unstable_getServerSession} from "next-auth";
import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "../../auth/[...nextauth]";
import {isAdmin} from "../../../../lib/utils";
import prisma from "../../../../lib/db";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {Octokit} from "octokit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (await isAdmin({right: session})) {
        const repository_id = req.body.repository_id;
        await prisma.repository.update({
            data: {
                valid: true
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
