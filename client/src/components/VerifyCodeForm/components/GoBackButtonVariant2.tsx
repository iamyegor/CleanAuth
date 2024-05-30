import { NavLink } from "react-router-dom";
import returnImage from "@/components/VerifyCodeForm/images/return.png";
import React from "react";
import Image from "@/components/ui/Image.tsx";

interface GoBackButtonProps {
    route: string;
    text: string;
}

export default function GoBackButtonVariant2({ route, text }: GoBackButtonProps) {
    return (
        <NavLink
            to={route}
            className="verification-code-auxiliary-button"
            data-testid="GoBackButton"
        >
            <Image src={returnImage} alt="return" className="w-4 mr-1" />
            {text}
        </NavLink>
    );
}
