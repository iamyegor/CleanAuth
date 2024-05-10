import { NavLink } from "react-router-dom";
import returnImage from "@/components/VerifyCodeForm/images/return.png";
import React from "react";

interface BackToSignupButtonProps {
    route: string;
    text: string;
}

export default function BackToSignupButton({ route, text }: BackToSignupButtonProps) {
    return (
        <NavLink to={route} className="verification-code-auxiliary-button">
            <img src={returnImage} alt="return" className="w-4 mr-1" />
            {text}
        </NavLink>
    );
}
