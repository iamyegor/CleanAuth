import { AxiosError } from "axios";
import { RouteError } from "@/types/RouteError";
import ServerErrorResponse from "@/types/ServerErrorResponse";
import extractVerifyEmailError from "@/pages/VerifyEmail/utils/extractVerifyEmailError.ts";

// Utility function to mock an Axios error
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

describe("extractVerifyEmailError", () => {
    test("1. Throws unexpected error for invalid response structure", () => {
        const error = mockError(200, {} as ServerErrorResponse);

        expect(() => extractVerifyEmailError(error)).toThrow(RouteError.unexpected());
    });

    test("2. Returns message for invalid email verification code length", () => {
        const error = mockError(400, {
            errorCode: "email.verification.code.invalid.length",
            errorMessage: "Invalid length",
        });

        const result = extractVerifyEmailError(error);

        expect(result).toBe("Email verification code must be 5 characters long.");
    });

    test("3. Returns message for invalid email verification code", () => {
        const error = mockError(400, {
            errorCode: "email.verification.code.invalid",
            errorMessage: "Invalid code",
        });

        const result = extractVerifyEmailError(error);

        expect(result).toBe("Email verification code is invalid.");
    });

    test("4. Returns message for expired email verification code", () => {
        const error = mockError(400, {
            errorCode: "email.verification.code.expired",
            errorMessage: "Code expired",
        });

        const result = extractVerifyEmailError(error);

        expect(result).toBe("Email verification code has expired.");
    });

    test("5. Throws error for invalid response", () => {
        const error = mockError(500, {
            errorCode: "server.error",
            errorMessage: "Internal server error",
        });

        expect(() => extractVerifyEmailError(error)).toThrow(RouteError.serverError());
    });
});
