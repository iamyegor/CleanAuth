import getQueryParam from "@/utils/getQueryParam.ts";
import { redirect, useLoaderData } from "react-router-dom";
import VkAuthData from "@/pages/VkAuthRedirect/types/VkAuthData.ts";
import api from "@/lib/api.ts";
import { AxiosError, AxiosResponse } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import { RouteError } from "@/types/RouteError.ts";
import SocialSignInResponse from "@/types/SocialSignInResponse.ts";
import GoBackButtonVariant1 from "@/components/ui/GoBackButton.tsx";
import React from "react";
import BaseRoundedPage from "@/components/ui/BaseRoundedPage.tsx";
import vkLogo from "@/pages/Login/images/vk.png";
import Image from "@/components/ui/Image.tsx";

export async function loader({ request }: any): Promise<ErrorMessage | Response> {
    console.log(request);
    const payloadString: string | null = getQueryParam(request.url, `payload`);
    if (!payloadString) {
        return redirect("/");
    }

    const payload = JSON.parse(payloadString) as VkAuthData;
    try {
        const response = (await api.post("api/vk-signin", {
            silentToken: payload.token,
            uuid: payload.uuid,
        })) as AxiosResponse<SocialSignInResponse>;

        if (response.data.authStatus == "NewUser") {
            return redirect("/add-username-and-email");
        } else {
            return redirect("/");
        }
    } catch (err) {
        const error = err as AxiosError<ServerErrorResponse>;
        throwRouteErrorOnInvalidResponse(error);

        if (
            error.response!.data.errorCode ==
            "vk.signin.failed.to.exchange.silent.token.for.access.token"
        ) {
            return ErrorMessage.create("Sorry something went wrong. Please try again.");
        } else {
            throw RouteError.unexpected();
        }
    }
}

export default function VkAuthRedirectPage() {
    const errorMessage = useLoaderData() as ErrorMessage;
    return (
        <div>
            <BaseRoundedPage>
                <div className="flex h-full w-full justify-center items-center flex-col">
                    <Image src={vkLogo} alt="vkLogo" className="w-20 h-20 mb-8" />
                    <p className="text-2xl font-semibold text-center">{errorMessage.value}</p>
                    <GoBackButtonVariant1 route="/login" text="Go back to login" />
                </div>
            </BaseRoundedPage>
        </div>
    );
}
