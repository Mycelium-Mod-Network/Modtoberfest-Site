import Layout from "../../../components/Layout";
import {GetServerSidePropsResult} from "next";
import {getSession} from "next-auth/react";
import {getAccount} from "../../../lib/utils";
import prisma from "../../../lib/db";
import PageTitle from "../../../components/ui/PageTitle";
import React, {useState} from "react";
import {IssueClosedIcon, IssueOpenedIcon} from "@primer/octicons-react";
import classNames from "classnames";

interface PullRequest {
    pr_id: number;
    author: string;
    created_at: number;
    html_url: string;
    merged: boolean;
    number: number;
    owner: string;
    owner_avatar_url: string;
    repo_name: string;
    title: string;
    invalid?: boolean;
    readonly?: string;
    state: string
}

interface Group {
    [key: string]: {
        owner: string
        name: string
        url: string
        avatar: string
        prs: PullRequest[]
    }
}

function PullRequest({prDetails}: { prDetails: PullRequest }) {
    const [pr, setPr] = useState<PullRequest>(prDetails);

    return <div className = "flex flex-col gap-y-2 rounded border-2 border-cyan-400 sm:flex-col p-2">

        <div className = "flex flex-col flex-grow w-full">

            <a href = {pr.html_url} target = "_blank" rel = "noreferrer" className = "flex gap-x-2">
                {pr.state === "open" ? <IssueOpenedIcon className = "w-5 h-5 text-green-700 my-auto"/> :
                    <IssueClosedIcon className = {classNames({"text-purple-500": pr.merged, "text-red-500": !pr.merged}, "w-5 h-5 my-auto")}/>}

                <p className = "font-mono">
                    {pr.title}
                </p>
            </a>
            <div className = "smtext-xs ml-7">
                #{pr.number} by <a href = {`https://github.com/${pr.author}`} target = "_blank" rel = "noreferrer">{pr.author}</a>
            </div>
        </div>
    </div>;
}

export default function Review({prs}: { prs: PullRequest[] }) {

    let [workingPrs, setWorkingPrs] = useState(prs)
    let groups = {}
    for (let pr of workingPrs) {
        let group = groups[pr.owner] ?? {
            owner: pr.owner,
            name: `${pr.owner}/${pr.repo_name}`,
            url: `https://github.com/${pr.owner}/${pr.repo_name}`,
            avatar: pr.owner_avatar_url,
            prs: []
        }
        group.prs.push(pr)
        groups[pr.owner] = group;
    }

    return <Layout canonical = "/admin/pullrequests" title = "Pull Requests" description = "Pull Requests">

        <div className = "mx-auto max-w-full">

            <PageTitle> Pull Requests (Total: {workingPrs.length}) </PageTitle>
            <div className = "flex flex-col gap-y-4">
                {Object.keys(groups).map(groupName => {
                    let group = groups[groupName]
                    return <div className = "flex-grow w-full flex flex-col" key = {groupName}>
                        <div className = "flex gap-x-4 mb-2 border-b-2 pb-2">
                            <div className = "my-auto w-10">
                                <a href = {group.url} target = "_blank" rel = "noreferrer"> <img src = {group.avatar} alt = {group.name} className = "rounded-full"/> </a>
                            </div>
                            <div className = "flex flex-col group">
                                <h3 className = "text-2xl font-bold">
                                    <a href = {group.url} target = "_blank" rel = "noreferrer" className = "group-hover:text-orange-600 group-hover:-translate-y-px navlink">{group.name}</a>
                                </h3>
                            </div>
                        </div>

                        <div className = "flex flex-wrap flex-col gap-4 justify-between">
                            {group.prs.map(pr => <PullRequest key = {pr.pr_id} prDetails = {pr}/>)}
                        </div>
                    </div>
                })}
            </div>
        </div>

    </Layout>;
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<{ prs: PullRequest[] }>> {

    const session = await getSession(context);
    if (!session || !(await getAccount({right: session})).admin) {
        return {
            redirect: {
                destination: "/403?url=/admin/pullrequests",
                permanent: false
            }
        };
    }

    const prs: PullRequest[] = (await prisma.pullRequest.findMany({
        select: {
            pr_id: true,
            author: true,
            created_at: true,
            html_url: true,
            merged: true,
            number: true,
            owner: true,
            owner_avatar_url: true,
            repo_name: true,
            title: true,
            state: true,
            PullRequestStatus: {
                select: {
                    invalid: true,
                    reason: true
                }
            }
        }
    })).map(pr => ({
        pr_id: pr.pr_id,
        author: pr.author,
        created_at: new Date(pr.created_at).getTime(),
        html_url: pr.html_url,
        merged: pr.merged,
        number: pr.number,
        owner: pr.owner,
        owner_avatar_url: pr.owner_avatar_url,
        repo_name: pr.repo_name,
        title: pr.title,
        state: pr.state,
        invalid: pr.PullRequestStatus ? pr.PullRequestStatus.invalid : false,
        reason: pr.PullRequestStatus ? pr.PullRequestStatus.reason : null,
    }))
    return {props: {prs}};
}
