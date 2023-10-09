import Layout from "../components/Layout";
import {getSession, useSession} from "next-auth/react";
import PageTitle from "../components/ui/PageTitle";
import {getAccount} from "../lib/utils";
import {Account, Claim} from "../lib/Types";
import prisma from "../lib/db";
import {GetServerSidePropsResult} from "next";
import {useFormik} from "formik";
import axios from "axios";
import * as yup from "yup";
import {useRouter} from "next/router";

const validationSchema = yup.object({
    firstName: yup.string()
            .max(191, "Must be 191 characters or less")
            .required("Required"),
    lastName: yup.string()
            .max(191, "Must be 191 characters or less")
            .required("Required"),
    address1: yup.string()
            .max(191, "Must be 191 characters or less")
            .required("Required"),
    address2: yup.string()
            .max(191, "Must be 191 characters or less")
            .notRequired(),
    city: yup.string()
            .max(191, "Must be 191 characters or less")
            .required("Required"),
    zip: yup.string()
            .max(191, "Must be 191 characters or less")
            .required("Required"),
    state: yup.string()
            .max(191, "Must be 191 characters or less")
            .required("Required"),
    country: yup.string()
            .max(191, "Must be 191 characters or less")
            .required("Required"),
    email: yup.string()
            .max(191, "Must be 191 characters or less")
            .required("Required"),
    feedback: yup.string()
            .notRequired()
});

function ClaimInput({
                        formik,
                        label,
                        id,
                        required = false,
                        inputClassName,
                        claimed
                    }: { formik: any, label: string, id: string, required?: boolean, inputClassName?: string, claimed: boolean }) {
    return <div className = "flex flex-col gap-y-2">
        <div className = "flex justify-between">
            <label htmlFor = {id} className = "flex-none font-semibold">{label}: {required &&
                    <span className = "text-red-500">*</span>}</label>

            {formik.touched[id] && formik.errors[id] ? (
                    <div className = "text-red-400">{formik.errors[id]}</div>
            ) : null}
        </div>
        <input
                disabled = {claimed}
                id = {id}
                name = {id}
                type = "text"
                onChange = {formik.handleChange}
                onBlur = {formik.handleBlur}
                value = {formik.values[id]}
                className = "p-2 bg-transparent border hover:border-orange-500 outline-none focus:border-orange-500"/>
    </div>;
}


export default function Claims({account, claim, validPrs, totalPrs}: { account: Account, claim: Claim, validPrs: number, totalPrs: number }) {

    const {data, status} = useSession();
    const router = useRouter()

    let existingClaim: Claim = claim ?? {
        id: "",
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        city: "",
        zip: "",
        state: "",
        country: "",
        email: "",
        feedback: ""
    }
    const formik = useFormik({
        initialValues: existingClaim,
        validationSchema: validationSchema,
        onSubmit: async (values, formikHelpers) => {
            formikHelpers.setSubmitting(true);
            await axios.post(`/api/claim`, values);
            formikHelpers.setSubmitting(false);
            formikHelpers.resetForm({values});
            router.reload()

        }
    });

    console.log(claim);
    return <Layout title = "Claim your prizes" canonical = "/claim" description = {"Enter your shipping information to claim your prize"}>

        <PageTitle>
            <h1 className = "text-center">
                🎉 Claim your prize 🎉
            </h1>
        </PageTitle>

        {claim && <div className = "text-center text-2xl">
            <h2>
                You&apos;ve claimed your prize, your claim id is: <pre>{claim.id}</pre>
            </h2>

            <h3>
                If you need to update any of your information, please reach out to us on discord and give us the claim id
            </h3>
        </div>}

        {(validPrs >= 4 || claim) && <form onSubmit = {formik.handleSubmit} className = "flex flex-col gap-2 max-w-prose mx-auto">
            <ClaimInput claimed = {!!claim} formik = {formik} id = {"firstName"} label = {"First Name"} required = {true}/>
            <ClaimInput claimed = {!!claim} formik = {formik} id = {"lastName"} label = {"Last Name"} required = {true}/>
            <ClaimInput claimed = {!!claim} formik = {formik} id = {"address1"} label = {"Delivery Address"} required = {true}/>
            <ClaimInput claimed = {!!claim} formik = {formik} id = {"address2"} label = {"Delivery Address Line 2 (Apt No., Suite)"} required = {false}/>
            <ClaimInput claimed = {!!claim} formik = {formik} id = {"zip"} label = {"Zip"} required = {true}/>
            <ClaimInput claimed = {!!claim} formik = {formik} id = {"city"} label = {"City"} required = {true}/>
            <ClaimInput claimed = {!!claim} formik = {formik} id = {"state"} label = {"State"} required = {true}/>
            <ClaimInput claimed = {!!claim} formik = {formik} id = {"country"} label = {"Country"} required = {true}/>
            <ClaimInput claimed = {!!claim} formik = {formik} id = {"email"} label = {"Email"} required = {true}/>

            <div className = "flex flex-col gap-y-2">
                <div className = "flex gap-x-2">

                    <label htmlFor = "feedback" className = "flex-none font-semibold">Feedback: </label>

                    {formik.touched.feedback && formik.errors.feedback ? (
                            <div className = "ml-auto text-red-400">{formik.errors.feedback}</div>
                    ) : null}
                </div>

                <textarea
                        disabled = {!!claim}
                        id = "feedback"
                        name = "feedback"
                        onChange = {formik.handleChange}
                        onBlur = {formik.handleBlur}
                        value = {formik.values.feedback}
                        className = "p-2 bg-transparent border hover:border-orange-500 outline-none focus:border-orange-500 min-h-[8rem]"
                />

            </div>

            {!claim && <button disabled = {!!claim}  type = "submit" className = "p-2 border hover:border-orange-500">
                Submit
            </button>}
        </form>}

        {!claim && validPrs < 4 && <div className = "text-center">
            {totalPrs >= 4 ? <div>
                <h2 className = "text-2xl">
                    Unfortunately only {validPrs} of your {totalPrs} pull request(s) are valid, and you are unable to claim your prize!
                </h2>

                <h3 className = "text-xl">
                    You can check the status of your other pull requests on your profile page
                </h3>
            </div> : <div>
                <h2>
                    You have only made {validPrs} valid pull request(s) and are unable to claim your prize yet!
                </h2>
            </div>}
        </div>}
    </Layout>;

}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<{
    account: Account,
    claim: Claim,
    validPrs: number,
    totalPrs: number
}>> {
    const session = await getSession(context);
    if (!session || !(await getAccount({right: session}))) {
        return {
            redirect: {
                destination: "/403?url=/claim",
                permanent: false
            }
        };
    }

    const account = await getAccount({right: session});
    const claim: Claim = (await prisma.claim.findFirst({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            address1: true,
            address2: true,
            city: true,
            zip: true,
            state: true,
            country: true,
            email: true,
            feedback: true,
        },
        where: {
            account_id: account.id
        }
    }));

    const prs = (await prisma.pullRequest.findMany({
        select: {
            PullRequestStatus: {
                select: {
                    invalid: true,
                    reviewed: true
                }
            }
        },
        where: {
            author_id: account.githubId
        }
    }))
    return {
        props: {
            account,
            claim: claim,
            validPrs: prs.filter(value => value.PullRequestStatus && value.PullRequestStatus.reviewed ? !value.PullRequestStatus.invalid : false).length,
            totalPrs: prs.length
        }
    };
}
