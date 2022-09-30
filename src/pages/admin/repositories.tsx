import Layout from "../../components/Layout";
import { GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";
import { getAccount } from "../../lib/utils";
import prisma from "../../lib/db";
import classNames from "classnames";
import PageTitle from "../../components/ui/PageTitle";
import { Dispatch, SetStateAction, useState } from "react";
import { BasicSponsor, Repository } from "../../lib/Types";
import { Octokit } from "octokit";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import { Repository as GHRepo } from "@octokit/webhooks-types";
import axios, { AxiosResponse } from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormInput, FormSelect } from "../../components/form/FormInput";

const validationSchema = yup.object({
    owner: yup.string()
        .required("Required"),
    repo_name: yup.string()
        .required("Required"),
    sponsor_id: yup.string()
        .notRequired()
});

export function Repository({ repoDetails, setCurrentRepos }: { repoDetails: Repository, setCurrentRepos: Dispatch<SetStateAction<Repository[]>> }) {
    const [repo] = useState<Repository>(repoDetails);

    return <div className = "w-full border-2 p-4 flex gap-x-4">
        <div className = "flex-none">
            <img src = {repo.ownerAvatarUrl} alt = "avatar" className = "w-16 h-16 rounded-full"/>
        </div>

        <div className = "flex-grow flex flex-col">
            <div>
                <a className = "font-semibold" href = {repo.ownerHtmlUrl} target = "_blank" rel = "noreferrer">
                    {repo.owner}
                </a>
            </div>
            <div>
                <a className = "text-lg font-semibold" href = {repo.url} target = "_blank" rel = "noreferrer">

                    {repo.name}
                </a>
            </div>

            <div>
                {repo.sponsored && <div className = "flex gap-x-2">
                    <span>
                        Sponsored by:
                    </span>

                    <span>
                        {repo.sponsor}
                    </span>
                </div>}
            </div>

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
                </span>

                <span className = "font-mono break-all">
                    {repo.id}
                </span>
            </div>

            {repo.description && <div className = "font-mono bg-white bg-opacity-5 p-2 break-all">
                {repo.description}
            </div>}

            <div className = "flex">
                <div className = {classNames({}, "bg-red-700 hover:bg-red-600 flex bg-opacity-75")}>
                    <button className = "flex w-full h-full p-1" onClick = {async event => {
                        event.preventDefault();
                        axios.post(`/api/admin/repos/delete`, {
                            id: repo.id
                        }).then(value => {
                            setCurrentRepos(repos => {
                                return repos.filter(repo => repo.id !== value.data.id);
                            });
                        });
                    }}>
                        <div className = "flex gap-x-1 m-auto">
                            <TrashIcon className = "my-auto w-4 h-4"/>

                            <span>Delete</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>;
}

function AddRepoForm({
    setAddingRepo,
    setCurrentRepos,
    sponsors
}: { setAddingRepo: (adding: boolean) => void, setCurrentRepos: Dispatch<SetStateAction<Repository[]>>, sponsors: BasicSponsor[] }) {

    const formik = useFormik({
        initialValues: {
            owner: "",
            repo_name: "",
            sponsor: ""
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            axios.post("/api/admin/repos/create", values).then(value => {
                setAddingRepo(false);
                setCurrentRepos((currentRepos: Repository[]) => {
                    return [...currentRepos, value.data];
                });
            });
        }
    });

    return <div className = "flex flex-col my-2 mx-4">
        <div className = "pb-2 mb-4 text-2xl text-center border-b-2">
            Adding Repository
        </div>
        <form onSubmit = {formik.handleSubmit} className = "flex flex-col gap-2">
            <FormInput formik = {formik} id = {"owner"} label = {"Owner"} required = {true}/>

            <FormInput formik = {formik} id = {"repo_name"} label = {"Repo Name"} required = {true}/>

            <FormSelect formik = {formik} label = "Sponsor" id = "sponsor" required = {false}>
                {sponsors.map(value => <option key={value.id} value={value.id}>{value.name}</option>)}
            </FormSelect>

            <div className = "flex gap-x-2">
                <button className = "w-1/2 bg-green-800 bg-opacity-30 border-2 border-green-400 hover:bg-opacity-50" type="submit">
                    Add Repository
                </button>
                <button className = "w-1/2 bg-red-800 bg-opacity-30 border-2 border-red-400 hover:bg-opacity-50" onClick = {(e) => setAddingRepo(false)}>
                    Cancel
                </button>
            </div>
        </form>
    </div>;
}

export default function Repositories({ repositories, sponsors }: { repositories: Repository[], sponsors: BasicSponsor[] }) {
    const [currentRepositories, setCurrentRepositories] = useState<Repository[]>(repositories);
    const [addingRepo, setAddingRepo] = useState<boolean>(false);

    console.log(repositories);
    return <Layout canonical = "/admin/sponsors" title = "Sponsors" description = "Sponsors">

        <PageTitle> Repositories (Total: {currentRepositories.length}) </PageTitle>

        <div className = "flex flex-col gap-y-4">
            <div className = {classNames({
                "hover:bg-opacity-20 hover:border-cyan-400 hover:text-cyan-400 text-center": !addingRepo
            }, "w-full border-2 text-xl bg-black bg-opacity-10 grid mb-4")}>
                {addingRepo && <AddRepoForm setAddingRepo = {setAddingRepo} setCurrentRepos = {setCurrentRepositories} sponsors={sponsors}/>}

                {!addingRepo && <button onClick = {(e) => setAddingRepo(true)}>Add Repo</button>}
            </div>
            {currentRepositories.map(value => <Repository repoDetails = {value} key = {value.name} setCurrentRepos = {setCurrentRepositories}/>)}
        </div>

    </Layout>;
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<{ repositories: Repository[], sponsors: BasicSponsor[] }>> {


    const session = await getSession(context);
    if (!session || !(await getAccount({ right: session })).admin) {
        return {
            redirect: {
                destination: "/403",
                permanent: false
            }
        };
    }

    const repos = (await prisma.repository.findMany({
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
            }
        }
    }));

    const sponsors = (await prisma.sponsor.findMany({
        select: {
            id: true,
            name: true
        }
    }));

    const octokit = new Octokit({
        authStrategy: createOAuthAppAuth,
        auth: {
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }
    });
    const fullRepos: Repository[] = await Promise.all(repos.map(async repo => {
        const repoInfo = await octokit.request("GET /repositories/{repository_id}", { repository_id: repo.repository_id });
        const repoData: GHRepo = repoInfo.data;

        return {
            ...repo,
            description: repoInfo.data.description,
            name: repoData.name,
            owner: repoData.owner.login,
            ownerHtmlUrl: repoData.owner.html_url,
            ownerAvatarUrl: repoData.owner.avatar_url,
            stars: repoData.stargazers_count,
            openIssues: repoData.open_issues_count,
            sponsor: (repo.SponsoredRepository ?? { sponsor: { name: "" } }).sponsor.name,
            sponsored: !!repo.SponsoredRepository
        };
    }));


    return { props: { repositories: fullRepos, sponsors } };
}
