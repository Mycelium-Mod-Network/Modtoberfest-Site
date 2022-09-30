import { PropsWithChildren } from "react";
import Link from "next/link";
import classNames from "classnames";

export default function LinkTo({ children, href, className = "" }: PropsWithChildren<{ href: string, className?: string }>) {
    return <Link href = {href}><a className = {classNames(className)}>{children}</a></Link>;
}
