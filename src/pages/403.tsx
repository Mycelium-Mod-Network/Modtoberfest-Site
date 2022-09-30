import Layout from "../components/Layout";

export default function four0three() {
    return <Layout title = "403 - forbidden" canonical = "/403" description = "forbidden">
        <h1 className = "text-center">You&apos;re not allowed to access that page.</h1>
    </Layout>;
}