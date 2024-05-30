import { Result } from "@/utils/result";
import validateUsername from "@/pages/AddUsername/utils/validateUsername.ts";

describe("validateUsername", () => {
    test("1. Returns failure result when username is null", () => {
        const username = null;

        const result = validateUsername(username as any);

        expect(result).toEqual(Result.Fail("Username input field must not be empty"));
    });

    test("2. Returns failure result when username is empty string", () => {
        const username = "";

        const result = validateUsername(username);

        expect(result).toEqual(Result.Fail("Username input field must not be empty"));
    });

    test("3. Returns failure result when username is whitespace", () => {
        const username = "   ";

        const result = validateUsername(username);

        expect(result).toEqual(Result.Fail("Username input field must not be empty"));
    });

    test("4. Returns success result when username is valid", () => {
        const username = "validUsername";

        const result = validateUsername(username);

        expect(result).toEqual(Result.Ok());
    });
});
