import BaseProps from "@/pages/Signup/types/BaseProps.ts";
import ErrorMessage from "@/components/ui/ErrorMessage.tsx";
import classNames from "classnames";

interface InputFieldProps extends BaseProps {
    type: string;
    name: string;
    placeholder: string;
    errorMessage?: string;
}

export default function InputField({
    type,
    name,
    placeholder,
    additionalClasses,
    errorMessage,
}: InputFieldProps) {
    const defaultClasses =
        "w-full p-4 border rounded-md shadow-sm shadow-gray-200 outline-none " +
        "ring-offset-1 transition-all focus:border-white";

    const noErrorClasses = "ring-blue-400 focus:ring-2";
    const errorClasses = "ring-red-400 ring-2 border-white";

    const classes = classNames(defaultClasses, errorMessage ? errorClasses : noErrorClasses);
    
    return (
        <div className={additionalClasses}>
            <input type={type} name={name} placeholder={placeholder} className={classes} />
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </div>
    );
}
