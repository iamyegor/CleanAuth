import { NavLink } from "react-router-dom";
import returnImage from "@/components/VerifyCodeForm/images/return.png";
import React from "react";

export default function BackToSignupButton() {
    return (
        <NavLink to={"/signup"} className="verification-code-auxiliary-button">
            <img src={returnImage} alt="return" className="w-4 mr-1" />
            Go back to signup
        </NavLink>
    );
}
