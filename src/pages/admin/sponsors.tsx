import Layout from "../../components/Layout";
import { GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";
import { getAccount } from "../../lib/utils";
import prisma from "../../lib/db";
import classNames from "classnames";
import PageTitle from "../../components/ui/PageTitle";
import { Dispatch, SetStateAction, useState } from "react";
import { Field, useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { TrashIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { Sponsor } from "../../lib/Types";
import { FormInput } from "../../components/form/FormInput";

const validationSchema = yup.object({
    name: yup.string()
        .max(191, "Must be 191 characters or less")
        .required("Required"),
    image_url: yup.string()
        .max(191, "Must be 191 characters or less")
        .required("Required"),
    summary: yup.string()
        .required(),
    website_url: yup.string().notRequired(),
    github_user: yup.string().notRequired(),
    twitter_handle: yup.string().notRequired(),
    subreddit: yup.string().notRequired(),
    discord: yup.string().notRequired()
});

function Sponsor({ sponsorDetails, setCurrentSponsors }: { sponsorDetails: Sponsor, setCurrentSponsors: Dispatch<SetStateAction<Sponsor[]>> }) {
    const [sponsor] = useState<Sponsor>(sponsorDetails);
    const formik = useFormik({
        initialValues: sponsor,
        validationSchema: validationSchema,
        onSubmit: async (values, formikHelpers) => {
            formikHelpers.setSubmitting(true);
            await axios.post(`/api/admin/sponsors/update`, values);
            formikHelpers.setSubmitting(false);
            formikHelpers.resetForm({ values: values });
        },
        validateOnMount: true
    });

    return <form onSubmit = {formik.handleSubmit} className = "flex flex-col sm:flex-row gap-y-2 sm:gap-y-0 sm:gap-x-2 rounded border-2 border-cyan-400 even:bg-black even:bg-opacity-10">
        <img src = {formik.values.image_url} alt = {`${formik.values.name} image`} className = "m-4 w-24 h-24"/>

        <div className = "flex flex-col flex-grow gap-y-2 my-4">
            <FormInput formik = {formik} label = "Name" id = "name" inputClassName = "sm:w-80"/>

            <FormInput formik = {formik} label = "Image URL" id = "image_url" inputClassName = "sm:w-80"/>
            <FormInput formik = {formik} id = {"website_url"} label = {"Website URL"} inputClassName = "sm:w-80"/>
            <FormInput formik = {formik} id = {"github_user"} label = {"github username"} inputClassName = "sm:w-80"/>
            <FormInput formik = {formik} id = {"twitter_handle"} label = {"Twitter Username"} inputClassName = "sm:w-80"/>
            <FormInput formik = {formik} id = {"subreddit"} label = {"Subreddit"} inputClassName = "sm:w-80"/>
            <FormInput formik = {formik} id = {"discord"} label = {"Discord"} inputClassName = "sm:w-80"/>

            <div className = "flex flex-col gap-y-2">
                <div className = "flex gap-x-2">

                    <label htmlFor = "summary" className = "w-32">Summary: </label>

                    {formik.touched.summary && formik.errors.summary ? (
                        <div className = "ml-auto text-red-400">{formik.errors.summary}</div>
                    ) : null}
                </div>

                <textarea
                    id = "summary"
                    name = "summary"
                    onChange = {formik.handleChange}
                    onBlur = {formik.handleBlur}
                    value = {formik.values.summary}
                    className = "text-base bg-transparent focus:bg-black focus:bg-opacity-10 min-h-[4rem] outline outline-cyan-400 focus:outline-2 focus:outline-cyan-300"
                />

            </div>
        </div>

        <div className = "flex flex-col w-2/12 border-l-2 border-cyan-400">
            <div className = {classNames({}, "bg-red-700 hover:bg-red-600 flex h-1/3 bg-opacity-75 border-b-2 border-cyan-400")}>
                <button className = "flex w-full h-full" onClick = {async event => {
                    event.preventDefault();
                    axios.post(`/api/admin/sponsors/delete`, {
                        id: sponsor.id
                    }).then(value => {
                        setCurrentSponsors(sponsors => {
                            return sponsors.filter(sponsor => sponsor.id !== value.data.id);
                        });
                    });
                }}>
                    <div className = "flex gap-x-1 m-auto">
                        <TrashIcon className = "my-auto w-4 h-4"/>

                        <span>Delete</span>
                    </div>
                </button>
            </div>
            <div className = {classNames({ "bg-green-600 hover:bg-green-500": formik.dirty }, "bg-green-700 flex h-1/3 bg-opacity-75 border-b-2 border-cyan-400")}>
                <button disabled = {!formik.dirty} className = "flex w-full h-full" type = "submit">
                    <div className = "flex gap-x-1 m-auto">
                        <WrenchScrewdriverIcon className = "my-auto w-4 h-4"/>

                        <span>Submit Edit</span>
                    </div>
                </button>
            </div>

        </div>
    </form>;
}


function AddSponsorForm({
    setAddingSponsor,
    setCurrentSponsors
}: { setAddingSponsor: (adding: boolean) => void, setCurrentSponsors: Dispatch<SetStateAction<Sponsor[]>> }) {

    const formik = useFormik({
        initialValues: {
            name: "",
            image_url: "",
            summary: "",
            website_url: "",
            github_user: "",
            twitter_handle: "",
            subreddit: "",
            discord: ""
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            axios.post("/api/admin/sponsors/create", values).then(value => {
                setAddingSponsor(false);
                setCurrentSponsors((currentSponsors: Sponsor[]) => {
                    return [...currentSponsors, { id: value.data.id, ...values }];
                });
            });
        }
    });

    return <div className = "flex flex-col my-2 mx-4">
        <div className = "pb-2 mb-4 text-2xl text-center border-b-2">
            Adding Sponsor
        </div>
        <form onSubmit = {formik.handleSubmit} className = "flex flex-col gap-2">
            <FormInput formik = {formik} id = {"name"} label = {"Name"} required = {true}/>

            <FormInput formik = {formik} id = {"image_url"} label = {"Image URL"} required = {true}/>

            <div className = "flex flex-col gap-y-2">
                <div className = "flex gap-x-2">

                    <label htmlFor = "summary" className = "w-32">Summary: <span className = "text-red-500">*</span></label>

                    {formik.touched.summary && formik.errors.summary ? (
                        <div className = "ml-auto text-red-400">{formik.errors.summary}</div>
                    ) : null}
                </div>

                <textarea
                    id = "summary"
                    name = "summary"
                    onChange = {formik.handleChange}
                    onBlur = {formik.handleBlur}
                    value = {formik.values.summary}
                    className = "text-base bg-transparent focus:bg-black focus:bg-opacity-10 min-h-[4rem] outline outline-cyan-400 focus:outline-2 focus:outline-cyan-300"
                />

            </div>

            <FormInput formik = {formik} id = {"website_url"} label = {"Website URL"}/>
            <FormInput formik = {formik} id = {"github_user"} label = {"github username"}/>
            <FormInput formik = {formik} id = {"twitter_handle"} label = {"Twitter Username"}/>
            <FormInput formik = {formik} id = {"subreddit"} label = {"Subreddit"}/>
            <FormInput formik = {formik} id = {"discord"} label = {"Discord"}/>

            <div className = "flex gap-x-2">
                <button className = "w-1/2 bg-green-800 bg-opacity-30 border-2 border-green-400 hover:bg-opacity-50" type = "submit">
                    Add Sponsor
                </button>
                <button className = "w-1/2 bg-red-800 bg-opacity-30 border-2 border-red-400 hover:bg-opacity-50" onClick = {(e) => setAddingSponsor(false)}>
                    Cancel
                </button>
            </div>
        </form>
    </div>;
}

export default function Sponsors({ sponsors }: { sponsors: Sponsor[] }) {
    const [addingSponsor, setAddingSponsor] = useState<boolean>(false);

    const [currentSponsors, setCurrentSponsors] = useState<Sponsor[]>(sponsors);


    return <Layout canonical = "/admin/sponsors" title = "Sponsors" description = "Sponsors">

        <PageTitle> Sponsors (Total: {currentSponsors.length}) </PageTitle>

        <div className = {classNames({
            "hover:bg-opacity-20 hover:border-cyan-400 hover:text-cyan-400 text-center": !addingSponsor
        }, "w-full border-2 text-xl bg-black bg-opacity-10 grid mb-4")}>
            {addingSponsor && <AddSponsorForm setAddingSponsor = {setAddingSponsor} setCurrentSponsors = {setCurrentSponsors}/>}

            {!addingSponsor && <button onClick = {(e) => setAddingSponsor(true)}>Add Sponsor</button>}
        </div>
        <div className = "flex flex-col gap-y-4">
            {currentSponsors.map(value => <Sponsor sponsorDetails = {value} key = {value.name} setCurrentSponsors = {setCurrentSponsors}/>)}
        </div>

    </Layout>;
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<{ sponsors: Sponsor[] }>> {

    const session = await getSession(context);
    if (!session || !(await getAccount({ right: session })).admin) {
        return {
            redirect: {
                destination: "/403",
                permanent: false
            }
        };
    }


    const sponsors = (await prisma.sponsor.findMany({
        select: {
            id: true,
            name: true,
            image_url: true,
            summary: true,
            website_url: true,
            github_user: true,
            discord: true,
            subreddit: true,
            twitter_handle: true
        }
    }));
    return { props: { sponsors } };
}
