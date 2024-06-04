import { describe, expect, test } from "vitest";
import { RouteError } from "@/types/RouteError";
import extractPasswordResetError from "@/pages/PasswordReset/utils/extractPasswordResetError.ts";
import mockAxiosError from "@/test/mocks/mockAxiosError.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import FieldError from "@/utils/FieldError.ts";

describe("extractPasswordResetError", () => {
    test("1. Should throw RouteError for invalid error", () => {
        const error = mockAxiosError(500, {} as ServerErrorResponse);

        expect(() => extractPasswordResetError(error)).toThrow(RouteError.serverError());
    });

    test("2. Should return ErrorMessage for invalid password error code", () => {
        const error = mockAxiosError(400, {
            errorCode: "password.invalid.length",
            errorMessage: "Password length is invalid",
        });

        const result = extractPasswordResetError(error);

        expect(result).toEqual(FieldError.create("password", "Password length is invalid"));
    });

    test("3. Should return ErrorMessage for password.same.as.current error code", () => {
        const error = mockAxiosError(400, {
            errorCode: "password.same.as.current",
            errorMessage: "The new password cannot be the same as the current one.",
        });

        const result = extractPasswordResetError(error);

        expect(result).toEqual(
            FieldError.create(
                "password",
                "The new password can not be the same as the current one.",
            ),
        );
    });

    test("4. Should throw RouteError for unexpected error code", () => {
        const error = mockAxiosError(400, {
            errorCode: "unexpected.error",
            errorMessage: "Unexpected error",
        });

        expect(() => extractPasswordResetError(error)).toThrow(RouteError.unexpected());
    });
});
