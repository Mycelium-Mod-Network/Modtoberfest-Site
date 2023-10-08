import {Session} from "next-auth";
import prisma from "./db";
import {Account, BaseRepository, Either, Repository, RepositoryPageRepo} from "./Types";
import {Octokit} from "octokit";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {Repository as GHRepo} from "@octokit/webhooks-types";

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

export function repoToDisplayRepo(repo: Repository): RepositoryPageRepo {
    return {
        description: repo.description,
        id: repo.id,
        name: repo.name,
        openIssues: repo.openIssues,
        owner: repo.owner,
        repository_id: repo.repository_id,
        sponsor: repo.sponsor,
        sponsored: repo.sponsored,
        stars: repo.stars,
        updatedAt: repo.updatedAt,
        url: repo.url
    }
}

export async function getRepos(repository_ids: string[]): Promise<Repository[]> {
    const octokit = new Octokit({
        authStrategy: createOAuthAppAuth,
        auth: {
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }
    });

    const repos = await prisma.repository.findMany({
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
    })
    return await Promise.all(repos.map(async repo => {
        let cache = repo.cache;
        if (!cache) {
            const repoInfo = await octokit.request("GET /repositories/{repository_id}", {repository_id: repo.repository_id});
            const repoData: GHRepo = repoInfo.data;
            cache = {
                name: repoData.name,
                owner: repoData.owner.login,
                ownerHtmlUrl: repoData.owner.html_url,
                ownerAvatarUrl: repoData.owner.avatar_url,
                url: repoData.html_url,
                description: repoData.description,
                stars: repoData.stargazers_count,
                openIssues: repoData.open_issues_count,
                repository_id: repo.repository_id,
                id: repo.id,
                updatedAt: new Date(repoData.updated_at)
            }
        }


        return {
            id: repo.id,
            repository_id: repo.repository_id,
            url: repo.url,
            description: cache.description,
            name: cache.name,
            owner: cache.owner,
            ownerHtmlUrl: cache.ownerHtmlUrl,
            ownerAvatarUrl: cache.ownerAvatarUrl,
            stars: cache.stars,
            openIssues: cache.openIssues,
            sponsor: (repo.SponsoredRepository ?? {sponsor: {name: ""}}).sponsor.name,
            sponsored: !!repo.SponsoredRepository,
            updatedAt: formatDate(cache.updatedAt.getTime())
        };
    }));
}

export function formatDate(date: number){
    const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'short' });
    const deltaSeconds = Math.round((date - Date.now()) / 1000);
    const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

    const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"];
    const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));
    const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
    return rtf1.format(Math.floor(deltaSeconds / divisor), units[unitIndex])
}