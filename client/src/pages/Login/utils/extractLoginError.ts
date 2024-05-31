import LoginError from "@/pages/Login/types/LoginError.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import { RouteError } from "@/types/RouteError.ts";
import FieldError from "@/utils/FieldError.ts";

export function extractLoginError(response: AxiosError<ServerErrorResponse>): FieldError {
    throwRouteErrorOnInvalidResponse(response);

    const { errorCode } = response.response!.data;
    if (errorCode === "invalid.credentials") {
        return FieldError.create("both", "Invalid login or password");
    } else {
        throw RouteError.unexpected();
    }
}
