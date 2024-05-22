import { describe, expect, test } from "vitest";
import { AxiosError } from "axios";
import { RouteError } from "@/types/RouteError";
import ErrorMessage from "@/utils/ErrorMessage";
import ServerErrorResponse from "@/types/ServerErrorResponse";
import extractPasswordResetError from "@/pages/PasswordReset/utils/extractPasswordResetError.ts";

const createError = (
    errorCode: string,
    errorMessage: string,
    status = 200,
): AxiosError<ServerErrorResponse> => {
    return {
        isAxiosError: true,
        response: {
            status,
            data: { errorCode, errorMessage },
        },
    } as AxiosError<ServerErrorResponse>;
};

describe("extractPasswordResetError", () => {
    test("1. Should throw RouteError for invalid error", () => {
        const error = createError("", "", 500);

        expect(() => extractPasswordResetError(error)).toThrow(RouteError.serverError());
    });

    test("2. Should return ErrorMessage for invalid password error code", () => {
        const errorCode = "password.invalid.length";
        const errorMessage = "Password length is invalid";
        const error = createError(errorCode, errorMessage);

        const result = extractPasswordResetError(error);

        expect(result).toEqual(ErrorMessage.create(errorMessage));
    });

    test("3. Should return ErrorMessage for password.same.as.current error code", () => {
        const errorCode = "password.same.as.current";
        const errorMessage = "The new password cannot be the same as the current one.";
        const error = createError(errorCode, "");

        const result = extractPasswordResetError(error);

        expect(result).toEqual(ErrorMessage.create(errorMessage));
    });

    test("4. Should throw RouteError for unexpected error code", () => {
        const errorCode = "unexpected.error";
        const errorMessage = "Unexpected error";
        const error = createError(errorCode, errorMessage);

        expect(() => extractPasswordResetError(error)).toThrow(RouteError.unexpected());
    });
});
