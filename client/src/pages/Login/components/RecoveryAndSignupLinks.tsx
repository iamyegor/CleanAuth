import { NavLink } from "react-router-dom";

export default function RecoveryAndSignupLinks() {
    return (
        <div className="text-right flex justify-between mb-8">
            <div className="text-sm">
                <span className="hidden sm:inline-block sm:mr-1">Don't have an account?</span>
                <NavLink to="/signup" className="text-blue-500 hover:underline">
                    Sign up!
                </NavLink>
            </div>
            <NavLink to="/request-password-reset" className="text-sm text-gray-500 hover:underline">
                Reset password
            </NavLink>
        </div>
    );
}
