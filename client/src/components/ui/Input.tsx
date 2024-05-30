import classNames from "classnames";
import "@/styles/login-input.css";

interface InputFieldProps {
    type: string;
    name: string;
    placeholder: string;
    isInvalid?: boolean;
    defaultValue?: string;
}

export default function Input({
    type,
    name,
    placeholder,
    defaultValue,
    isInvalid,
}: InputFieldProps) {
    const classes = classNames(
        "login-input__default",
        isInvalid ? "login-input__error" : "login-input__no-error",
    );

    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            className={classes}
            defaultValue={defaultValue ?? ""}
            data-testid="InputField.Input"
        />
    );
}
