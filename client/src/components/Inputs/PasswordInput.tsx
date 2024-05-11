import React, { useState } from "react";
import openedEyeImage from "@/components/Inputs/images/opened_eye.png";
import closedEyeImage from "@/components/Inputs/images/closed_eye.png";
import classNames from "classnames";
import ErrorMessage from "@/components/ui/ErrorMessage.tsx";

interface PasswordInputProps {
    name: string;
    placeholder: string;
    errorMessage?: string;
    defaultValue?: string;
    extraBottomMargin?: boolean;
}

export default function PasswordInput({
    name,
    placeholder,
    errorMessage,
    defaultValue,
    extraBottomMargin = false,
}: PasswordInputProps) {
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordShown(!isPasswordShown);
    };

    const classes = classNames(
        "login-input__default",
        errorMessage ? "login-input__error" : "login-input__no-error",
    );

    return (
        <div className={extraBottomMargin && !errorMessage ? "mb-8" : "mb-4"}>
            <div className="relative">
                <input
                    type={isPasswordShown ? "text" : "password"}
                    name={name}
                    placeholder={placeholder}
                    className={classes}
                    defaultValue={defaultValue ?? ""}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-4 text-sm leading-5"
                >
                    {isPasswordShown ? (
                        <img src={openedEyeImage} alt="eye" className="w-5" />
                    ) : (
                        <img src={closedEyeImage} alt="eye" className="w-5" />
                    )}
                </button>
            </div>
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </div>
    );
}
