import Document, { Head, Html, Main, NextScript } from "next/document";
import React, { ReactElement } from "react";

class MyDocument extends Document {
    render(): ReactElement {
        // noinspection HtmlRequiredTitleElement
        return (
            <Html lang = {"en"}>

                <Head>
                    <script async defer data-website-id = "d5a805fd-940e-4c3e-853a-9c5d0dd9febf" src = "https://nlytics.blmj.red/scrpt"/>
                    <link rel = "apple-touch-icon" sizes = "180x180" href = "/apple-touch-icon.png"/>
                    <link rel = "icon" type = "image/png" sizes = "32x32" href = "/favicon-32x32.png"/>
                    <link rel = "icon" type = "image/png" sizes = "16x16" href = "/favicon-16x16.png"/>
                    <link rel = "manifest" href = "/site.webmanifest"/>
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
