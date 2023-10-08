import Layout from "../../../components/Layout";
import {GetServerSidePropsResult} from "next";
import prisma from "../../../lib/db";
import classNames from "classnames";
import PageTitle from "../../../components/ui/PageTitle";
import React, {Dispatch, SetStateAction, useState} from "react";
import {BasicSponsor, Repository} from "../../../lib/Types";
import axios from "axios";
import * as yup from "yup";
import {getSession} from "next-auth/react";
import {formatDate, getAccount} from "../../../lib/utils";
import {Repository as GHRepo} from "@octokit/webhooks-types";
import {Octokit} from "octokit";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";
import {useFormik} from "formik";
import Image from "next/image";

const validationSchema = yup.object({
    owner: yup.string()
            .required("Required"),
    repo_name: yup.string()
            .required("Required"),
    sponsor_id: yup.string()
            .notRequired()
});

export function Repository({repoDetails, setCurrentRepos}: { repoDetails: Repository, setCurrentRepos: Dispatch<SetStateAction<Repository[]>> }) {
    const [repo] = useState<Repository>(repoDetails);

    const [working, setWorking] = useState<boolean>(false);
    const formik = useFormik({
        initialValues: {
            repository_id: repo.repository_id,
            reason: ''
        },
        onSubmit: async values => {
            setWorking(true)
            axios.post(`/api/admin/repos/review`, {...values, invalid: values.reason.length > 0}).then(value => {
                setCurrentRepos(repos => {
                    return repos.filter(repo => repo.repository_id !== values.repository_id);
                });
                setWorking(false)
            })
        }
    });

    return <form onSubmit = {formik.handleSubmit} className = "flex gap-x-4 p-4 w-full border-2">
        <div className = "flex-none">
            <img src = {repo.ownerAvatarUrl} alt = "avatar" className = "w-16 h-16 rounded-full"/>
        </div>

        <div className = "flex flex-col flex-grow gap-y-2">
            <div className = "flex flex-col">
                <a className = "font-semibold" href = {repo.ownerHtmlUrl} target = "_blank" rel = "noreferrer">
                    {repo.owner}
                </a> <a className = "text-lg font-semibold" href = {repo.url} target = "_blank" rel = "noreferrer">

                {repo.name}
            </a> {repo.sponsored && <div className = "flex gap-x-2">
                    <span>
                        Sponsored by:
                    </span>

                <span>
                        {repo.sponsor}
                    </span>
            </div>}
                <div className = "flex gap-x-2">
                <span>
                    GHID:
                </span>

                    <span className = "font-mono">
                    {repo.repository_id}
                </span>
                </div>
                <div className = "flex gap-x-2">
                <span>
                    ID:
                </span> <span className = "font-mono break-all">
                    {repo.id}
                </span>
                </div>
            </div>

            {repo.description && <div className = "p-2 font-mono break-all bg-white bg-opacity-5">
                {repo.description}
            </div>}

            <div className = "flex">
                <div className = {classNames("flex-grow w-full flex flex-col gap-y-1")}>
                    <input onChange = {formik.handleChange}
                           value = {formik.values["reason"]}
                           disabled = {working} type = "text" name = "reason" className = "w-full p-1.5 bg-brand-800"
                    />
                    <button disabled = {working} type = "submit" className = {classNames({
                        "bg-green-700 hover:bg-green-500 disabled:hover:bg-green-700": formik.values.reason.length == 0,
                        "bg-red-700 hover:bg-red-500 disabled:hover:bg-red-700": formik.values.reason.length > 0
                    }, "flex-grow disabled:bg-opacity-50 disabled:hover:bg-opacity-50 text-white hover:text-black disabled:hover:text-white p-2")}>
                        {working ? <div className = "flex w-full">
                            <div className = "flex mx-auto gap-x-2">
                                <div className = "w-4 h-4 animate-spin my-auto">
                                    <Image src = "https://assets.blamejared.com/modtoberfest/loading.svg" layout = "fill"/>
                                </div>
                                {formik.values.reason.length == 0 ? <span>
                                    Approving...
                                </span> : <span>Denying...</span>}

                            </div>

                        </div> : formik.values.reason.length == 0 ? "Approve" : "Deny"}
                    </button>
                </div>
            </div>
        </div>
    </form>;
}

export default function Index({repositories, sponsors}: { repositories: Repository[], sponsors: BasicSponsor[] }) {
    const [currentRepositories, setCurrentRepositories] = useState<Repository[]>(repositories);

    return <Layout canonical = "/admin/repositories/submitted" title = "Submitted Repositories" description = "Submitted Repositories">

        <PageTitle> Repositories (Total: {currentRepositories.length}) </PageTitle>

        <div className = "flex flex-col gap-y-4">
            {currentRepositories.map(value => <Repository repoDetails = {value} key = {value.id} setCurrentRepos = {setCurrentRepositories}/>)}
        </div>

    </Layout>;
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<{ repositories: Repository[], sponsors: BasicSponsor[] }>> {


    const session = await getSession(context);
    if (!session || !(await getAccount({right: session})).admin) {
        return {
            redirect: {
                destination: "/403?url=/admin/repositories/submitted",
                permanent: false
            }
        };
    }

    const octokit = new Octokit({
        authStrategy: createOAuthAppAuth,
        auth: {
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }
    });


    const repos = await Promise.all((await prisma.repository.findMany({
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
            RepositoryStatus: {
                reviewed: {
                    equals: false
                }
            }
        }
    })).map(async repo => {
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
    }))

    const sponsors = (await prisma.sponsor.findMany({
        select: {
            id: true,
            name: true
        }
    }));


    return {props: {repositories: repos, sponsors}};
}
