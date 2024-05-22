import { AxiosError } from "axios";
import { RouteError } from "@/types/RouteError";
import ServerErrorResponse from "@/types/ServerErrorResponse";
import { extractLoginError } from "@/pages/Login/utils/extractLoginError.ts";

// Utility function to create mock AxiosError
function createMockAxiosError(
    status: number,
    data: Partial<ServerErrorResponse>,
): AxiosError<ServerErrorResponse> {
    return {
        response: {
            status: status,
            data: data,
        },
    } as AxiosError<ServerErrorResponse>;
}

function createMockAxiosErrorWithoutData(): AxiosError<ServerErrorResponse> {
    return {
        response: {
            status: 123,
        },
    } as AxiosError<ServerErrorResponse>;
}

describe("extractLoginError", () => {
    test("1. Returns correct problematic field and error message for invalid credentials error", () => {
        const result = extractLoginError(
            createMockAxiosError(400, { errorCode: "invalid.credentials" }),
        );

        expect(result).toEqual({
            problematicField: "both",
            errorMessage: "Invalid login or password",
        });
    });

    test("2. Throws unexpected error for missing error code", () => {
        const mockErrorResponse = createMockAxiosError(400, { errorCode: "random.code" });

        expect(() => extractLoginError(mockErrorResponse)).toThrow(RouteError.unexpected());
    });

    test("3. Throws server error invalid axios response", () => {
        const mockErrorResponse = createMockAxiosErrorWithoutData();

        expect(() => extractLoginError(mockErrorResponse)).toThrow(RouteError.unexpected());
    });
});
