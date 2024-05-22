import React, { useState } from "react";
import openedEyeImage from "@/assets/opened_eye.png";
import closedEyeImage from "@/assets/closed_eye.png";
import classNames from "classnames";
import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";
import Image from "@/components/ui/Image.tsx";
import ErrorMessage from "@/utils/ErrorMessage.ts";

interface PasswordInputProps {
    name: string;
    placeholder: string;
    errorMessage?: ErrorMessage | null;
    defaultValue?: string;
    handleErrorShown?: (isErrorShown: boolean) => void;
}

export default function PasswordInput({
    name,
    placeholder,
    errorMessage,
    defaultValue,
    handleErrorShown,
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
        <div className="space-y-6" data-testid="PasswordInput">
            <div className="relative">
                <input
                    type={isPasswordShown ? "text" : "password"}
                    name={name}
                    data-testid="PasswordInput.Input"
                    placeholder={placeholder}
                    className={classes}
                    defaultValue={defaultValue ?? ""}
                />
                <button
                    type="button"
                    data-testid="PasswordInput.ToggleVisibility"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-4 text-sm leading-5"
                >
                    {isPasswordShown ? (
                        <Image src={openedEyeImage} alt="eye" className="w-5" />
                    ) : (
                        <Image src={closedEyeImage} alt="eye" className="w-5" />
                    )}
                </button>
            </div>
            <ErrorMessageComponent
                errorMessage={errorMessage ?? null}
                handleErrorShown={handleErrorShown}
            />
        </div>
    );
}
