import isServerErrorResponse from "@/utils/isServerErrorResponse.ts";

export default function parseResponseToSignupError(response: any): SignupError {
    if (!isServerErrorResponse(response)) {
        throw new Error("The passed response isn't a server response");
    }

    const errorMessage: string = response.errorMessage;

    if (response.login != undefined) {
        return { problematicField: "username", errorMessage };
    } else if (response.email != undefined) {
        return { problematicField: "email", errorMessage };
    } else if (response.password != undefined) {
        return { problematicField: "password", errorMessage };
    } else {
        throw new Error("Response didn't provide one of these fields: username, email, password");
    }
}
