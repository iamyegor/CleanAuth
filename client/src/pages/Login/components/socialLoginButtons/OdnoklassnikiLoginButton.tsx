import odnoklassnikiLogo from "@/pages/Login/images/ok-logo.png";
import Image from "@/components/ui/Image.tsx";
import { NavLink } from "react-router-dom";

export default function OdnoklassnikiLoginButton() {
    function redirectLink() {
        const clientId = "512002069707";
        const scope = "VALUABLE_ACCESS";
        const redirectUri = "http://localhost:80/odnoklassniki-auth-redirect";
        const state = "just_a_random_state_united_state";

        return `https://connect.ok.ru/oauth/authorize?client_id=${clientId}&scope=${scope}&response_type=token&redirect_uri=${redirectUri}&state=${state}`;
    }

    return (
        <NavLink
            to={redirectLink()}
            className="p-2 bg-transparent border border-gray-300 rounded-md
            shadow-sm px-5 hover:border-gray-200 hover:shadow-md transition select-none group"
            type="button"
        >
            <Image
                src={odnoklassnikiLogo}
                alt="Odnoklassniki"
                className="w-8 h-8 group-hover:scale-110 transition-transform duration-300"
            />
        </NavLink>
    );
}
