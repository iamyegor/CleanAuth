import React, { useEffect } from "react";
import SocialLoginButton from "@/pages/Login/components/socialLoginButtons/SocialLoginButton.tsx";
import googleLogo from "@/pages/Login/images/google.png";
import api from "@/lib/api.ts";
import { AxiosError, AxiosResponse } from "axios";
import { RouteError } from "@/types/RouteError.ts";
import { useNavigate } from "react-router-dom";
import GoogleSignInResponse from "@/pages/Login/types/GoogleSignInResponse.ts";

export default function GoogleLoginButton() {
    const navigate = useNavigate();
    const [invisibleGoogleButton, setInvisibleGoogleButton] =
        React.useState<HTMLButtonElement | null>(null);

    useEffect(() => {
        // @ts-expect-error
        google.accounts.id.initialize({
            client_id: "518939268540-6962614tnerg2339gpk8nufrdbe888ra.apps.googleusercontent.com",
            callback: handleResponse,
        });

        setInvisibleGoogleButton(createInvisibleGoogleButton());
    }, []);

    function createInvisibleGoogleButton(): HTMLButtonElement {
        const buttonWrapper = document.createElement("div");
        buttonWrapper.style.display = "none";

        document.body.appendChild(buttonWrapper);

        // @ts-ignore
        google.accounts.id.renderButton(buttonWrapper, { type: "icon" });

        return buttonWrapper.querySelector("div[role=button]") as HTMLButtonElement;
    }

    async function handleResponse(response: any) {
        try {
            const serverResponse = (await api.post("api/google-signin", {
                idToken: response.credential,
            })) as AxiosResponse<GoogleSignInResponse>;

            const { status } = serverResponse.data;
            if (status == "needs_username") {
                navigate("/add-username");
            } else if (status == "needs_phone_number_verification") {
                navigate("/add-phone-number");
            } else {
                navigate("/");
            }
        } catch (err) {
            const error = err as AxiosError;
            if (error.status == 500) {
                throw RouteError.serverError();
            }

            throw RouteError.unexpected();
        }
    }

    function handleVisibleButtonClick() {
        invisibleGoogleButton?.click();
    }

    return <SocialLoginButton logo={googleLogo} alt="Google" onClick={handleVisibleButtonClick} />;
}
