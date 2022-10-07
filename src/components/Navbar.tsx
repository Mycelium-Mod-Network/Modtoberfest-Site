import Image from "next/image";
import UserButton from "./ui/UserButton";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LinkTo from "./ui/LinkTo";
import classNames from "classnames";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { LinkExternalIcon } from "@primer/octicons-react";

export default function Navbar() {
    const session = useSession();

    const [isExpanded, setExpanded] = useState(false);

    const [isAdmin, setAdmin] = useState(false);
    useEffect(() => {
        fetch("/api/isAdmin").then(value => Promise.resolve(value.text())).then(value => setAdmin(value === "true"));
    }, [session]);

    return <header className = "flex py-4 px-6 bg-gradient-to-b min-h-[4rem] from-brand-800 via-brand-800 to-brand-900">
        <div className = "flex flex-col flex-wrap flex-grow gap-x-6 justify-between my-auto mx-auto max-w-6xl h-full lg:flex-row lg:justify-start">

            <div className = {`h-full w-full lg:w-auto flex flex-row justify-between items-center`}>
                <LinkTo href = "/" className = "my-auto no-underline"><Image src = {"/logo/badge.svg"} alt = "logo" width = {88} height = {50} className = "w-full h-full" layout = "fixed"/></LinkTo>

                <div className = "block my-auto ml-auto lg:hidden">
                    <button
                        className = "flex items-center py-2 px-3 text-orange-200 rounded border border-orange-400 hover:text-white hover:border-white"
                        onClick = {(e) => {
                            setExpanded(!isExpanded);
                        }}
                    >
                        {!isExpanded && <Bars2Icon className = "w-6 h-5"/>} {isExpanded && <XMarkIcon className = "w-6 h-5"/>}
                    </button>
                </div>
            </div>


            <div className = {classNames({
                "block": isExpanded,
                "hidden": !isExpanded
            }, "w-full lg:w-auto lg:flex-grow flex flex-col lg:flex-row justify-between lg:flex")}>

                <div className = "flex flex-col flex-wrap gap-y-2 gap-x-6 justify-center items-center text-base text-center lg:flex-row lg:flex-grow lg:gap-y-0 lg:pl-4 lg:-ml-4 lg:border-l lg:border-brand-700 lg:py-auto">
                    <LinkTo href = "/" className = "navlink">Home</LinkTo>

                    <LinkTo href = "/faq" className = "navlink">FAQ</LinkTo>

                    <LinkTo href = "/rules" className = "navlink">Rules</LinkTo>

                    <LinkTo href = "/repositories" className = "navlink">Repositories</LinkTo>

                    <LinkTo href = "/tips" className = "navlink">Tips</LinkTo>

                    <a className = "navlink" href = "https://discord.modtoberfest.com" target = "_blank" rel = "noreferrer">Discord <LinkExternalIcon /></a>

                    <LinkTo href = "/sponsors" className = "navlink">Sponsors</LinkTo>

                    {isAdmin && <LinkTo href = "/admin" className = "navlink">Admin</LinkTo>}

                    <UserButton className = "lg:ml-auto"/>
                </div>

            </div>
        </div>

    </header>;
}