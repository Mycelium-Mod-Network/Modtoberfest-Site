import { HTMLAttributes, PropsWithChildren } from "react";
import classNames from "classnames";

export default function PageTitle({ className, children }: PropsWithChildren<HTMLAttributes<{}>>) {

    return <h1 className = {classNames(className, "text-white text-3xl font-semibold font-brand border-b-2 tracking-wide mb-4 pb-4")}>{children}</h1>;
}