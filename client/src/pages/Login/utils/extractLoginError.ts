import LoginError from "@/pages/Login/types/LoginError.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import { RouteError } from "@/types/RouteError.ts";

export function extractLoginError(response: AxiosError<ServerErrorResponse>): LoginError {
    throwRouteErrorOnInvalidResponse(response);

    const { errorCode } = response.response!.data;
    if (errorCode === "invalid.credentials") {
        return { problematicField: "both", errorMessage: "Invalid login or password" };
    } else {
        throw RouteError.unexpected();
    }
}
