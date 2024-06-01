import GoogleLoginButton from "@/pages/Login/components/socialLoginButtons/GoogleLoginButton.tsx";
import VkLoginButton from "@/pages/Login/components/socialLoginButtons/VkLoginButton.tsx";
import OdnoklassnikiLoginButton from "@/pages/Login/components/socialLoginButtons/OdnoklassnikiLoginButton.tsx";

export default function SocialLoginButtons() {
    return (
        <div className="flex justify-center space-x-4 items-center">
            <OdnoklassnikiLoginButton />
            <GoogleLoginButton />
            <VkLoginButton />
        </div>
    );
}
