import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";
import classNames from "classnames";
import "@/styles/login-input.css";
import ErrorMessage from "@/utils/ErrorMessage.ts";

interface InputFieldProps {
    type: string;
    name: string;
    placeholder: string;
    errorMessage?: ErrorMessage | null;
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
        <div className="space-y-4">
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                className={classes}
                defaultValue={defaultValue ?? ""}
                data-testid="InputField.Input"
            />
            <ErrorMessageComponent errorMessage={errorMessage ?? null} />
        </div>
    );
}
