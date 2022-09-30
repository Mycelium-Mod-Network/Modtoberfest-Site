import { Session } from "next-auth";
import prisma from "./db";
import { Account, Either } from "./Types";

export async function isAdmin(data: Either<string, Session>) {

    const account = await getAccount(data);

    return account.admin;
}

export async function getAccessToken(session: Session) {
    return (await prisma.account.findFirstOrThrow({
        select: {
            access_token: true
        },
        where: {
            user: {
                email: session.user.email
            }
        }
    })).access_token;
}


export async function getAccount(data: Either<string, Session>): Promise<Account> {
    let workingToken;
    if (data.left) {
        workingToken = data.left;
    } else {
        workingToken = await getAccessToken(data.right);
    }
    const details = await prisma.account.findFirst({
        select: {
            id: true,
            providerAccountId: true,
            user: {
                select: {
                    name: true,
                    image: true
                }
            },
            Participant: {
                select: {
                    admin: true
                }
            }
        },
        where: {
            access_token: workingToken
        }
    });
    return {
        id: details.id,
        githubId: details.providerAccountId,
        name: details.user.name,
        admin: details.Participant.admin,
        image: details.user.image
    };
}

export async function getBasicAccountInfo(data: Either<string, Session>): Promise<{ name: string, id: string, githubId: string }> {
    let workingToken;
    if (data.left) {
        workingToken = data.left;
    } else {
        workingToken = await getAccessToken(data.right);
    }
    const details = await prisma.account.findFirst({
        select: {
            user: {
                select: {
                    name: true
                }
            },
            id: true,
            providerAccountId: true
        },
        where: {
            access_token: workingToken
        }
    });
    return { name: details.user.name, id: details.id, githubId: details.providerAccountId };
}


export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}