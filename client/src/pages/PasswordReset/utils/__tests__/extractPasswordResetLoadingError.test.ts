import { describe, test, expect } from "vitest";
import { AxiosError } from "axios";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import extractPasswordResetLoadingError from "@/pages/PasswordReset/utils/extractPasswordResetLoadingError.ts";
import { RouteError } from "@/types/RouteError.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";

// Mock error responses
function createAxiosError(status: number, errorCode: string): AxiosError<ServerErrorResponse> {
    return {
        isAxiosError: true,
        response: {
            status,
            data: { errorCode, errorMessage: "Server's error message that isn't used in the test" },
            statusText: "",
            headers: {},
            config: {},
        },
        name: "AxiosError",
        message: "Mock error",
        config: {},
    } as AxiosError<ServerErrorResponse>;
}

describe("extractPasswordResetLoadingError", () => {
    test("1. Returns ErrorMessage for expired token", () => {
        const error = createAxiosError(400, "password.reset.token.expired");

        const result = extractPasswordResetLoadingError(error);

        expect(result).toEqual(
            ErrorMessage.create("The link has expired. Please request a new one."),
        );
    });

    test("2. Returns ErrorMessage for invalid token", () => {
        const error = createAxiosError(400, "password.reset.token.invalid");

        const result = extractPasswordResetLoadingError(error);

        expect(result).toEqual(ErrorMessage.create("Invalid link."));
    });

    test("3. Returns ErrorMessage for invalid user ID", () => {
        const error = createAxiosError(400, "invalid.user.id");

        const result = extractPasswordResetLoadingError(error);

        expect(result).toEqual(ErrorMessage.create("Invalid link."));
    });

    test("4. Throws unexpected RouteError for unexpected error code", () => {
        const error = createAxiosError(400, "some.other.error.code");

        expect(() => extractPasswordResetLoadingError(error)).toThrow(RouteError.unexpected());
    });

    test("6. Throws server RouteError for invalid error", () => {
        const error = createAxiosError(500, "some.server.error");

        expect(() => extractPasswordResetLoadingError(error)).toThrow(RouteError.serverError());
    });
});
