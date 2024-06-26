import { RouteError } from "@/types/RouteError.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { AxiosError } from "axios";
import isInvalidPasswordErrorCode from "@/utils/isInvalidPasswordErrorCode.ts";
import FieldError from "@/utils/FieldError.ts";

export default function extractPasswordResetError(
    error: AxiosError<ServerErrorResponse>,
): FieldError {
    throwRouteErrorOnInvalidResponse(error);

    const { errorCode, errorMessage } = error.response!.data;
    if (isInvalidPasswordErrorCode(errorCode)) {
        return FieldError.create("password", errorMessage);
    } else if (errorCode === "password.same.as.current") {
        return FieldError.create(
            "password",
            "The new password can not be the same as the current one.",
        );
    } else {
        throw RouteError.unexpected();
    }
}
