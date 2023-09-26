import { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { NextSeo } from "next-seo";

export default function Layout(props: PropsWithChildren<{ title: string, description, canonical: string }>) {

    return (
        <>
            <NextSeo
                title = {props.title}
                description = {props.description}
                canonical = {`https://modtoberfest.com${props.canonical}`}
                openGraph = {{
                    type: "website",
                    title: props.title,
                    url: `https://modtoberfest.com${props.canonical}`,
                    description: props.description,
                    images: [
                        {
                            url: "https://modtoberfest.com/logo/badge_2023.png",
                            alt: props.title + " logo"
                        }
                    ],
                    site_name: "Modtoberfest"
                }}
                twitter = {{
                    cardType: "summary_large_image"
                }}
            />
            <div className = "flex flex-col min-h-screen">
                <Navbar/>
                <main className = "flex-grow">
                    {props.children}
                </main>

                <Footer/>
            </div>
        </>
    );
}