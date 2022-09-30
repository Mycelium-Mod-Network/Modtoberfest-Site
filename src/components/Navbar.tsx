import Image from "next/image";
import UserButton from "./ui/UserButton";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LinkTo from "./ui/LinkTo";
import classNames from "classnames";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
    const session = useSession();

    const [isExpanded, setExpanded] = useState(false);

    const [isAdmin, setAdmin] = useState(false);
    useEffect(() => {
        fetch("/api/isAdmin").then(value => Promise.resolve(value.text())).then(value => setAdmin(value === "true"));
    }, [session]);

    return <header className = "min-h-[4rem] px-6 py-4 bg-gradient-to-b from-brand-800 via-brand-800 to-brand-900 flex">
        <div className = "my-auto flex flex-col flex-wrap gap-x-6 justify-between mx-auto max-w-6xl flex-grow h-full lg:flex-row lg:justify-start">

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

                <div className = "lg:gap-y-0 gap-y-2 gap-x-6 flex flex-col flex-wrap justify-center items-center text-base text-center lg:flex-row lg:pl-4 lg:-ml-4 lg:border-l lg:border-brand-700 lg:py-auto lg:flex-grow">
                    <LinkTo href = "/" className = "navlink">Home</LinkTo>

                    <LinkTo href = "/faq" className = "navlink">FAQ </LinkTo>

                    <LinkTo href = "/rules" className = "navlink">Rules</LinkTo>

                    <LinkTo href = "/repositories" className = "navlink">Repositories</LinkTo>

                    <LinkTo href = "/tips" className = "navlink">Tips</LinkTo>

                    <a className = "navlink" href = "https://discord.modtoberfest.com"> Discord </a>

                    <LinkTo href = "/sponsors" className = "navlink">Sponsors</LinkTo>

                    {isAdmin && <LinkTo href = "/admin" className = "navlink">Admin</LinkTo>}

                    <UserButton className = "lg:ml-auto"/>
                </div>

            </div>
        </div>

    </header>;
}