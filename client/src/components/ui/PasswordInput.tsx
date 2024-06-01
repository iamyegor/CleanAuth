import React, { useState } from "react";
import openedEyeImage from "@/assets/opened_eye.png";
import closedEyeImage from "@/assets/closed_eye.png";
import Image from "@/components/ui/Image.tsx";
import Input from "@/components/ui/Input.tsx";

interface PasswordInputProps {
    name: string;
    placeholder: string;
    defaultValue?: string;
    isInvalid?: boolean;
    "data-testid"?: string;
}

export default function PasswordInput({
    name,
    placeholder,
    defaultValue,
    isInvalid,
    "data-testid": dataTestId,
}: PasswordInputProps) {
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordShown(!isPasswordShown);
    };

    return (
        <div className="space-y-6" data-testid="PasswordInput">
            <div className="relative">
                <Input
                    type={isPasswordShown ? "text" : "password"}
                    name={name}
                    placeholder={placeholder}
                    data-testid={dataTestId ?? "PasswordInput.Input"}
                    defaultValue={defaultValue ?? ""}
                    isInvalid={isInvalid}
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
        </div>
    );
}
