import { describe, expect, test } from "vitest";
import validatePassword from "@/utils/validatePassword";

describe("validatePassword", () => {
    test("1. Fails for password shorter than 6 characters", () => {
        const result = validatePassword("Ab1!");

        expect(result.isSuccess).toBe(false);
        expect(result.errorMessage).toBe("Password length must be between 6 and 50 characters");
    });

    test("2. Fails for password longer than 50 characters", () => {
        const longPassword = "A".repeat(51) + "b1!";
        const result = validatePassword(longPassword);

        expect(result.isSuccess).toBe(false);
        expect(result.errorMessage).toBe("Password length must be between 6 and 50 characters");
    });

    test("3. Fails for password without an uppercase letter", () => {
        const result = validatePassword("abcdef1!");

        expect(result.isSuccess).toBe(false);
        expect(result.errorMessage).toBe(
            "Password must contain at least one upper case, one lower case letter and either one number or a special character",
        );
    });

    test("4. Fails for password without a lowercase letter", () => {
        const result = validatePassword("ABCDEF1!");

        expect(result.isSuccess).toBe(false);
        expect(result.errorMessage).toBe(
            "Password must contain at least one upper case, one lower case letter and either one number or a special character",
        );
    });

    test("5. Fails for password without a number or special character", () => {
        const result = validatePassword("Abcdefg");

        expect(result.isSuccess).toBe(false);
        expect(result.errorMessage).toBe(
            "Password must contain at least one upper case, one lower case letter and either one number or a special character",
        );
    });

    test("6. Passes for valid password", () => {
        const result = validatePassword("Abcdef1!");

        expect(result.isSuccess).toBe(true);
        expect(result.errorMessage).toBeNull();
    });
});
