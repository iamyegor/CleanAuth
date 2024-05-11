import BaseProps from "@/pages/Signup/types/BaseProps.ts";
import ErrorMessage from "@/components/ui/ErrorMessage.tsx";
import classNames from "classnames";
import "@/components/ui/styles/login-input.css";

interface InputFieldProps extends BaseProps {
    type: string;
    name: string;
    placeholder: string;
    errorMessage?: string;
    defaultValue?: string;
}

export default function InputField({
    type,
    name,
    placeholder,
    additionalClasses,
    errorMessage,
    defaultValue,
}: InputFieldProps) {
    const classes = classNames(
        "login-input__default",
        errorMessage ? "login-input__error" : "login-input__no-error",
    );

    return (
        <div className={additionalClasses}>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                className={classes}
                defaultValue={defaultValue ?? ""}
            />
            {errorMessage && <ErrorMessage errorMessage={errorMessage} additionalClasses="mt-4"/>}
        </div>
    );
}
