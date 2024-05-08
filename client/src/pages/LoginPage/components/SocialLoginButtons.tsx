import googleLogo from "@/pages/LoginPage/images/google.png";
import appleLogo from "@/pages/LoginPage/images/apple.png";
import vkLogo from "@/pages/LoginPage/images/vk.png";
import SocialLoginButton from "@/pages/LoginPage/components/SocialLoginButton.tsx";
import BiggerSocialLoginButton from "@/pages/LoginPage/components/BiggerSocialLoginButton.tsx";

export default function SocialLoginButtons() {
    return (
        <div className="flex justify-center space-x-4 items-center">
            <SocialLoginButton logo={googleLogo} alt="Google" />
            <BiggerSocialLoginButton logo={appleLogo} alt="Apple" />
            <SocialLoginButton logo={vkLogo} alt="VK" />
        </div>
    );
}
