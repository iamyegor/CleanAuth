import { describe, expect, test } from "vitest";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import validateDataForPasswordReset from "@/pages/PasswordReset/utils/validateDataForPasswordReset.ts";

describe("validateDataForPasswordReset", () => {
    test("1. Returns ErrorMessage for invalid password", () => {
        const password = "short";
        const confirmPassword = "short";

        const result = validateDataForPasswordReset(password, confirmPassword);

        expect(result.isFailure).toBe(true);
        expect(result.error).toEqual({
            field: "password",
            errorMessage: ErrorMessage.create(
                "Password length must be between 6 and 50 characters",
            ),
        });
    });

    test("2. Returns ErrorMessage for non-matching passwords", () => {
        const password = "ValidPassword1!";
        const confirmPassword = "DifferentPassword1!";

        const result = validateDataForPasswordReset(password, confirmPassword);

        expect(result.isFailure).toBe(true);
        expect(result.error).toEqual({
            field: "confirmPassword",
            errorMessage: ErrorMessage.create("Passwords do not match."),
        });
    });

    test("3. Returns success for valid passwords", () => {
        const password = "ValidPassword1!";
        const confirmPassword = "ValidPassword1!";

        const result = validateDataForPasswordReset(password, confirmPassword);

        expect(result.isSuccess).toBe(true);
    });
});
