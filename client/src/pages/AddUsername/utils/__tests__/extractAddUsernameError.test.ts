import { RouteError } from "@/types/RouteError";
import ServerErrorResponse from "@/types/ServerErrorResponse";
import ErrorMessage from "@/utils/ErrorMessage";
import extractAddUsernameError from "@/pages/AddUsername/utils/extractAddUsernameError.ts";
import mockAxiosError from "@/test/mocks/mockAxiosError.ts";

describe("extractAddUsernameError", () => {
    test("1. Throws unexpected error for invalid response structure", () => {
        const error = mockAxiosError(200, {} as ServerErrorResponse);

        expect(() => extractAddUsernameError(error)).toThrow(RouteError.unexpected());
    });

    test("2. Returns error for invalid username error code", () => {
        const error = mockAxiosError(400, {
            errorCode: "login.invalid.length",
            errorMessage: "Invalid login length",
        });

        const result = extractAddUsernameError(error);

        expect(result).toEqual(ErrorMessage.create("Invalid login length"));
    });

    test("3. Returns error for username cannot be added error code", () => {
        const error = mockAxiosError(400, {
            errorCode: "login.can.not.be.added",
            errorMessage: "Username cannot be added",
        });

        const result = extractAddUsernameError(error);

        expect(result).toEqual(ErrorMessage.create("Username can not be added, try again later"));
    });

    test("4. Throws server error for 500 status code", () => {
        const error = mockAxiosError(500, {
            errorCode: "server.error",
            errorMessage: "Internal server error",
        });

        expect(() => extractAddUsernameError(error)).toThrow(RouteError.serverError());
    });
});
