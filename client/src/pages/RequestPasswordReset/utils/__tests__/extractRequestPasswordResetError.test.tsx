import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse";
import { RouteError } from "@/types/RouteError";
import extractRequestPasswordResetError from "@/pages/RequestPasswordReset/utils/extractRequestPasswordResetError.ts";
import { waitFor } from "@testing-library/react";

const createAxiosError = (status: number, errorCode?: string): AxiosError<ServerErrorResponse> => {
    return {
        response: {
            status,
            data: { errorCode },
        } as any,
        isAxiosError: true,
    } as AxiosError<ServerErrorResponse>;
};

describe("extractRequestPasswordResetError", () => {
    test("1. Returns ErrorMessage for non-existent user error code", async () => {
        const error = createAxiosError(400, "user.not.exists.with.login.or.email");

        const result = extractRequestPasswordResetError(error);

        await waitFor(() => {
            expect(result.isSuccess).toBe(false);
            expect(result.message).toBe("User with this login or email does not exist.");
        });
    });

    test("2. Throws RouteError.unexpected for unexpected error code", () => {
        const error = createAxiosError(400, "unexpected.error.code");

        expect(() => extractRequestPasswordResetError(error)).toThrow(RouteError.unexpected());
    });

    test("3. Throws RouteError.unexpected for invalid server response", () => {
        const error = { response: {} } as AxiosError<ServerErrorResponse>;

        expect(() => extractRequestPasswordResetError(error)).toThrow(RouteError.unexpected());
    });
});
