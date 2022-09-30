import Layout from "../components/Layout";
import PageTitle from "../components/ui/PageTitle";


export default function Home() {

    return (
        <Layout title = "Sponsored Repositories" description = {"Information about Sponsored Repositories"} canonical = "/sponsored">
            <div className = "mx-auto mb-32 max-w-prose prose prose-invert">
                <PageTitle>Sponsored Repositories</PageTitle>
                <p>
                    Modtoberfest is made possible through generous contributions from our sponsors. Sponsors are groups or projects within the
                    Minecraft community that have contributed in some way to the prize pack that we send out at the end of the event. Sponsored
                    projects are given a special icon on our repository page and will have increased visibility and promotion.
                </p>

                <p>
                    To sponsor the event, a project simply needs to contribute something to include in our prize packs. This is typically a sticker
                    featuring designs from their project or another type of promotional material. In exchange for sponsoring our event they may list
                    up to two GitHub repositories as sponsored which will give those repositories a special icon and make them more visible on the
                    website. If you are interested in sponsoring this event please reach out on our Discord.
                </p>

                <p>
                    Open source projects are not required to sponsor our event in order to be listed on the repositories page. To submit your
                    repository simply use our Google Form and we will review your entry and add it to our list.
                </p>
            </div>

        </Layout>
    );
}