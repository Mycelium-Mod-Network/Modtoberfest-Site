import Layout from "../components/Layout";
import {getSession} from "next-auth/react";
import PageTitle from "../components/ui/PageTitle";
import {getAccount} from "../lib/utils";
import {Account} from "../lib/Types";
import ProgressBar from "@ramonak/react-progress-bar";
import prisma from "../lib/db";
import {GetServerSidePropsResult} from "next";
import {GitMergeIcon, GitPullRequestClosedIcon, GitPullRequestIcon} from "@primer/octicons-react";
import LinkTo from "../components/ui/LinkTo";

interface PR {
    html_url: string;
    created_at: number;
    merged: boolean;
    number: number;
    owner_avatar_url: string;
    repo_name: string;
    repo_id: string;
    pr_id: number;
    title: string;
    state: string;
    owner: string;
}

function generateLabel(prs: number): string {
    switch (prs) {
        case 0:
            return "No detected pull requests.";
        case 1:
            return "Now you're getting somewhere! Only 3 left!";
        case 2:
            return "Half way!";
        case 3:
            return "One more to go!";
        default:
            return "You've completed Modtoberfest!";
    }
}

export default function Me({account, prs, loggedOut}: ({ account: Account, prs: PR[], loggedOut?: boolean })) {

    return <Layout title = "Profile" canonical = "/me" description = {"Your Modtoberfest profile"}>

        <PageTitle>
            <div className = "flex flex-col gap-y-4">
                <div className = "flex">
                    <img
                            src = {account.image}
                            width = "50"
                            className = "mr-3 mb-2 rounded-full"
                            alt = "avatar"
                    />

                    <span className = "my-auto">
                        {account.name}
                    </span>
                </div>

            </div>
        </PageTitle>

        <div className = "flex flex-col gap-y-4">
            <h1 className = "text-2xl font-semibold text-center">
                Here you can see your progress throughout the event
            </h1>


            <h2 className = "text-2xl text-center font-semibold">
                {prs.length} / 4 Completed PRs
            </h2>

            {prs.length >= 4 && <h3 className = "text-xl text-center font-semibold flex flex-col flex-center mx-auto">
                <span>
                    You've completed the event!
                </span> <LinkTo href = "/claim"> Claim your prize here! </LinkTo>
            </h3>}
            <div className = "flex flex-col gap-y-2">
                <span className = "text-lg font-semibold text-center">
                    {generateLabel(prs.length)}
                </span>

                <ProgressBar completed = {prs.length} maxCompleted = {4} bgColor = "#fb923c" isLabelVisible = {false}/>
            </div>


            <div className = "flex flex-wrap gap-4 justify-around">
                {prs.map(pr => {
                    return <div className = "flex gap-x-2 p-2 w-64 bg-black bg-opacity-10 border-2 even:bg-opacity-20 border-brand-500" key = {pr.pr_id}>

                        <div className = "w-12">
                            <img src = {pr.owner_avatar_url} alt = {pr.owner} className = "rounded-full"/>
                        </div>

                        <div className = "flex relative flex-col flex-grow">
                            <div className = "absolute right-0">
                                {pr.state === "closed" ?
                                        (pr.merged ?
                                                <GitMergeIcon size = {24} className = "text-indigo-500"/> :
                                                <GitPullRequestClosedIcon size = {24} className = "text-red-500"/>) :
                                        <GitPullRequestIcon size = {24} className = "text-green-500"/>}
                            </div>
                            <span className = "text-sm text-brand-100">
                                {pr.owner}
                            </span>

                            <div>
                                <a href = {pr.html_url} className = "navlink" target = "_blank" rel = "noreferrer">
                                    {pr.repo_name}#{pr.number}
                                </a>
                            </div>

                            <span className = "mb-2 text-sm text-brand-100">
                                {new Date(pr.created_at).toLocaleString()}
                            </span>

                            <span className = "mt-auto font-mono">
                                {pr.title}
                            </span>


                        </div>


                    </div>;
                })}
            </div>

        </div>


    </Layout>;

}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<{ account: Account, prs: PR[] } | { loggedOut: true }>> {
    const session = await getSession(context);
    if (!session || !(await getAccount({right: session}))) {
        return {
            redirect: {
                destination: "/403?url=/me",
                permanent: false
            }
        };
    }

    const account = await getAccount({right: session});

    const prs = (await prisma.pullRequest.findMany({
        select: {
            html_url: true,
            created_at: true,
            merged: true,
            number: true,
            owner_avatar_url: true,
            repo_name: true,
            repo_id: true,
            pr_id: true,
            title: true,
            state: true,
            owner: true
        },
        where: {
            author_id: account.githubId,
        }
    })).map(value => {
        return {...value, created_at: value.created_at.getTime()};
    });
    return {
        props: {
            account,
            prs: prs
        }
    };
}
