import { AxiosError } from "axios";
import extractSignupError from "@/pages/Signup/utils/extractSignupError";
import { RouteError } from "@/types/RouteError";
import ServerErrorResponse from "@/types/ServerErrorResponse";

const mockError = (status: number, data: ServerErrorResponse): AxiosError<ServerErrorResponse> => {
    return {
        isAxiosError: true,
        response: {
            status,
            data,
            statusText: "",
            headers: {},
            config: {},
        },
        config: {},
        name: "",
        message: "",
    } as AxiosError<ServerErrorResponse>;
};

describe("extractSignupError", () => {
    test("1. Throws unexpected error for invalid response structure", () => {
        const error = mockError(200, {} as ServerErrorResponse);

        expect(() => extractSignupError(error)).toThrow(RouteError.unexpected());
    });

    test("2. Returns error for invalid password error code", () => {
        const error = mockError(400, {
            errorCode: "password.invalid.length",
            errorMessage: "Invalid password length",
        });

        const result = extractSignupError(error);

        expect(result).toEqual({
            problematicField: "password",
            errorMessage: "Invalid password length",
        });
    });

    test("3. Returns error for invalid email error code", () => {
        const error = mockError(400, {
            errorCode: "email.invalid.signature",
            errorMessage: "Invalid email signature",
        });

        const result = extractSignupError(error);

        expect(result).toEqual({
            problematicField: "email",
            errorMessage: "Invalid email signature",
        });
    });

    test("4. Returns error for invalid username error code", () => {
        const error = mockError(400, {
            errorCode: "login.invalid.length",
            errorMessage: "Invalid login length",
        });

        const result = extractSignupError(error);

        expect(result).toEqual({
            problematicField: "username",
            errorMessage: "Invalid login length",
        });
    });

    test("5. Returns error for login already taken error code", () => {
        const error = mockError(400, {
            errorCode: "login.already.taken",
            errorMessage: "Login already taken",
        });

        const result = extractSignupError(error);

        expect(result).toEqual({
            problematicField: "username",
            errorMessage: "Login already taken",
        });
    });

    test("6. Returns error for email already taken error code", () => {
        const error = mockError(400, {
            errorCode: "email.already.taken",
            errorMessage: "Email already taken",
        });

        const result = extractSignupError(error);

        expect(result).toEqual({ problematicField: "email", errorMessage: "Email already taken" });
    });

    test("7. Throws server error for 500 status code", () => {
        const error = mockError(500, {
            errorCode: "server.error",
            errorMessage: "Internal server error",
        });

        expect(() => extractSignupError(error)).toThrow(RouteError.serverError());
    });
});
