import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse";
import { RouteError } from "@/types/RouteError";
import extractRequestPasswordResetError from "@/pages/RequestPasswordReset/utils/extractRequestPasswordResetError.ts";
import { waitFor } from "@testing-library/react";
import mockAxiosError from "@/test/mocks/mockAxiosError.ts";

describe("extractRequestPasswordResetError", () => {
    test("1. Returns ErrorMessage for non-existent user error code", async () => {
        const error = mockAxiosError(400, {
            errorCode: "user.not.exists.with.login.or.email",
            errorMessage: "User with this login or email does not exist.",
        });

        const result = extractRequestPasswordResetError(error);

        await waitFor(() => {
            expect(result.isSuccess).toBe(false);
            expect(result.message).toBe("User with this login or email does not exist.");
        });
    });

    test("2. Throws RouteError.unexpected for unexpected error code", () => {
        const error = mockAxiosError(400, {
            errorCode: "unexpected.error.code",
            errorMessage: "Unexpected error",
        });

        expect(() => extractRequestPasswordResetError(error)).toThrow(RouteError.unexpected());
    });

    test("3. Throws RouteError.unexpected for invalid server response", () => {
        const error = mockAxiosError(200, {} as ServerErrorResponse);

        expect(() => extractRequestPasswordResetError(error)).toThrow(RouteError.unexpected());
    });
});
