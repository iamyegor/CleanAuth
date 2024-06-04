import classNames from "classnames";
import "@/styles/input.css";

interface InputFieldProps {
    type: string;
    name: string;
    placeholder: string;
    isInvalid?: boolean;
    defaultValue?: string;
    "data-testid"?: string;
}

export default function Input({
    type,
    name,
    placeholder,
    defaultValue,
    isInvalid,
    "data-testid": dataTestId,
}: InputFieldProps) {
    const classes = classNames("input__default", isInvalid ? "input__error" : "input__no-error");

    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            className={classes}
            defaultValue={defaultValue ?? ""}
            data-testid={dataTestId ?? "InputField.Input"}
        />
    );
}
