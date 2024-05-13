import React from "react";
import { NavLink } from "react-router-dom";
import Image from "@/components/ui/Image.tsx";
import returnImage from "@/pages/RequestPasswordReset/images/return.png";

interface PasswordResetErrorMessageProps {
    errorMessage: string;
}

export default function PasswordResetErrorMessage({
    errorMessage,
}: PasswordResetErrorMessageProps) {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-center text-4xl font-bold text-red-500 mb-6">Error</h2>
            <p className="text-center text-lg text-red-500 mb-6">{errorMessage}</p>
            <NavLink
                to={"/request-password-reset"}
                className="flex justify-start items-center space-x-1 hover:underline"
            >
                <Image src={returnImage} alt="Return" className="w-5 h-5" />
                <span>Go back to request a new link</span>
            </NavLink>
        </div>
    );
}
