import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import { RouteError } from "@/types/RouteError.ts";
import FieldError from "@/utils/FieldError.ts";

export function extractLoginError(response: AxiosError<ServerErrorResponse>): FieldError {
    throwRouteErrorOnInvalidResponse(response);

    const { errorCode } = response.response!.data;
    if (errorCode === "user.has.invalid.password") {
        return FieldError.create("password", "Invalid password");
    } else if (errorCode === "user.not.exists.with.login.or.email") {
        return FieldError.create("loginOrEmail", "User with this login or email does not exist");
    } else {
        throw RouteError.unexpected();
    }
}
