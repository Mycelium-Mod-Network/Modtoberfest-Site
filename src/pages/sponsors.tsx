import Layout from "../components/Layout";
import { GetStaticPropsResult } from "next";
import prisma from "../lib/db";
import { SocialIcon } from "react-social-icons";
import PageTitle from "../components/ui/PageTitle";
import { shuffleArray } from "../lib/utils";


interface Sponsor {
    id: string,
    name: string,
    image_url: string,
    summary: string,
    website_url?: string,
    github_user?: string,
    twitter_handle?: string,
    subreddit?: string,
    discord?: string
}

function Sponsor({ sponsor }: { sponsor: Sponsor }) {
    return <div className = "flex flex-col gap-y-2 p-4 w-64 border-2">
        <div className = "mx-auto">
            <img src = {sponsor.image_url} className = "w-28 h-28  transition-transform ease-in-out hover:scale-110" alt = {sponsor.name + " image"}/>
        </div>
        <p className = "text-3xl text-center">{sponsor.name}</p>
        <p className="flex-grow">{sponsor.summary}</p>

        <div className = "flex flex-wrap gap-2 mx-auto">

            {sponsor.website_url &&
                <SocialIcon url = {sponsor.website_url} network = "sharethis" className = "social-icon" fgColor = "#FFFFFF" target = "_blank" style = {{
                    width: undefined,
                    height: undefined
                }}/>}

            {sponsor.github_user &&
                <SocialIcon url = {`https://github.com/${sponsor.github_user}`} network = "github" className = "social-icon" fgColor = "#FFFFFF" target = "_blank" style = {{
                    width: undefined,
                    height: undefined
                }}/>}

            {sponsor.subreddit &&
                <SocialIcon url = {`https://reddit.com/r/${sponsor.subreddit}`} network = "reddit" className = "social-icon" fgColor = "#FFFFFF" target = "_blank" style = {{
                    width: undefined,
                    height: undefined
                }}/>}

            {sponsor.twitter_handle &&
                <SocialIcon url = {`https://twitter.com/${sponsor.twitter_handle}`} network = "twitter" className = "social-icon" fgColor = "#FFFFFF" target = "_blank" style = {{
                    width: undefined,
                    height: undefined
                }}/>}

            {sponsor.discord &&
                <SocialIcon url = {sponsor.discord} network = "discord" className = "social-icon" fgColor = "#FFFFFF" target = "_blank" style = {{
                    width: undefined,
                    height: undefined
                }}/>}


        </div>
    </div>;
}

export default function Home({ sponsors }: { sponsors: Sponsor[] }) {


    return (
        <Layout title = "Sponsored Repositories" description = {"Information about Sponsored Repositories"} canonical = "/sponsored">

            <PageTitle>Sponsors</PageTitle>
            <div className = "flex flex-wrap gap-8 justify-between">

                {sponsors.map(value => <Sponsor sponsor = {value} key = {value.id}/>)}
            </div>

        </Layout>
    );
}

export async function getStaticProps(context): Promise<GetStaticPropsResult<{ sponsors: Sponsor[] }>> {

    const sponsors = (await prisma.sponsor.findMany({
        select: {
            id: true,
            name: true,
            image_url: true,
            summary: true,
            website_url: true,
            github_user: true,
            discord: true,
            subreddit: true,
            twitter_handle: true
        }
    }));
    shuffleArray(sponsors);
    return {
        props: { sponsors },
        revalidate: 60
    };
}
