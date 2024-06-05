import ErrorMessage from "@/utils/ErrorMessage.ts";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import odnoklassnikiLogo from "@/pages/Login/images/ok-logo.png";
import BaseAuthRedirectPage from "@/components/ui/basePages/BaseAuthRedirectPage.tsx";
import getHashParamFromUrl from "@/pages/OdnoklassnikiAuthRedirect/utils/getHashParamFromUrl.ts";
import handleSocialSignIn from "@/utils/handleSocialSignIn.ts";
import useThrownError from "@/hooks/useThrownError.ts";

export default function OdnoklassnikiAuthRedirectPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>();
    const { setThrownError } = useThrownError();
    const navigate = useNavigate();

    useEffect(() => {
        handleOdnoklassnikiSignIn()
            .then((errorMessage) => {
                if (errorMessage) {
                    setErrorMessage(errorMessage);
                    setIsLoading(false);
                }
            })
            .catch((error) => setThrownError(error));

        async function handleOdnoklassnikiSignIn() {
            const error: string | null = getHashParamFromUrl("error");
            if (error) {
                return ErrorMessage.create("Something went wrong, Please try again later.");
            }

            const accessToken: string | null = getHashParamFromUrl("access_token");
            const sessionSecretKey: string | null = getHashParamFromUrl("session_secret_key");
            if (!accessToken || !sessionSecretKey) {
                navigate("/");
                return null;
            }

            const payload = { accessToken, sessionSecretKey };
            return handleSocialSignIn(
                "odnoklassniki-signin",
                payload,
                "odnoklassniki.signin.failed.to.get.user.data",
                navigate,
            );
        }
    }, []);

    return (
        <BaseAuthRedirectPage
            logo={odnoklassnikiLogo}
            isLoading={isLoading}
            errorMessage={errorMessage}
            spinnerHighlightColor="#f79418"
            spinnerBaseColor="#facc98"
        />
    );
}
