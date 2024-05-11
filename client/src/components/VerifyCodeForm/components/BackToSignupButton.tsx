import { NavLink } from "react-router-dom";
import returnImage from "@/components/VerifyCodeForm/images/return.png";
import React from "react";
import Image from "@/components/ui/Image.tsx";

interface BackToSignupButtonProps {
    route: string;
    text: string;
}

export default function BackToSignupButton({ route, text }: BackToSignupButtonProps) {
    return (
        <NavLink to={route} className="verification-code-auxiliary-button">
            <Image src={returnImage} alt="return" className="w-4 mr-1" />
            {text}
        </NavLink>
    );
}
