import React, {PropsWithChildren} from "react";
import {signIn} from "next-auth/react";
import classNames from "classnames";

export default function LoginLink({className, children, callbackUrl}: PropsWithChildren<{ className?: string, callbackUrl?: string }>) {

    return (
            <a
                    href = {`/api/auth/signin`}
                    onClick = {(e) => {
                        e.preventDefault();
                        signIn("github", {callbackUrl: callbackUrl});
                    }}
                    className = {classNames(className)}
            >
                {children}
            </a>
    );
}
