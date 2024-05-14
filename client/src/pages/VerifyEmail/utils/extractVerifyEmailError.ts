import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import { RouteError } from "@/types/RouteError.ts";

export default function extractVerifyEmailError(error: AxiosError<ServerErrorResponse>): string {
    throwRouteErrorOnInvalidResponse(error);

    const { errorCode } = error.response!.data;
    if (errorCode === "email.verification.code.invalid.length") {
        return "Email verification code must be 5 characters long.";
    } else if (errorCode === "email.verification.code.invalid") {
        return "Email verification code is invalid.";
    } else if (errorCode === "email.verification.code.expired") {
        return "Email verification code has expired.";
    } else {
        throw RouteError.unexpected();
    }
}
