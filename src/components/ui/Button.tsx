import React from "react";
import classNames from "classnames";

export default function Button({ children, className = undefined, size = "", ...buttonProps }) {
    const classes =
        "lg:mt-0 text-white font-bold bg-orange-400 hover:bg-orange-600 px-4 py-2 rounded-full transition duration-200 ease-in-out transform hover:scale-105";
    return (
        <button
            className = {classNames(classes, className, {
                "px-8 py-4 text-xl": size == "lg",
                "px-10 py-4 text-2xl": size == "xl"
            })}{...buttonProps}>
            {children}
        </button>
    );
}
