import ErrorMessage from "@/components/ui/ErrorMessage.tsx";
import classNames from "classnames";
import "@/components/Inputs/login-input.css";

interface InputFieldProps {
    type: string;
    name: string;
    placeholder: string;
    errorMessage?: string;
    defaultValue?: string;
    extraBottomMargin?: boolean;
    disableBottomMargin?: boolean;
}

export default function InputField({
    type,
    name,
    placeholder,
    errorMessage,
    defaultValue,
    extraBottomMargin,
    disableBottomMargin,
}: InputFieldProps) {
    const classes = classNames(
        "login-input__default",
        errorMessage ? "login-input__error" : "login-input__no-error",
    );

    function getMarginClass(): string {
        if (disableBottomMargin) {
            return "";
        }
        
        return extraBottomMargin && !errorMessage ? "mb-8" : "mb-4";
    }

    return (
        <div className={getMarginClass()}>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                className={classes}
                defaultValue={defaultValue ?? ""}
            />
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </div>
    );
}
