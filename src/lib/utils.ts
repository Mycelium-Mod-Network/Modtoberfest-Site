import {Session} from "next-auth";
import prisma from "./db";
import {Account, BaseRepository, Either, Repository} from "./Types";

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
    let workingToken: string;
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
    return {name: details.user.name, id: details.id, githubId: details.providerAccountId};
}


export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export async function getRepo(repository_id: string) {
    return await prisma.repositoryCache.findFirst({
        where: {
            repository_id: repository_id
        }
    })
}

export async function getRepos(repository_ids: string[]): Promise<Repository[]> {

    return (await prisma.repository.findMany({
        select: {
            id: true,
            repository_id: true,
            url: true,
            SponsoredRepository: {
                select: {
                    sponsor: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            cache: true
        },
        where: {
            repository_id: {
                in: repository_ids
            }
        }
    })).map(repo => {
        return {
            id: repo.id,
            repository_id: repo.repository_id,
            url: repo.url,
            description: repo.cache.description,
            name: repo.cache.name,
            owner: repo.cache.owner,
            ownerHtmlUrl: repo.cache.ownerHtmlUrl,
            ownerAvatarUrl: repo.cache.ownerAvatarUrl,
            stars: repo.cache.stars,
            openIssues: repo.cache.openIssues,
            sponsor: (repo.SponsoredRepository ?? {sponsor: {name: ""}}).sponsor.name,
            sponsored: !!repo.SponsoredRepository
        };
    })
}