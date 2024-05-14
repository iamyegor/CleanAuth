import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import { RouteError } from "@/types/RouteError.ts";

export default function extractVerifyPhoneNumberError(
    error: AxiosError<ServerErrorResponse>,
): string {
    throwRouteErrorOnInvalidResponse(error);

    const { errorCode } = error.response!.data;
    if (errorCode === "phone.number.verification.code.invalid.length") {
        return "Phone number verification code must be 4 characters long.";
    } else if (errorCode === "phone.number.verification.code.invalid") {
        return "Phone number verification code is invalid.";
    } else if (errorCode === "phone.number.verification.code.invalid.length") {
        return "Phone number verification code has expired.";
    } else {
        throw RouteError.unexpected();
    }
}
