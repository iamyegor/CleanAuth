import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import { RouteError } from "@/types/RouteError.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";

export default function extractPasswordResetLoadingError(
    error: AxiosError<ServerErrorResponse>,
): ErrorMessage {
    throwRouteErrorOnInvalidResponse(error);

    const { errorCode } = error.response!.data;
    if (errorCode === "password.reset.token.expired") {
        return ErrorMessage.create("The link has expired. Please request a new one.");
    } else if (errorCode === "password.reset.token.invalid" || errorCode === "invalid.user.id") {
        return ErrorMessage.create("Invalid link.");
    } else {
        throw RouteError.unexpected();
    }
}
