import React, { useState } from "react";
import classNames from "classnames";
import Image from "@/components/ui/Image.tsx";
import openedEyeImage from "@/assets/opened_eye.png";
import closedEyeImage from "@/assets/closed_eye.png";
import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";
import LoginError from "@/pages/Login/types/LoginError.ts";
import useLoginPageInputError from "@/hooks/useLoginPageInputError.ts";

interface LoginPasswordInputProps {
    loginError: LoginError | null;
}

export default function LoginPagePasswordInput({ loginError }: LoginPasswordInputProps) {
    const { shouldApplyErrorClass, errorMessage } = useLoginPageInputError(loginError, "password");
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordShown(!isPasswordShown);
    };

    const classes = classNames(
        "login-input__default",
        shouldApplyErrorClass ? "login-input__error" : "login-input__no-error",
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <input
                    type={isPasswordShown ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className={classes}
                />
                <button
                    type="button"
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
            <ErrorMessageComponent errorMessage={errorMessage ?? null} />
        </div>
    );
}
