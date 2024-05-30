import appleLogo from "@/pages/Login/images/apple.png";
import vkLogo from "@/pages/Login/images/vk.png";
import SocialLoginButton from "@/pages/Login/components/socialLoginButtons/SocialLoginButton.tsx";
import BiggerSocialLoginButton from "@/pages/Login/components/socialLoginButtons/BiggerSocialLoginButton.tsx";
import GoogleLoginButton from "@/pages/Login/components/socialLoginButtons/GoogleLoginButton.tsx";

export default function SocialLoginButtons() {
    return (
        <div className="flex justify-center space-x-4 items-center">
            <GoogleLoginButton />
            <BiggerSocialLoginButton logo={appleLogo} alt="Apple" />
            <SocialLoginButton logo={vkLogo} alt="VK" />
        </div>
    );
}
