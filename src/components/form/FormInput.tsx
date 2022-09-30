import classNames from "classnames";
import { PropsWithChildren } from "react";

export function FormInput({
    formik,
    label,
    id,
    required = false,
    inputClassName
}: { formik: any, label: string, id: string, required?: boolean, inputClassName?: string }): JSX.Element {
    return <div className = "flex gap-x-2">
        <label htmlFor = {id} className = "flex-none">{label}: {required && <span className = "text-red-500">*</span>}</label>

        <div className = "flex gap-x-2 ml-auto">
            {formik.touched[id] && formik.errors[id] ? (
                <div className = "text-red-400">{formik.errors[id]}</div>
            ) : null}

            <input
                id = {id}
                name = {id}
                type = "text"
                onChange = {formik.handleChange}
                onBlur = {formik.handleBlur}
                value = {formik.values[id]}
                className = {classNames("bg-transparent focus:bg-black focus:bg-opacity-10 outline focus:outline-2 outline-cyan-400 focus:outline-cyan-300", inputClassName)}
            />

        </div>

    </div>;
}

export function FormSelect({
    children,
    formik,
    label,
    id,
    required = false,
    inputClassName
}: PropsWithChildren<{ formik: any, label: string, id: string, required?: boolean, inputClassName?: string }>): JSX.Element {
    return <div className = "flex gap-x-2">
        <label htmlFor = {id} className = "flex-none">{label}: {required && <span className = "text-red-500">*</span>}</label>

        <div className = "flex gap-x-2 ml-auto">
            {formik.touched[id] && formik.errors[id] ? (
                <div className = "text-red-400">{formik.errors[id]}</div>
            ) : null}

            <select
                id = {id}
                name = {id}
                onChange = {formik.handleChange}
                onBlur = {formik.handleBlur}
                value = {formik.values[id]}
                className = {classNames(" outline focus:outline-2 outline-cyan-400 focus:outline-cyan-300 text-black", inputClassName)}
            >
                {!required && <option value = {""}>None</option>} {children}
            </select>

        </div>

    </div>;
}