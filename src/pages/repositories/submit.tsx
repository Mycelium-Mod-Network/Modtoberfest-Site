import Layout from "../../components/Layout";
import classNames from "classnames";
import PageTitle from "../../components/ui/PageTitle";
import {getAccessToken, getAccount} from "../../lib/utils";
import {IssueOpenedIcon, RepoForkedIcon, RepoIcon, StarIcon, VerifiedIcon} from "@primer/octicons-react";
import {BaseRepository} from "../../lib/Types";
import {getSession} from "next-auth/react";
import {GetServerSidePropsResult} from "next";
import {Octokit} from "octokit";
import prisma from "../../lib/db";
import LinkTo from "../../components/ui/LinkTo";
import axios from "axios";
import React, {useState} from "react";
import {useFormik} from "formik";
import Image from "next/image";

type SubmittableRepo = (BaseRepository & { alreadySubmitted: boolean, valid: boolean, sponsored: boolean, forked: boolean })

function RepositoryCard(repo: SubmittableRepo) {

    let [currentRepo, setCurrentRepo] = useState(repo);

    let [working, setWorking] = useState(false)

    const formik = useFormik({
        initialValues: {
            repository_id: repo.repository_id,
            action: currentRepo.alreadySubmitted ? "remove" : "submit"
        },
        onSubmit: async values => {
            setWorking(true)
            axios.post(`/api/repos/${values.action}`, {repository_id: values.repository_id}).then(value => {
                setCurrentRepo(prevState => {
                    return {...prevState, alreadySubmitted: values.action === "submit"}
                })
                formik.setValues(prevState => {
                    return {...prevState, action: values.action === "submit" ? "remove" : "submit"}
                })
                setWorking(false)
            });
        }
    });

    return <form onSubmit = {formik.handleSubmit} className = "relative w-full sm:w-64 bg-black bg-opacity-10 border-2 p-2.5 even:bg-opacity-[15%] hover:border-orange-500 flex flex-col gap-y-2">
        {repo.sponsored &&
                <LinkTo href = "/sponsored" className = "absolute -top-4 -right-4">
                    <VerifiedIcon className = "w-7 h-7 navlink bg-brand-900"/></LinkTo>}
        <div className = "flex gap-x-2 pb-2 border-b-2">
            <div className = "my-auto flex">
                {currentRepo.forked ? <RepoForkedIcon size = {24}/> : <RepoIcon size = {24}/>}
            </div>
            <div className = "flex flex-col group">
                <a href = {currentRepo.ownerHtmlUrl} target = "_blank" rel = "noreferrer" className = "group-hover:text-orange-600 group-hover:-translate-y-px navlink">{currentRepo.owner}</a>

                <a href = {currentRepo.url} className = "navlink" target = "_blank" rel = "noreferrer">{currentRepo.name}</a>
            </div>
        </div>
        <div className = "flex-grow break-words">
            <span className = {classNames({"italic": !currentRepo.description})}>{currentRepo.description || "No description provided"}</span>
        </div>

        <div className = "flex justify-between text-sm">
            <a href = {`${currentRepo.url}/stargazers`} target = "_blank" rel = "noreferrer" className = "flex gap-x-1 px-2 no-underline rounded border hover:text-orange-500 hover:bg-black hover:bg-opacity-5 hover:border-orange-500">
                <StarIcon className = "my-auto w-4 h-4 text-yellow-500"/> <span className = "my-auto">
                    {currentRepo.stars} stars
                </span>

            </a>

            <a href = {`${currentRepo.url}/issues`} className = "flex gap-x-1 px-2 no-underline rounded border hover:text-orange-500 hover:bg-black hover:bg-opacity-5 hover:border-orange-500">
                <IssueOpenedIcon className = "my-auto w-4 h-4 text-green-500"/> <span className = "my-auto">
                    {currentRepo.openIssues} Issue{currentRepo.openIssues == 1 ? "" : "s"}
                </span>

            </a>
        </div>
        <div className = "flex justify-between text-sm">
            {currentRepo.alreadySubmitted &&
                    <button disabled = {working} className = "flex-grow w-full bg-red-700 hover:bg-red-500 disabled:hover:bg-red-700 disabled:bg-opacity-50 disabled:hover:bg-opacity-50 text-white hover:text-black disabled:hover:text-white p-2" type = "submit">
                        {working ? <div className = "flex w-full">
                            <div className = "flex mx-auto gap-x-2">
                                <div className = "w-4 h-4 animate-spin my-auto">
                                    <Image src = "https://assets.blamejared.com/modtoberfest/loading.svg" layout = "fill"/>
                                </div>
                                <span>
                                    Removing...
                                </span>
                            </div>

                        </div> : "Remove Repository"}</button>}

            {!currentRepo.alreadySubmitted &&
                    <button disabled = {working} className = {classNames("flex-grow w-full bg-green-700 hover:bg-green-500 disabled:hover:bg-green-700 disabled:bg-opacity-50 disabled:hover:bg-opacity-50 text-white hover:text-black disabled:hover:text-white p-2")} type = "submit">
                        {working ? <div className = "flex w-full">
                            <div className = "flex mx-auto gap-x-2">
                                <div className = "w-4 h-4 animate-spin my-auto">
                                    <Image src = "https://assets.blamejared.com/modtoberfest/loading.svg" layout = "fill"/>
                                </div>
                                <span>
                                    Submitting...
                                </span>
                            </div>

                        </div> : "Submit Repository"}</button>}
        </div>
    </form>;
}

export default function Home({repos}: { repos: SubmittableRepo[] }) {

    let groups = {}
    for (let repo of repos) {
        let group = groups[repo.owner] ?? {
            name: repo.owner,
            url: repo.ownerHtmlUrl,
            avatar: repo.ownerAvatarUrl,
            repos: []
        }
        group.repos.push(repo)
        groups[repo.owner] = group;
    }
    return (
            <Layout title = "Submit Repositories" canonical = "/repositories/submit" description = {"Submit Repositories"}>

                <div className = "mx-auto max-w-[130ch]">

                    <PageTitle> Submit Repositories </PageTitle>
                    <h2 className = {classNames("text-white text-xl flex flex-col")}>
                        <span>
                            You can submit your repositories to the event below.
                        </span> <span>
                            If you don't see a repository that you want to submit, come chat to
                        us on the <a target = "_blank" href = "https://discord.modtoberfest.com" rel = "noreferrer"> Discord </a>
                        </span>

                    </h2>
                    <h3 className = {classNames("text-white text-lg font-semibold mb-4 pb-4 border-b-2 flex flex-col")}>
                        <span>
                            **Please note that repositories will need to be manually approved and will not appear instantly**
                        </span> <span>
                            **If your repository has been submitted but is not showing on the repositories page, it means that it still needs to be approved**
                        </span>
                    </h3>
                    <div className = "flex flex-col gap-8 ">
                        {Object.keys(groups).map(groupName => {
                            let group = groups[groupName]
                            return <div className = "flex-grow w-full">
                                <div className = "flex gap-x-4 mb-2 border-b-2 pb-2">
                                    <div className = "my-auto w-10">
                                        <a href = {group.url} target = "_blank" rel = "noreferrer">
                                            <img src = {group.avatar} alt = {group.owner} className = "rounded-full"/> </a>
                                    </div>
                                    <div className = "flex flex-col group">
                                        <h3 className = "text-2xl font-bold">
                                            <a href = {group.url} target = "_blank" rel = "noreferrer" className = "group-hover:text-orange-600 group-hover:-translate-y-px navlink">{group.name}</a>
                                        </h3>
                                    </div>
                                </div>

                                <div className = "flex flex-wrap gap-8 justify-between">

                                    {group.repos.map(repo => <RepositoryCard key = {repo.id} {...repo}/>)}
                                </div>
                            </div>
                        })}
                    </div>
                </div>

            </Layout>
    );
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<{ repos: SubmittableRepo[] }>> {
    const session = await getSession(context);
    if (!session || !(await getAccount({right: session}))) {
        return {
            redirect: {
                destination: "/403",
                permanent: false
            }
        };
    }
    const token = await getAccessToken(session);
    const octokit = new Octokit({
        auth: token
    });

    let allRepos: (BaseRepository & { forked: boolean })[] = []

    let page = 1;
    while (true) {
        const foundRepos = (await octokit.rest.repos.listForAuthenticatedUser({
            visibility: "public",
            sort: "full_name",
            per_page: 100,
            page: page++
        })).data.map<BaseRepository & { forked: boolean }>(repo => {
            return {
                repository_id: `${repo.id}`,
                name: repo.name,
                owner: repo.owner.login,
                ownerHtmlUrl: repo.owner.html_url,
                ownerAvatarUrl: repo.owner.avatar_url,
                url: repo.html_url,
                description: repo.description,
                stars: repo.stargazers_count,
                openIssues: repo.open_issues_count,
                forked: repo.fork
            }
        })
        if (foundRepos.length == 0) {
            break;
        } else {
            allRepos.push(...foundRepos)
        }
    }

    const existingRepos = (await prisma.repository.findMany({
        select: {
            repository_id: true,
            valid: true,
            SponsoredRepository: true
        },
        where: {
            repository_id: {
                in: allRepos.map(value => value.repository_id)
            }
        }
    }))
    return {
        props: {
            repos: allRepos.map(value => {
                let alreadySubmittedRepo = existingRepos.find(eValue => eValue.repository_id == value.repository_id)
                return {
                    ...value,
                    alreadySubmitted: !!alreadySubmittedRepo,
                    valid: (alreadySubmittedRepo ?? {valid: false}).valid,
                    sponsored: !!(alreadySubmittedRepo ?? {SponsoredRepository: undefined}).SponsoredRepository
                }
            })
        }
    };
}

