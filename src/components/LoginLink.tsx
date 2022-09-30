import React, { PropsWithChildren } from "react";
import { signIn } from "next-auth/react";
import classNames from "classnames";

export default function LoginLink({ className, children }: PropsWithChildren<{ className?: string }>) {

    return (
        <a
            href = {`/api/auth/signin`}
            onClick = {(e) => {
                e.preventDefault();
                signIn("github");
            }}
            className = {classNames(className)}
        >
            {children}
        </a>
    );
}
