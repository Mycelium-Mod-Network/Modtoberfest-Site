import Layout from "../../components/Layout";
import {GetServerSidePropsResult} from "next";
import prisma from "../../lib/db";
import classNames from "classnames";
import PageTitle from "../../components/ui/PageTitle";
import {Dispatch, SetStateAction, useState} from "react";
import {BasicSponsor, Repository} from "../../lib/Types";
import axios from "axios";
import {TrashIcon} from "@heroicons/react/24/outline";
import {useFormik} from "formik";
import * as yup from "yup";
import {FormInput, FormSelect} from "../../components/form/FormInput";
import {getSession} from "next-auth/react";
import {getAccount} from "../../lib/utils";
import {Repository as GHRepo} from "@octokit/webhooks-types";
import {Octokit} from "octokit";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";

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

    return <div className = "flex gap-x-4 p-4 w-full border-2">
        <div className = "flex-none">
            <img src = {repo.ownerAvatarUrl} alt = "avatar" className = "w-16 h-16 rounded-full"/>
        </div>

        <div className = "flex flex-col flex-grow">
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

            {repo.description && <div className = "p-2 font-mono break-all bg-white bg-opacity-5">
                {repo.description}
            </div>}

            <div className = "flex">
                <div className = {classNames({}, "bg-red-700 hover:bg-red-600 flex bg-opacity-75")}>
                    <button className = "flex p-1 w-full h-full" onClick = {async event => {
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
                     }: {
    setAddingRepo: (adding: boolean) => void,
    setCurrentRepos: Dispatch<SetStateAction<Repository[]>>,
    sponsors: BasicSponsor[]
}) {

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
                {sponsors.map(value => <option key = {value.id} value = {value.id}>{value.name}</option>)}
            </FormSelect>

            <div className = "flex gap-x-2">
                <button className = "w-1/2 bg-green-800 bg-opacity-30 border-2 border-green-400 hover:bg-opacity-50" type = "submit">
                    Add Repository
                </button>
                <button className = "w-1/2 bg-red-800 bg-opacity-30 border-2 border-red-400 hover:bg-opacity-50" onClick = {(e) => setAddingRepo(false)}>
                    Cancel
                </button>
            </div>
        </form>
    </div>;
}

export default function Repositories({repositories, sponsors}: { repositories: Repository[], sponsors: BasicSponsor[] }) {
    const [currentRepositories, setCurrentRepositories] = useState<Repository[]>(repositories);
    const [addingRepo, setAddingRepo] = useState<boolean>(false);

    return <Layout canonical = "/admin/repositories" title = "Repositories" description = "Repositories">

        <PageTitle> Repositories (Total: {currentRepositories.length}) </PageTitle>

        <div className = "flex flex-col gap-y-4">
            <div className = {classNames({
                "hover:bg-opacity-20 hover:border-cyan-400 hover:text-cyan-400 text-center": !addingRepo
            }, "w-full border-2 text-xl bg-black bg-opacity-10 grid mb-4")}>
                {addingRepo && <AddRepoForm setAddingRepo = {setAddingRepo} setCurrentRepos = {setCurrentRepositories} sponsors = {sponsors}/>}

                {!addingRepo && <button onClick = {(e) => setAddingRepo(true)}>Add Repo</button>}
            </div>
            {currentRepositories.map(value => <Repository repoDetails = {value} key = {value.id} setCurrentRepos = {setCurrentRepositories}/>)}
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
                id: repo.id
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
            sponsored: !!repo.SponsoredRepository
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
