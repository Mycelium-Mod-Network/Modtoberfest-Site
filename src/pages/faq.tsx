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

                    <Item title = "What is Modtoberfest?">
                        Modtoberfest is a celebration of open source projects in the Minecraft community. During October we challenge the community
                        to give back to the open source projects at the heart of our community by contributing pull requests. Those who submit four
                        valid pull requests to participating <LinkTo href = "/repositories">community projects</LinkTo> will be eligible to receive a
                        free prize pack including stickers and pins designed by the sponsors of the event. You can <LoginLink>sign up</LoginLink> any
                        time during October.
                    </Item>


                    <Item title = "What is open source?">
                        Open source projects allow anyone to view or modify their source code. These projects are very important to the community as
                        they are great resources for learning and encourage collaboration within the community. Open source projects build the
                        foundation of many communities, including the Minecraft community.
                    </Item>

                    <Item title = "What is a pull request?">
                        Pull requests are a popular way to submit your changes to a project. This allows maintainer of the project to review your
                        changes. If your changes are approved they can be merged, allowing them to benefit from your work. Creating pull requests is
                        a great way to give back to an open source project.
                    </Item>

                    <Item title = "What is the Modtoberfest challenge?">
                        During October we challenge the community to participate in the open source Minecraft community by submitting four valid pull
                        requests to participating <LinkTo href = "/repositories">community projects</LinkTo>. Those who complete the challenge will
                        be eligible to receive a free prize pack in the mail that includes stickers and pins from various community projects. Please
                        check our <LinkTo href = "/rules">rules</LinkTo> for more information.
                    </Item>

                    <Item title = "Is there a prize for participating?">
                        Those who complete our challenge will be eligible to receive a prize pack containing stickers, pins, and other items from
                        projects in our community that have sponsored the event. Supplies are limited and will only be given out while they are
                        available. Prizes are also limited to one per person.
                    </Item>

                    <Item title = "Does the pull request need to be merged">
                        No, the pull request does not need to be merged. We only require that they pass our quality control policy, are not a draft
                        PR, and that the project maintainer does not flag your pull request as invalid or spam.
                    </Item>

                    <Item title = "What time zone does the event use?">
                        We use the UTC timezone for Modtoberfest. All pull request data is taken from GitHub's API which also uses UTC time.
                    </Item>

                    <Item title = "How are pull requests tracked?">
                        We track all pull requests created on participating repositories during October. This data is pulled from the GitHub API. For
                        us to track your data you must <LoginLink>sign up</LoginLink> for the event.
                    </Item>

                    <Item title = "Do pull requests made before signing up still count?">
                        Yes we can count any pull request made during the events timeframe. We will only count pull requests that follow our <LinkTo href = "/rules">rules</LinkTo>.
                    </Item>

                    <Item title = "Do commits count?">
                        No, we can only track pull requests. Additionally we can only credit pull requests to the author of the pull request on
                        GitHub. This means that Co-authors are not tracked or credited.
                    </Item>

                    <Item title = "How will the prizes be shipped?">
                        The prizes will be shipped through Canada Post. International shipping is supported in most countries. Please keep in mind
                        that you may be expected to pay customs, duties, or taxes depending on where you live. Tracking codes will not be available
                        replacements are not guaranteed due to the limited quantities of stickers available.
                    </Item>
                </div>
            </div>
        </Layout>
    );
}
