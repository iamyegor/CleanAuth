import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import isInvalidLoginErrorCode from "@/pages/Signup/utils/isInvalidLoginErrorCode.ts";
import { RouteError } from "@/types/RouteError.ts";
import FieldError from "@/utils/FieldError.ts";

export default function extractAddUsernameAndEmailError(
    error: AxiosError<ServerErrorResponse>,
): any {
    throwRouteErrorOnInvalidResponse(error);

    const { errorCode, errorMessage } = error.response!.data;
    if (isInvalidLoginErrorCode(errorCode) || isInvalidLoginErrorCode(errorCode)) {
        return FieldError.create("username", errorMessage);
    } else if (errorCode === "login.can.not.be.added") {
        return FieldError.create("username", "Username can not be added, try again later");
    } else if (errorCode === "login.already.taken") {
        return FieldError.create("username", "Username is already taken");
    } else if (errorCode === "email.already.taken") {
        return FieldError.create("email", "Email is already taken");
    } else if (errorCode === "email.can.not.be.added") {
        return FieldError.create("email", "Email can not be added, try again later");
    } else {
        throw RouteError.unexpected();
    }
}
