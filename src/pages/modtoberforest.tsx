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
                    This year we are working with <a href='https://tree-nation.com/' target='_blank' rel='noreferrer'>Tree-Nation</a> 
                    {" "} to bring you the Modtoberforest environmental initiative! In addition to the awesome prize packs that we send out, 
                    we will also be planting 1 tree for each valid Pull Request submitted as part of the event, up to 1000 trees!
                </p>

                <p>
                    So far we have planted <span className='font-extrabold text-yellow-600'>1</span> tree! You can check out our forest <a href='https://tree-nation.com/profile/modtoberforest' target='_blank' rel='noreferrer'>here</a>.
                </p>

                <p>
                    Are you a mod developer interested in starting your own forest on <a href='https://tree-nation.com/' target='_blank' rel='noreferrer'>Tree-Nation</a>? Reach out to us on Discord and we will 
                    send you a free tree via the ambassador program to get you started! There are no obligations once you have received the tree, 
                    however we challenge you to keep your forest growing by planting at least 1 tree for every 1 million downloads your project(s) 
                    receive.
                </p>

                <p>
                    Tree-Nation is a registered non-profit that collects funding on behalf of tree planting and reforestation projects. The Tree-Nation 
                    team works with experts and local communities to plant trees in a non-disruptive way that benefits the environment and local 
                    communities. Their projects range from reforesting areas lost to logging or wildfires, protecting endangered species, and helping 
                    with local agriculture. So far they have planted 27 million trees!
                </p>
            </div>
        </Layout>
    );
}
