import React from "react";
import returnImage from "@/pages/RequestPasswordReset/images/return.png";
import { NavLink } from "react-router-dom";
import Image from "@/components/ui/Image.tsx";

interface GoBackButtonProps {
    route: string;
    text: string;
}

export default function GoBackButton({ text, route }: GoBackButtonProps) {
    return (
        <div className="flex justify-center mt-8">
            <NavLink
                to={route}
                className="flex items-center space-x-1 hover:underline"
                data-testid="GoBackButton.NavLink"
            >
                <Image src={returnImage} alt="Return" className="w-5 h-5 mx-auto" />
                <span>{text}</span>
            </NavLink>
        </div>
    );
}
