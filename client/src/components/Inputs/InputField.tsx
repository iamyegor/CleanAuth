import ErrorMessage from "@/components/ui/ErrorMessage.tsx";
import classNames from "classnames";
import "@/components/Inputs/login-input.css";

interface InputFieldProps {
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
    errorMessage,
    defaultValue,
}: InputFieldProps) {
    const classes = classNames(
        "login-input__default",
        errorMessage ? "login-input__error" : "login-input__no-error",
    );

    return (
        <div className="mb-4">
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