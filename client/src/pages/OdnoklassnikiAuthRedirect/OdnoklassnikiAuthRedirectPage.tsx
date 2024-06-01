import ErrorMessage from "@/utils/ErrorMessage.ts";
import { redirect } from "react-router-dom";
import React from "react";
import odnoklassnikiLogo from "@/pages/Login/images/ok-logo.png";
import BaseAuthRedirectPage from "@/components/ui/BaseAuthRedirectPage.tsx";
import getParamFromUrl from "@/pages/OdnoklassnikiAuthRedirect/utils/getParamFromUrl.ts";
import handleSocialSignIn from "@/utils/handleSocialSignIn.ts";

export async function loader(): Promise<ErrorMessage | Response> {
    const error: string | null = getParamFromUrl("error");
    if (error) {
        return ErrorMessage.create("Something went wrong, Please try again later.");
    }

    const accessToken: string | null = getParamFromUrl("access_token");
    const sessionSecretKey: string | null = getParamFromUrl("session_secret_key");
    if (!accessToken || !sessionSecretKey) {
        return redirect("/");
    }

    const payload = { accessToken, sessionSecretKey };
    return handleSocialSignIn(
        "api/odnoklassniki-signin",
        payload,
        "odnoklassniki.signin.failed.to.get.user.data",
    );
}

export default function OdnoklassnikiAuthRedirectPage() {
    return <BaseAuthRedirectPage logo={odnoklassnikiLogo} />;
}
