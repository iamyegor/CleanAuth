import { useNavigate } from "react-router-dom";
import VkAuthData from "@/pages/VkAuthRedirect/types/VkAuthData.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import React, { useEffect, useState } from "react";
import vkLogo from "@/pages/Login/images/vk.png";
import BaseAuthRedirectPage from "@/components/ui/basePages/BaseAuthRedirectPage.tsx";
import handleSocialSignIn from "@/utils/handleSocialSignIn.ts";
import useThrownError from "@/hooks/useThrownError.ts";

export default function VkAuthRedirectPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
    const { setThrownError } = useThrownError();
    const navigate = useNavigate();

    useEffect(() => {
        handleVkSignIn()
            .then((errorMessage) => {
                if (errorMessage) {
                    setErrorMessage(errorMessage);
                    setIsLoading(false);
                }
            })
            .catch((error) => setThrownError(error));

        async function handleVkSignIn() {
            const queryParams = new URLSearchParams(window.location.search);
            const returnedPayloadString = queryParams.get("payload");

            if (!returnedPayloadString) {
                navigate("/");
                return null;
            }

            const returnedPayload = JSON.parse(returnedPayloadString) as VkAuthData;
            const payload = { silentToken: returnedPayload.token, uuid: returnedPayload.uuid };
            return handleSocialSignIn(
                "vk-signin",
                payload,
                "vk.signin.failed.to.exchange.silent.token.for.access.token",
                navigate,
            );
        }
    }, [navigate, setThrownError]);

    return (
        <BaseAuthRedirectPage
            logo={vkLogo}
            isLoading={isLoading}
            errorMessage={errorMessage}
            spinnerHighlightColor="#2787f5"
            spinnerBaseColor="#83bcfc"
        />
    );
}
