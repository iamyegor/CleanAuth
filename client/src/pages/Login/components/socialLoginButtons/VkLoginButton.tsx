import SocialLoginButton from "@/pages/Login/components/socialLoginButtons/SocialLoginButton.tsx";
import vkLogo from "@/pages/Login/images/vk.png";
import * as vk from "@vkid/sdk";
import { useEffect } from "react";

export default function VkLoginButton() {
    useEffect(() => {
        const loginButton = document.getElementById("vkSignInButton");
        if (loginButton) {
            loginButton.onclick = () => vk.Auth.login();
        }

        vk.Config.set({
            app: 51934884,
            redirectUrl: "http://localhost/vk-auth-redirect",
            state: "just_a_random_state_united_state",
        });
    }, []);

    return <SocialLoginButton logo={vkLogo} alt="VK" id="vkSignInButton" />;
}
