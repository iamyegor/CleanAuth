import ErrorMessage from "@/utils/ErrorMessage.ts";
import api from "@/lib/api.ts";
import { AxiosError, AxiosResponse } from "axios";
import SocialSignInResponse from "@/types/SocialSignInResponse.ts";
import { redirect } from "react-router-dom";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import { RouteError } from "@/types/RouteError.ts";

export default async function handleSocialSignIn(
    endpoint: string,
    payload: any,
    specificErrorCode: string,
): Promise<ErrorMessage | Response> {
    try {
        const response = (await api.post(endpoint, payload)) as AxiosResponse<SocialSignInResponse>;

        if (response.data.authStatus === "NewUser") {
            return redirect("/add-username-and-email");
        } else {
            return redirect("/");
        }
    } catch (err) {
        const error = err as AxiosError<ServerErrorResponse>;
        throwRouteErrorOnInvalidResponse(error);

        if (error.response!.data.errorCode === specificErrorCode) {
            return ErrorMessage.create("Sorry something went wrong. Please try again.");
        } else {
            throw RouteError.unexpected();
        }
    }
}
