import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import isInvalidPasswordErrorCode from "@/utils/isInvalidPasswordErrorCode.ts";
import { RouteError } from "@/types/RouteError.ts";
import isInvalidEmailErrorCode from "@/pages/Signup/utils/isInvalidEmailErrorCode.ts";
import isInvalidLoginErrorCode from "@/pages/Signup/utils/isInvalidLoginErrorCode.ts";

export default function extractSignupError(error: AxiosError<ServerErrorResponse>): SignupError {
    throwRouteErrorOnInvalidResponse(error);

    const { errorCode, errorMessage } = error.response!.data;
    if (isInvalidPasswordErrorCode(errorCode)) {
        return { problematicField: "password", errorMessage };
    } else if (isInvalidEmailErrorCode(errorCode)) {
        return { problematicField: "email", errorMessage };
    } else if (isInvalidLoginErrorCode(errorCode)) {
        return { problematicField: "username", errorMessage };
    } else if (errorCode === "login.already.taken") {
        return { problematicField: "username", errorMessage };
    } else if (errorCode === "email.already.taken") {
        return { problematicField: "email", errorMessage };
    } else {
        throw RouteError.unexpected();
    }
}
