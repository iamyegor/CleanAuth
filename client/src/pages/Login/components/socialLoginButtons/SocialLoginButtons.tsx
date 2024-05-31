import appleLogo from "@/pages/Login/images/apple.png";
import BiggerSocialLoginButton from "@/pages/Login/components/socialLoginButtons/BiggerSocialLoginButton.tsx";
import GoogleLoginButton from "@/pages/Login/components/socialLoginButtons/GoogleLoginButton.tsx";
import VkLoginButton from "@/pages/Login/components/socialLoginButtons/VkLoginButton.tsx";

export default function SocialLoginButtons() {
    return (
        <div className="flex justify-center space-x-4 items-center">
            <GoogleLoginButton />
            <BiggerSocialLoginButton logo={appleLogo} alt="Apple" />
            <VkLoginButton/>
        </div>
    );
}
