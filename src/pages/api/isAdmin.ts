import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { isAdmin } from "../../lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (session) {
        return res.status(200).send(await isAdmin({ right: session }));
    } else {
        return res.status(200).send(false);
    }
}
