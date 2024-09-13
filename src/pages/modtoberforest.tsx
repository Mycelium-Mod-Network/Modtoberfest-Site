import Layout from "../components/Layout";
import Image from 'next/image';

export default function Home() {
    return (
        <Layout title = "Modtoberforest" description = "Learn more about the modtoberforest environmental initiative!" canonical = "/modtoberforest">
            
            <div className = "flex w-full">
                <div className = "mx-auto my-8">
                    <Image src = {"https://assets.blamejared.com/modtoberfest/sponsors/modtoberforest.png"} width = {192} height = {192} alt = "logo"/>
                </div>
            </div>

            <div className = "mx-auto max-w-prose text-lg prose prose-invert">

                <p>
                    Modtoberfest has partnered with <a href='https://tree-nation.com/' target='_blank' rel='noreferrer'>Tree-Nation</a> to start the
                    Modtober Forest Environmental Initiative! This year we will be planting one tree for each participant who submits at least one
                    valid pull request to a participating project.
                </p>

                <p>
                    Tree-Nation is a registered non-profit that collects funding on behalf of tree planting and reforestation projects. The Tree-Nation
                    team works with experts and local communities to plant trees in a non-disruptive way that benefits the environment and local
                    communities. Their projects range from reforesting areas lost to logging or wildfires, protecting endangered species, and helping
                    with local agriculture. So far they have planted over 34 million trees!
                </p>

                <p>
                    So far we have planted <span className='font-extrabold text-yellow-600'>501</span> trees! Over their
                    lifetime it is estimated that these trees will capture 103.14 tonnes of CO2. You can find our digital forest <a href='https://tree-nation.com/profile/modtoberforest' target='_blank' rel='noreferrer'>here</a>.
                </p>

                <h2>History</h2>
                <ul>
                    <li>2022 - 201 trees</li>
                    <li>2023 - 300 trees</li>
                </ul>
            </div>
        </Layout>
    );
}
