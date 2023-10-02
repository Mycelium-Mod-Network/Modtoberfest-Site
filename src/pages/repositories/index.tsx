import Layout from "../../components/Layout";
import {GetStaticPropsResult} from "next";
import prisma from "../../lib/db";
import classNames from "classnames";
import PageTitle from "../../components/ui/PageTitle";
import {getRepos, shuffleArray} from "../../lib/utils";
import {IssueOpenedIcon, StarIcon, VerifiedIcon} from "@primer/octicons-react";
import LinkTo from "../../components/ui/LinkTo";
import {Repository} from "../../lib/Types";

function Repository(repo: Repository) {

    return <div className = "relative w-full sm:w-64 bg-black bg-opacity-10 border-2 p-2.5 even:bg-opacity-[15%] hover:border-orange-500 flex flex-col gap-y-2">
        {repo.sponsored &&
                <LinkTo href = "/sponsored" className = "absolute -top-4 -right-4">
                    <VerifiedIcon className = "w-7 h-7 navlink bg-brand-900"/></LinkTo>}
        <div className = "flex gap-x-2 pb-2 border-b-2">
            <div className = "my-auto w-10">
                <a href = {repo.ownerHtmlUrl} target = "_blank" rel = "noreferrer">
                    <img src = {repo.ownerAvatarUrl} alt = {repo.owner} className = "rounded-full"/> </a>
            </div>
            <div className = "flex flex-col group">
                <a href = {repo.ownerHtmlUrl} target = "_blank" rel = "noreferrer" className = "group-hover:text-orange-600 group-hover:-translate-y-px navlink">{repo.owner}</a>

                <a href = {repo.url} className = "navlink" target = "_blank" rel = "noreferrer">{repo.name}</a>
            </div>
        </div>
        <div className = "flex-grow break-words">
            <span className = {classNames({"italic": !repo.description})}>{repo.description || "No description provided"}</span>
        </div>

        <div className = "flex justify-between text-sm">
            <a href = {`${repo.url}/stargazers`} target = "_blank" rel = "noreferrer" className = "flex gap-x-1 px-2 no-underline rounded border hover:text-orange-500 hover:bg-black hover:bg-opacity-5 hover:border-orange-500">
                <StarIcon className = "my-auto w-4 h-4 text-yellow-500"/> <span className = "my-auto">
                    {repo.stars} stars
                </span>

            </a>

            <a href = {`${repo.url}/issues`} className = "flex gap-x-1 px-2 no-underline rounded border hover:text-orange-500 hover:bg-black hover:bg-opacity-5 hover:border-orange-500">
                <IssueOpenedIcon className = "my-auto w-4 h-4 text-green-500"/> <span className = "my-auto">
                    {repo.openIssues} Issue{repo.openIssues == 1 ? "" : "s"}
                </span>

            </a>
        </div>
    </div>;
}

export default function Home({repos}) {

    return (
            <Layout title = "Repositories" canonical = "/repositories" description = {"Repositories"}>

                <div className = "mx-auto max-w-[130ch]">

                    <PageTitle> Repositories </PageTitle>
                    <div className = "flex flex-wrap gap-8 justify-between">

                        {repos.map(repo => <Repository key = {repo.id} {...repo}/>)}
                    </div>
                </div>

            </Layout>
    );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<{ repos: Repository[] }>> {

    const repos: string[] = (await prisma.repository.findMany({
        select: {
            repository_id: true,
        },
        where: {
            valid: {
                equals: true
            }
        }
    })).map(repo => repo.repository_id);

    const fullRepos = await getRepos(repos);
    shuffleArray(fullRepos);

    const sorted = [];
    for (let repo of fullRepos) {
        if (sorted.length < 3 && repo.sponsored) {
            sorted.push(repo);
        }
    }
    for (let repo of fullRepos) {
        if (sorted.indexOf(repo) == -1) {
            sorted.push(repo);
        }
    }

    return {
        props: {
            repos: sorted
        },
        revalidate: 60

    };
}

