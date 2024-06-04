import ErrorMessage from "@/utils/ErrorMessage.ts";
import api from "@/lib/api.ts";
import { AxiosError, AxiosResponse } from "axios";
import SocialSignInResponse from "@/types/SocialSignInResponse.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import { RouteError } from "@/types/RouteError.ts";
import { NavigateFunction } from "react-router-dom";

export default async function handleSocialSignIn(
    endpoint: string,
    payload: any,
    specificErrorCode: string,
    navigate: NavigateFunction,
): Promise<ErrorMessage | undefined> {
    try {
        const response = (await api.post(endpoint, payload)) as AxiosResponse<SocialSignInResponse>;

        if (response.data.authStatus === "NewUser") {
            navigate("/add-username-and-email");
        } else {
            navigate("/");
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
