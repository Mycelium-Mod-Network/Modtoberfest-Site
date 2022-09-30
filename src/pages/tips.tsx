import Layout from "../components/Layout";
import PageTitle from "../components/ui/PageTitle";
import { Item } from "../components/ui/Item";

export default function Tips() {
    return (
        <Layout
            title = "Tips"
            description = "Tips about how to participate in Modtoberfest."
            canonical = "/tips"
        >
            <div className = "mx-auto mb-32 max-w-prose prose prose-invert">
                <PageTitle>Tips</PageTitle>

                <Item title = {"How do I make a Pull Request?"}> The first step in making a Pull Request is to fork the target project on GitHub. This
                    creates a copy of the project that you can modify in any way you want. Edits can be made in the browser or you can clone your fork
                    and make the changes locally on your computer. Once the changes are done push them to GitHub. You can then go to the original
                    project and create a pull request. Make sure to select the compare across forks option. </Item>

                <Item title = {"What should my PR do?"}> The goal of Modtoberfest is to give back to open source projects in the Minecraft community.
                    You should always keep this in mind when opening a pull request. Looking at the issue tracker can be a great source of inspiration
                    for new pull requests, especially if the request has the help wanted label. If you speak another language localizing a project can
                    also be a very helpful way to contribute. You may also be able to add support for other projects, like adding JEI support to a mod
                    or helping tag items and blocks. If you are still stumped, join our Discord and someone will likely have something for you to
                    do. </Item>

                <Item title = {"Can non-coders still participate?"} multi = {true}>

                    <p>Yes, this event is not limited to developers! If you speak a non-english language then translating mods to other languages can
                        be a great way to participate in the challenge. Some projects may also welcome PRs to add support for constructed languages
                        like Pirate Speak that anyone can translate to with enough creativity. Remember to exercise caution when translating to joke
                        languages as they can easily devolve into spam and stop being helpful.
                    </p>

                    <p>
                        If you are an artist you can look into improving the textures of a project or even creating new textures for upcoming
                        features. It&apos;s good etiquette to reach out to those projects in advance as they may not want new textures. Communication
                        is key!
                    </p>

                    <p>
                        In modern versions of Minecraft a lot of game data and mod compatibility is moving to JSON files which anyone can edit. These
                        provide many unique opportunities for non-codders to contribute to projects. Adding support for other mods by providing data
                        files can be a great way to contribute to a mod.
                    </p>
                </Item>


            </div>
        </Layout>
    );
}
