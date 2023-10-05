import Layout from "../../components/Layout";
import {CurrencyDollarIcon, UserIcon} from "@heroicons/react/24/outline";
import PageTitle from "../../components/ui/PageTitle";
import LinkTo from "../../components/ui/LinkTo";
import {GitPullRequestIcon, RepoIcon} from "@primer/octicons-react";
import {GetServerSidePropsResult} from "next";
import {getSession} from "next-auth/react";
import {getAccount} from "../../lib/utils";

interface AdminPage {
    name: string,
    url: string,
    icon: JSX.Element
}

const adminPages: AdminPage[] = [
    {
        name: "Users",
        url: "users",
        icon: <UserIcon className = "mx-auto w-28 h-28"/>
    },
    {
        name: "Sponsors",
        url: "sponsors",
        icon: <CurrencyDollarIcon className = "mx-auto w-28 h-28"/>
    },
    {
        name: "Repos",
        url: "repositories",
        icon: <RepoIcon className = "mx-auto w-28 h-28"/>
    },
    {
        name: "Submitted",
        url: "repositories/submitted",
        icon: <RepoIcon className = "mx-auto w-28 h-28"/>
    },
    {
        name: "PRs",
        url: "pullrequests",
        icon: <GitPullRequestIcon className = "mx-auto w-28 h-28"/>
    },
    {
        name: "Review PR",
        url: "pullrequests/review",
        icon: <GitPullRequestIcon className = "mx-auto w-28 h-28"/>
    }
];

export default function Admin() {

    return <Layout title = "Admin dashboard" description = {"Admin Dashboard"} canonical = "/admin">
        <div className = "mx-auto max-w-prose">

            <PageTitle> Admin Pages </PageTitle>
            <div className = "flex flex-wrap gap-x-4 gap-y-4 justify-around">
                {adminPages.map(value => {
                    return <LinkTo href = {`/admin/${value.url}`} key = {value.url} className = "no-underline">
                        <div className = "flex flex-col p-4 bg-black bg-opacity-10 rounded border-2 hover:text-orange-400 hover:bg-opacity-20 hover:border-orange-500">
                        <span className = "pb-4 text-2xl text-center">
                            {value.name}
                        </span>

                            {value.icon}
                        </div>

                    </LinkTo>;
                })}
            </div>
        </div>
    </Layout>;
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<{}>> {

    const session = await getSession(context);
    if (!session || !(await getAccount({right: session})).admin) {
        return {
            redirect: {
                destination: "/403?url=/admin",
                permanent: false
            }
        };
    }

    return {props: {}}
}
