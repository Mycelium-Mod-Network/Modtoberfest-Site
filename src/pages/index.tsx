import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import Button from "../components/ui/Button";
import UserButton from "../components/ui/UserButton";
import Image from "next/image";
import { useSession } from "next-auth/react";
import LoginLink from "../components/LoginLink";
import GridArea from "../components/ui/GridArea";
import LinkTo from "../components/ui/LinkTo";

const Timer = dynamic(() => import("../components/ui/Timer"), {
    ssr: false
});

export default function Home() {
    const { data, status } = useSession();
    return (
        <Layout title = "Modtoberfest" canonical = "/" description = {"Modtoberfest"}>
            <div className = "flex flex-col gap-y-8 mx-auto md:max-w-prose">

                <div className = "mx-auto mt-8 w-full">
                    <Image src = {"/logo/badge_2023.svg"} width = {500} height = {280} layout = "responsive" alt = "logo"/>
                </div>

                <div className = "mx-auto text-center prose prose-invert">
                    <p className = "text-2xl">
                        Modtoberfest is an annual celebration of open source projects in the Minecraft community.
                    </p>
                    <p className = "text-2xl">
                        During October we challenge the community to give back to the open source projects at the heart of our community by
                        contributing valid pull requests to at least four different participating projects.
                    </p>
                    <p className = "text-2xl">
                        Participants who complete our challenge will be eligible to receive a prize pack in the mail including stickers and pins!
                    </p>
                    <p className="text-2xl">
                        This year we are also starting the Modtoberforest environmental initiative! You can learn more about the initiative <LinkTo href = "/modtoberforest">here.</LinkTo>
                    </p>
                </div>

                <Timer date = {Date.UTC(2023, 9, 1, 0, 0, 0)}/>

                <div className = "gap-y-4 gap-x-8 mb-32 w-full text-xl text-center participate">

                    <GridArea name = "tl" className = "text-2xl"> Participants </GridArea>

                    <GridArea name = "tr" className = "text-2xl"> Project organizers </GridArea>

                    <GridArea name = "bl">
                        {status === "authenticated" ? <>
                            <UserButton showSignout = {false} aClassName = {"mx-auto"}/>
                        </> : <LoginLink>

                            <Button className = {`mx-auto`}>Sign up here</Button>

                        </LoginLink>}
                    </GridArea>

                    <GridArea name = "br">

                        <a className = {`no-underline mx-auto`} href = "https://forms.gle/Cq8VdtUURhG1pSZe7" target = "_blank" rel = "noreferrer">
                            <div className = "inline-flex py-2 px-4 font-bold text-white bg-orange-400 rounded-full transition duration-200 ease-in-out transform lg:mt-0 hover:bg-orange-600 hover:scale-105">
                                Submit your project
                            </div>

                        </a>

                    </GridArea>

                </div>
            </div>

        </Layout>
    );
}