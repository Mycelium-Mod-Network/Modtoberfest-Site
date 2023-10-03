import Layout from "../components/Layout";
import {useRouter} from "next/router";
import LoginLink from "../components/LoginLink";

export default function Four0three() {
    let router = useRouter()
    let query = router.query;
    const url = query.url as string
    return <Layout title = "403 - forbidden" canonical = "/403" description = "forbidden">
        <div className = "text-center">
            <h1>You&apos;re not allowed to access that page.</h1>

            {query.url && <div>
                <h2><LoginLink callbackUrl={url}> Try logging in</LoginLink></h2>
            </div>}

        </div>
    </Layout>;
}
