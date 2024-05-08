import LoginError from "@/pages/LoginPage/types/LoginError.ts";
import isServerErrorResponse from "@/utils/isServerErrorResponse.ts";

export function parseResponseToLoginError(response: any): LoginError {
    if (!isServerErrorResponse(response)) {
        throw new Error("The passed response isn't a server response");
    }

    const errorMessage: string = response.errorMessage;

    if (response.login != undefined) {
        return { problematicField: "loginOrEmail", errorMessage };
    } else if (response.email != undefined) {
        return { problematicField: "password", errorMessage };
    } else {
        throw new Error("Response didn't provide one of these fields: login, password");
    }
}
