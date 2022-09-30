import React from "react";

import { signOut, useSession } from "next-auth/react";
import LoginLink from "../LoginLink";
import Button from "./Button";
import classNames from "classnames";
import LinkTo from "./LinkTo";

export default function UserButton({ className = undefined, showSignout = true, aClassName = undefined }) {
    const { data, status } = useSession();

    if (status === "authenticated") {
        return (
            <div className = {classNames("flex flex-col lg:flex-row items-center gap-x-2", className)}>
                <LinkTo href = "/me" className = {classNames("no-underline", aClassName)}><Button className = "flex items-center">

                    <img
                        src = {data.user.image}
                        width = "30"
                        className = "mr-3 rounded-full"
                        alt = "avatar"
                    />

                    <div>My progress</div>
                </Button></LinkTo>

                {showSignout && <a
                    href = {`/api/auth/signout`}
                    onClick = {(e) => {
                        e.preventDefault();
                        signOut();
                    }}
                    className = "text-white"
                > Sign out </a>}

            </div>
        );
    }
    return <LoginLink className = {className}> <Button> Login </Button> </LoginLink>;
}
