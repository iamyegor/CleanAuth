import { describe, expect, test } from "vitest";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import extractPasswordResetLoadingError from "@/pages/PasswordReset/utils/extractPasswordResetLoadingError.ts";
import { RouteError } from "@/types/RouteError.ts";
import mockAxiosError from "@/test/mocks/mockAxiosError.ts";

describe("extractPasswordResetLoadingError", () => {
    test("1. Returns ErrorMessage for expired token", () => {
        const error = mockAxiosError(400, {
            errorCode: "password.reset.token.expired",
            errorMessage: "The link has expired. Please request a new one.",
        });

        const result = extractPasswordResetLoadingError(error);

        expect(result).toEqual(
            ErrorMessage.create("The link has expired. Please request a new one."),
        );
    });

    test("2. Returns ErrorMessage for invalid token", () => {
        const error = mockAxiosError(400, {
            errorCode: "password.reset.token.invalid",
            errorMessage: "Invalid link.",
        });

        const result = extractPasswordResetLoadingError(error);

        expect(result).toEqual(ErrorMessage.create("Invalid link."));
    });

    test("3. Returns ErrorMessage for invalid user ID", () => {
        const error = mockAxiosError(400, {
            errorCode: "invalid.user.id",
            errorMessage: "Invalid link.",
        });

        const result = extractPasswordResetLoadingError(error);

        expect(result).toEqual(ErrorMessage.create("Invalid link."));
    });

    test("4. Throws unexpected RouteError for unexpected error code", () => {
        const error = mockAxiosError(400, {
            errorCode: "some.other.error.code",
            errorMessage: "Some other error.",
        });

        expect(() => extractPasswordResetLoadingError(error)).toThrow(RouteError.unexpected());
    });

    test("5. Throws server RouteError for invalid error", () => {
        const error = mockAxiosError(500, {
            errorCode: "some.server.error",
            errorMessage: "Some server error.",
        });

        expect(() => extractPasswordResetLoadingError(error)).toThrow(RouteError.serverError());
    });
});
