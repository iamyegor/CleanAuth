import { test, describe, expect } from "vitest";
import isInvalidPasswordErrorCode from "@/utils/isInvalidPasswordErrorCode";

describe("isInvalidPasswordErrorCode", () => {
    test("1. Returns true for 'password.is.required' error code", () => {
        const errorCode = "password.is.required";

        const result = isInvalidPasswordErrorCode(errorCode);

        expect(result).toBe(true);
    });

    test("2. Returns true for 'password.invalid.signature' error code", () => {
        const errorCode = "password.invalid.signature";

        const result = isInvalidPasswordErrorCode(errorCode);

        expect(result).toBe(true);
    });

    test("3. Returns true for 'password.invalid.length' error code", () => {
        const errorCode = "password.invalid.length";

        const result = isInvalidPasswordErrorCode(errorCode);

        expect(result).toBe(true);
    });

    test("4. Returns false for unrelated error code", () => {
        const errorCode = "some.other.error.code";

        const result = isInvalidPasswordErrorCode(errorCode);

        expect(result).toBe(false);
    });
});
