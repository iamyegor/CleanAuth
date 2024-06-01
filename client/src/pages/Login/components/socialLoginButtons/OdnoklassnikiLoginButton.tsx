import SocialLoginButton from "@/pages/Login/components/socialLoginButtons/SocialLoginButton.tsx";
import odnoklassnikiLogo from "@/pages/Login/images/ok-logo.png";

export default function OdnoklassnikiLoginButton() {
    return (
        <SocialLoginButton
            logo={odnoklassnikiLogo}
            alt="Odnoklassniki"
            id="odnoklassnikiSignInButton"
        />
    );
}
