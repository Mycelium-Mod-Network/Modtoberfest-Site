import { PropsWithChildren } from "react";

interface Props {
    title: string;
    multi?: boolean;
}

export function Item({ title, children, multi = false }: PropsWithChildren<Props>) {
    const id = title.toLocaleLowerCase().replace(/\s/g, "-").replace(/\?/, "");
    return (
        <div>
            <h2><a id = {id} href = {`#${id}`}>{title}</a></h2>

            {multi ? <> {children}</> : <p>{children}</p>}
        </div>
    );
}

export function SmallItem({ title, children, multi = false }: PropsWithChildren<Props>) {
    const id = title.toLocaleLowerCase().replace(/\s/g, "-").replace(/\?/, "");
    return (
        <div>
            <h3><a id = {id} href = {`#${id}`}>{title}</a></h3>

            {multi ? <> {children}</> : <p>{children}</p>}
        </div>
    );
}