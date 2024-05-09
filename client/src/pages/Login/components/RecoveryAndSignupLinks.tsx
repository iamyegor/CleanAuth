import classNames from "classnames";
import { NavLink } from "react-router-dom";
import BaseProps from "@/pages/Signup/types/BaseProps.ts";

export default function RecoveryAndSignupLinks({ additionalClasses }: BaseProps) {
    return (
        <div className={classNames("text-right flex justify-between", additionalClasses)}>
            <div className="text-sm">
                <span>Don't have an account? </span>
                <NavLink to="/signup" className="text-blue-500 hover:underline">
                    Sign up!
                </NavLink>
            </div>
            <NavLink to="/recovery-password" className="text-sm text-gray-500 hover:underline">
                Recovery password
            </NavLink>
        </div>
    );
}
