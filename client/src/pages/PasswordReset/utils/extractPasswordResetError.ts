import { RouteError } from "@/types/RouteError.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { AxiosError } from "axios";
import isInvalidPasswordErrorCode from "@/utils/isInvalidPasswordErrorCode.ts";

export default function extractPasswordResetError(
    error: AxiosError<ServerErrorResponse>,
): ErrorMessage {
    throwRouteErrorOnInvalidResponse(error);

    const { errorCode, errorMessage } = error.response!.data;
    if (isInvalidPasswordErrorCode(errorCode)) {
        return ErrorMessage.create(errorMessage);
    } else if (errorCode === "password.same.as.current ") {
        return ErrorMessage.create("The new password cannot be the same as the current one.");
    } else {
        throw RouteError.unexpected();
    }
}
