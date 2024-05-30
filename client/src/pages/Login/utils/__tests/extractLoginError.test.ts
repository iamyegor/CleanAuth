import { RouteError } from "@/types/RouteError";
import ServerErrorResponse from "@/types/ServerErrorResponse";
import { extractLoginError } from "@/pages/Login/utils/extractLoginError.ts";
import mockAxiosError from "@/test/mocks/mockAxiosError.ts";

describe("extractLoginError", () => {
    test("1. Returns correct problematic field and error message for invalid credentials error", () => {
        const result = extractLoginError(
            mockAxiosError(400, { errorCode: "invalid.credentials", errorMessage: "msg" }),
        );

        expect(result).toEqual({
            problematicField: "both",
            errorMessage: "Invalid login or password",
        });
    });

    test("2. Throws unexpected error for missing error code", () => {
        const mockErrorResponse = mockAxiosError(400, {
            errorCode: "random.code",
            errorMessage: "msg",
        });

        expect(() => extractLoginError(mockErrorResponse)).toThrow(RouteError.unexpected());
    });

    test("3. Throws server error invalid axios response", () => {
        const mockErrorResponse = mockAxiosError(200, {} as ServerErrorResponse);

        expect(() => extractLoginError(mockErrorResponse)).toThrow(RouteError.unexpected());
    });
});
