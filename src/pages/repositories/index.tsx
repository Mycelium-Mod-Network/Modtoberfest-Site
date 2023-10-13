import Layout from "../../components/Layout";
import {GetStaticPropsResult} from "next";
import prisma from "../../lib/db";
import classNames from "classnames";
import PageTitle from "../../components/ui/PageTitle";
import {getRepos, repoToDisplayRepo, shuffleArray} from "../../lib/utils";
import {IssueOpenedIcon, StarIcon, VerifiedIcon} from "@primer/octicons-react";
import LinkTo from "../../components/ui/LinkTo";
import {BaseOwner, OwnerCache, RepositoryPageRepo} from "../../lib/Types";

function Repository({owner, repo}: { owner: BaseOwner, repo: RepositoryPageRepo }) {

    return <div className = "relative w-full sm:w-64 bg-black bg-opacity-10 border-2 p-2.5 even:bg-opacity-[15%] hover:border-orange-500 flex flex-col gap-y-2">
        {repo.sponsored &&
                <LinkTo href = "/sponsored" className = "absolute -top-4 -right-4">
                    <VerifiedIcon className = "w-7 h-7 navlink bg-brand-900"/></LinkTo>}
        <div className = "flex gap-x-2 pb-2 border-b-2">
            <div className = "my-auto w-10">
                <a href = {owner.ownerHtmlUrl} target = "_blank" rel = "noreferrer">
                    <img src = {owner.ownerAvatarUrl} alt = {repo.owner} className = "rounded-full"/> </a>
            </div>
            <div className = "flex flex-col group">
                <a href = {owner.ownerHtmlUrl} target = "_blank" rel = "noreferrer" className = "group-hover:text-orange-600 group-hover:-translate-y-px navlink">{repo.owner}</a>

                <a href = {repo.url} className = "navlink" target = "_blank" rel = "noreferrer">{repo.name}</a>
            </div>
        </div>
        <div className = "flex-grow break-words">
            <p className = {classNames({"italic": !repo.description})}>{repo.description ? repo.description.substring(0, 100) + (repo.description.length > 100 ? "..." : "") : "No description provided"}</p>
        </div>

        <div className = "flex justify-between text-sm">
            <a href = {`${repo.url}/stargazers`} target = "_blank" rel = "noreferrer" className = "flex gap-x-1 px-2 no-underline rounded border hover:text-orange-500 hover:bg-black hover:bg-opacity-5 hover:border-orange-500">
                <StarIcon className = "my-auto w-4 h-4 text-yellow-500"/> <span className = "my-auto">
                    {repo.stars} stars
                </span>

            </a>

            <a href = {`${repo.url}/issues`} target = "_blank" rel = "noreferrer" className = "flex gap-x-1 px-2 no-underline rounded border hover:text-orange-500 hover:bg-black hover:bg-opacity-5 hover:border-orange-500">
                <IssueOpenedIcon className = "my-auto w-4 h-4 text-green-500"/> <span className = "my-auto">
                    {repo.openIssues} Issue{repo.openIssues == 1 ? "" : "s"}
                </span>

            </a>
        </div>
        <p className = "text-xs italic ">
            Last updated {repo.updatedAt}
        </p>
    </div>;
}

export default function Home({owners, repos}: { owners: OwnerCache, repos: RepositoryPageRepo[] }) {
    return (
            <Layout title = "Repositories" canonical = "/repositories" description = {"Repositories"}>

                <div className = "mx-auto max-w-[130ch]">

                    <PageTitle> Repositories </PageTitle>
                    <div className = "flex flex-wrap gap-8 justify-between">

                        {repos.map(repo => <Repository key = {repo.repository_id} owner = {owners[repo.owner]} repo = {repo}/>)}
                    </div>
                </div>

            </Layout>
    );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<{ owners: OwnerCache, repos: RepositoryPageRepo[] }>> {

    const repos: string[] = (await prisma.repository.findMany({
        select: {
            repository_id: true,
        },
        where: {
            RepositoryStatus: {
                invalid: {
                    equals: false
                },
                reviewed: {
                    equals: true
                }
            }
        }
    })).map(repo => repo.repository_id);

    const fullRepos = await getRepos(repos);
    shuffleArray(fullRepos);

    const owners: OwnerCache = {}
    const sorted: RepositoryPageRepo[] = [];
    const inserted = []
    for (let repo of fullRepos) {
        if (sorted.length < 3) {
            if (repo.sponsored) {
                sorted.push(repoToDisplayRepo(repo));
                inserted.push(repo.repository_id)
            }
        } else {
            break;
        }
    }
    for (let repo of fullRepos) {
        const toInsert = repoToDisplayRepo(repo);
        if (inserted.indexOf(toInsert.repository_id) === -1) {
            sorted.push(toInsert);
            inserted.push(repo.repository_id);
        }
        if (!owners[repo.owner]) {
            owners[repo.owner] = owners[repo.owner] ?? {
                ownerHtmlUrl: repo.ownerHtmlUrl,
                ownerAvatarUrl: repo.ownerAvatarUrl
            }
        }
    }

    return {
        props: {
            owners: owners,
            repos: sorted.map(value => ({...value, id: null, sponsor: null}))
        },
        revalidate: 60

    };
}

