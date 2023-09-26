import Layout from "../components/Layout";
import PageTitle from "../components/ui/PageTitle";
import LinkTo from "../components/ui/LinkTo";
import { Item } from "../components/ui/Item";

export default function Rules() {
    return (
        <Layout title = "Rules" description = "Rules of the event" canonical = "/rules">
            <div className = "mx-auto max-w-prose prose prose-invert">
                <PageTitle>Rules</PageTitle>
                <p>
                    See the <LinkTo href = "/faq" className = "font-bold">FAQ</LinkTo>
                </p>
                <div className = "mx-auto rules">
                    <Item title = {"Rules"} multi = {true}>
                        <ol>
                            <li>You must sign up before the end of October 2023.</li>
                            <li>Pull requests must be made during October 2023.</li>
                            <li>
                                Only pull requests against GitHub repositories on our <LinkTo href = "/repositories">participating projects
                                list</LinkTo> count towards your progress in the challenge.
                            </li>
                            <li>
                                You must submit a total of <strong>four</strong> pull requests to any of the <LinkTo href = "/repositories">participating repositories</LinkTo>
                            </li>
                            <li>Pull requests must meet our quality standards.</li>
                            <li>
                                Rewards and prizes for completing the challenge are limited to one per person.
                            </li>
                        </ol>
                        <p>
                            In addition to these rules, any attempt to abuse, impede, disrupt, tamper, hack, or meddle in this event will disqualify
                            you from participating.
                        </p>
                    </Item>

                    <Item title = {"Quality Control"} multi = {true}>
                        <p>
                            To ensure a minimum standard of quality the following types of pull requests will not contribute to your challenge goals.
                            We will be manually reviewing all PRs to ensure this policy is enforced.
                        </p>
                        <ul className = "list-disc">
                            <li>Pull requests that have been scripted or automated.</li>
                            <li>Pull requests that hurt a project more than they help.</li>
                            <li>
                                Pull requests that focus on minor changes such as whitespace, indenting, typos, and optimizing assets and images.
                            </li>
                        </ul>
                        <p>
                            Additionally any project maintainer may mark your pull request with the invalid label which will automatically disqualify
                            that pull request from our systems.
                        </p>
                    </Item>
                </div>

            </div>
        </Layout>
    );
}
