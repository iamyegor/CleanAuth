import getQueryParam from "@/utils/getQueryParam.ts";
import { redirect } from "react-router-dom";
import VkAuthData from "@/pages/VkAuthRedirect/types/VkAuthData.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import React from "react";
import vkLogo from "@/pages/Login/images/vk.png";
import BaseAuthRedirectPage from "@/components/ui/BaseAuthRedirectPage.tsx";
import handleSocialSignIn from "@/utils/handleSocialSignIn.ts";

export async function loader({ request }: any): Promise<ErrorMessage | Response> {
    const returnedPayloadString: string | null = getQueryParam(request.url, `payload`);
    if (!returnedPayloadString) {
        return redirect("/");
    }

    const returnedPayload = JSON.parse(returnedPayloadString) as VkAuthData;
    const payload = { silentToken: returnedPayload.token, uuid: returnedPayload.uuid };
    return handleSocialSignIn(
        "api/vk-signin",
        payload,
        "vk.signin.failed.to.exchange.silent.token.for.access.token",
    );
}

export default function VkAuthRedirectPage() {
    return <BaseAuthRedirectPage logo={vkLogo} />;
}
