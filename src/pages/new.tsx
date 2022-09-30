import { getSession } from "next-auth/react";
import React from "react";
import Layout from "../components/Layout";
import PageTitle from "../components/ui/PageTitle";
import { getBasicAccountInfo } from "../lib/utils";
import prisma from "../lib/db";
import { info } from "../lib/discord-notifier";
import { GetServerSidePropsResult } from "next";
import LinkTo from "../components/ui/LinkTo";
import * as Process from "process";

interface PageProps {
    hasAccount: boolean;
}

export default function New({ hasAccount }: PageProps) {
    if (!hasAccount) {
        return (
            <Layout title = "Sign in with Github" canonical = "/new" description = {"New user landing page"}>
                <div className = "mx-auto max-w-prose text-center prose prose-invert">
                    <h1 className = "font-brand">
                        Please sign in with your Github account to complete the registration process.
                    </h1>
                    <LinkTo href = "/" className = "text-xl">Back home</LinkTo>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title = "Welcome to Modtoberfest!" canonical = "/new" description = {"Welcome to Modtoberfest!"}>
            <div className = "mx-auto max-w-prose prose prose-invert">
                <PageTitle>Welcome to Modtoberfest!</PageTitle>
                <h2 className = "text-center">
                    You&apos;re on!
                </h2>
                <h2 className = "text-center">
                    Here&apos;s some things to know about the event
                </h2>
                <div className = "my-5">
                    <ul>
                        <li>
                            Read the <LinkTo href = "/rules">rules</LinkTo>
                        </li>
                        <li>
                            Checkout the <LinkTo href = "/faq">FAQ</LinkTo>
                        </li>
                        <li>
                            For questions, issues or just chatting, join us
                            on <a target = "_blank" href = "https://discord.modtoberfest.com" rel = "noreferrer"> Discord </a>
                        </li>
                    </ul>
                </div>
                <div className = "flex flex-wrap justify-center">
                    <div className = "w-full">
                        <h2 className = "text-center">Get modding and have fun!</h2>
                        <p className = "text-sm text-center">- the Modtoberfest team</p>
                    </div>
                    <img src = "/logo/badge.svg" width = "400" alt = "logo"></img>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<PageProps>> {
    // This is a hack because next-auth has no way to hook into
    // account creation POST creation, so new users get redirected
    // here and this runs, so it's basically a post creation callback
    try {
        const session = await getSession(context);
        if (!session) {
            return { props: { hasAccount: false } };
        }

        const basicInfo = await getBasicAccountInfo({ right: session });

        const participantExists = await prisma.participant.count({
            where: {
                githubId: basicInfo.githubId
            }
        });

        if (participantExists) {
            return { props: { hasAccount: true } };
        }

        // Participant doesn't exist, create entry
        await prisma.participant.create({
            data: {
                accountId: basicInfo.id,
                admin: false,
                githubId: basicInfo.githubId
            }
        });

        await info("New user signed up", null, [
            {
                name: "Name",
                value: basicInfo.name
            },
            {
                name: "GH ID",
                value: basicInfo.githubId
            },
            {
                name: "UID",
                value: basicInfo.id
            }
        ]);
    } catch (e) {
        console.error(e);
        return { props: { hasAccount: false } };
    }
    return { props: { hasAccount: true } };
}
