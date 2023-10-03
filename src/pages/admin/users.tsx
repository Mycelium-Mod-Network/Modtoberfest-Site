import Layout from "../../components/Layout";
import { GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";
import { getAccount } from "../../lib/utils";
import prisma from "../../lib/db";
import axios from "axios";
import classNames from "classnames";
import PageTitle from "../../components/ui/PageTitle";
import { useState } from "react";
import { BoltIcon, BoltSlashIcon } from "@heroicons/react/24/outline";

interface User {
    userId: string,
    participantId: string,
    name: string,
    email: string,
    image: string,
    admin: boolean,
    discord?: string
}

function User(userDetails: User) {
    const [user, setUser] = useState<User>(userDetails);

    return <div className = "flex flex-col gap-x-2 rounded border-2 border-cyan-400 sm:flex-row">
        <img src = {user.image} alt = {`${user.name} image`} className = "m-4 w-24"/>

        <div className = "flex flex-col gap-y-2 my-4">
            <span>Name: <code className = "p-0.5 bg-black bg-opacity-50 select-all">{user.name}</code></span>
            <span>Email: <code className = "p-0.5 bg-black bg-opacity-50 select-all">{user.email}</code></span>
            <span>Discord: <code className = "p-0.5 bg-black bg-opacity-50 select-all">{user.discord ?? "Not linked"}</code></span>
        </div>

        <div className = "flex flex-row border-cyan-400 sm:flex-col sm:ml-auto sm:w-2/12 sm:border-l-2">
            <div className = {classNames({
                "bg-red-700 hover:bg-red-600": user.admin,
                "bg-green-700 hover:bg-green-600": !user.admin
            }, "flex w-1/3 sm:w-auto sm:h-1/3 bg-opacity-75 border-r-2 border-t-2 sm:border-b-2 border-cyan-400")}>
                <button className = "flex w-full h-full" onClick = {async event => {
                    event.preventDefault();
                    const endpoint = user.admin ? "demote" : "promote";
                    axios.post(`/api/admin/users/${endpoint}`, {
                        id: user.participantId
                    }).then(value => {
                        setUser(user => {
                            return { ...user, admin: !user.admin };
                        });
                    });
                }}>
                    {user.admin ? <div className = "flex gap-x-1 m-auto">
                        <BoltSlashIcon className = "my-auto w-4 h-4"/> <span>Demote</span>
                    </div> : <div className = "flex gap-x-1 m-auto">
                        <BoltIcon className = "my-auto w-4 h-4"/> <span>Promote</span>
                    </div>}
                </button>
            </div>
            <div className = "flex flex-grow w-1/3 bg-opacity-75 border-t-2 border-r-2 border-cyan-400 sm:flex-none sm:w-auto sm:h-1/3 sm:border-t-0 sm:border-r-0 sm:border-b-2"/>
            <div className = "flex flex-grow w-1/3 bg-opacity-75 border-t-2 border-cyan-400 sm:flex-none sm:w-auto sm:h-1/3 sm:border-t-0 sm:border-b-2"/>
        </div>
    </div>;
}

export default function Users({ users }: { users: User[] }) {
    return <Layout canonical = "/admin/users" title = "Users" description = "Users">

        <div className = "mx-auto max-w-prose">

            <PageTitle> Users (Total: {users.length}) </PageTitle>
            <div className = "flex flex-col gap-y-4">
                {users.map(value => <User {...value} key = {value.userId}/>)}
            </div>
        </div>

    </Layout>;
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<{ users: User[] }>> {

    const session = await getSession(context);
    if (!session || !(await getAccount({ right: session })).admin) {
        return {
            redirect: {
                destination: "/403?url=/admin/users",
                permanent: false
            }
        };
    }

    const users = (await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            accounts: {
                select: {
                    Participant: {
                        select: {
                            id: true,
                            admin: true,
                            discordUser: true
                        }
                    }
                }
            }
        }
    })).map(user => {
        return {
            userId: user.id,
            participantId: user.accounts[0].Participant.id,
            name: user.name,
            email: user.email,
            image: user.image,
            admin: user.accounts[0].Participant.admin,
            discord: user.accounts[0].Participant.discordUser
        };
    });
    return { props: { users } };
}
