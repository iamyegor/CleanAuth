import React, { useEffect } from "react";
import googleLogo from "@/pages/Login/images/google.png";
import api from "@/lib/api.ts";
import { AxiosError, AxiosResponse } from "axios";
import { RouteError } from "@/types/RouteError.ts";
import { useNavigate } from "react-router-dom";
import SocialSignInResponse from "@/types/SocialSignInResponse.ts";
import BiggerSocialLoginButton from "@/pages/Login/components/socialLoginButtons/BiggerSocialLoginButton.tsx";

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
            const serverResponse = (await api.post("google-signin", {
                idToken: response.credential,
            })) as AxiosResponse<SocialSignInResponse>;

            const { authStatus } = serverResponse.data;
            console.log(authStatus);
            if (authStatus == "NewUser") {
                navigate("/add-username");
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

    return (
        <BiggerSocialLoginButton
            logo={googleLogo}
            alt="Google"
            onClick={handleVisibleButtonClick}
        />
    );
}
