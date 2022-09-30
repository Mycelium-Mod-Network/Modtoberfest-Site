import React, { PropsWithChildren } from "react";

interface Props {
    name: string;
    className?: string;
}

export default function GridArea({ name, children, className = "" }: PropsWithChildren<Props>): JSX.Element {
    return (
        <div className = {className} style = {{ gridArea: name }}>
            {children}
        </div>
    );
}