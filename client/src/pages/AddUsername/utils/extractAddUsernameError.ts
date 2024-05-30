import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import isInvalidLoginErrorCode from "@/pages/Signup/utils/isInvalidLoginErrorCode.ts";
import { RouteError } from "@/types/RouteError.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";

export default function extractAddUsernameError(
    error: AxiosError<ServerErrorResponse>,
): ErrorMessage {
    throwRouteErrorOnInvalidResponse(error);

    const { errorCode, errorMessage } = error.response!.data;
    if (isInvalidLoginErrorCode(errorCode)) {
        return ErrorMessage.create(errorMessage);
    } else if (errorCode === "login.can.not.be.added") {
        return ErrorMessage.create("Username can not be added, try again later");
    } else {
        throw RouteError.unexpected();
    }
}
