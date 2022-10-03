import Layout from "../components/Layout";
import LoginLink from "../components/LoginLink";
import PageTitle from "../components/ui/PageTitle";
import LinkTo from "../components/ui/LinkTo";
import { Item } from "../components/ui/Item";


export default function Home() {
    return (
        <Layout title = "FAQ" description = "Frequently asked question" canonical = "/faq">
            <div className = "mx-auto max-w-prose prose prose-invert">
                <PageTitle> Frequently Asked Questions </PageTitle>

                <p>
                    See the <LinkTo href = "/rules" className = "font-bold">rules</LinkTo>.
                </p>
                <p>
                    See the <LinkTo href = "/repositories" className = "font-bold">repositories to contribute to</LinkTo>.
                </p>
                <div className = "prose prose-invert">

                    <Item title = "What is Modtoberfest?"> Modtoberfest is a celebration of Open Source in the Minecraft community. During October we
                        the community to contribute to open source <LinkTo href = "/repositories">community projects</LinkTo> by submitting pull
                        requests. Those who complete our challenge will be eligible for a free prize pack! You can <LoginLink>sign up</LoginLink> any
                        time during October. </Item>


                    <Item title = "What is open source?"> Open source projects allow anyone to view or modify their source code. Open source projects
                        are very important to the community as they are a great resource for learning and encouraging collaboration. Open source
                        projects serve as the foundation for many communities, including the Minecraft community. </Item>

                    <Item title = "What is a pull request?"> Pull requests are a way to submit your changes to a project back to the original. If the
                        original project approves your changes they can be merged, allowing them to benefit from your changes. Creating pull requests
                        is a great way to give back to open source projects. </Item>

                    <Item title = "What is the Modtoberfest challenge?"> During October we challenge the community to participate in the open source
                        Minecraft community by submitting pull requests to participating projects. To complete our challenge you must submit a valid
                        pull request to four projects on our <LinkTo href = "/repositories">list of participating projects.</LinkTo> See
                        our <LinkTo href = "/rules">rules</LinkTo> for more information. </Item>

                    <Item title = "Is there a prize for participating?"> Those who complete our challenge will be eligible to receive a prize pack
                        containing stickers, pins, and other promotional items from projects in our community. This prize pack will also include
                        exclusive stickers that will not be printed again. Supplies are limited and will only be given out while they are available.
                        Prizes are limited to one per person. </Item>

                    <Item title = "Does the pull request need to be merged"> No the pull request does not need to be merged. The only requirements are
                        that they pass our quality control policy and are not a draft PR. </Item>

                    <Item title = "What time zone does the event use?"> We use the UTC timezone for Modtoberfest. All pull request data is taken from
                        GitHub&apos;s API which also uses UTC time. </Item>

                    <Item title = "How are pull requests tracked?"> We track all pull requests created on participating repositories during October.
                        This data is pulled from the GitHub API. For us to track your data you must sign up for the event. </Item>

                    <Item title = "Do pull requests made before signing up still count?"> Yes we can count any pull request made during the event. We
                        will only count pull requests that follow our <LinkTo href = "/rules">rules</LinkTo>.</Item>

                    <Item title = "Do commits count?"> No, we can only track pull requests. Additionally we can only credit pull requests to the
                        author of the pull request. Co-authors are not tracked. </Item>

                    <Item title = "How will the prizes be shipped?"> Prizes will be shipped through Canada Post. International shipping is supported,
                        you can find the full list of supported countries <a
                            href = "https://www.canadapost.ca/tools/pg/manual/pgIntDest-e.asp?letter=A"
                            target = "_blank"
                            rel = "noreferrer"
                        > here</a>. Tracking information will not be provided for rewards and replacements are not guaranteed. </Item>
                </div>
            </div>
        </Layout>
    );
}
