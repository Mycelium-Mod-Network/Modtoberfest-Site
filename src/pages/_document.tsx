import Document, { Head, Html, Main, NextScript } from "next/document";
import React, { ReactElement } from "react";

class MyDocument extends Document {
    render(): ReactElement {
        // noinspection HtmlRequiredTitleElement
        return (
            <Html lang = {"en"}>

                <Head>
                    <script async defer data-website-id = "d5a805fd-940e-4c3e-853a-9c5d0dd9febf" src = "https://nlytics.blmj.red/scrpt"/>

                </Head>

                <body className = {`bg-brand-900`}>
                <Main/>

                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
