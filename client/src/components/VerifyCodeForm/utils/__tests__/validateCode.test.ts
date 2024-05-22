import { Result } from "@/utils/result";
import { describe, test, expect } from "vitest";
import validateCode from "@/components/VerifyCodeForm/utils/validateCode.ts";

// Utility function to create a Result object for failure
const createFailureResult = (message: string): Result => {
    return Result.Fail(message);
};

describe("validateCode", () => {
    test("1. Returns failure when code length is not equal to codeMaxLength", () => {
        const result = validateCode("123", 5);

        expect(result).toEqual(createFailureResult("Code length must be 5 numbers long"));
    });

    test("2. Returns failure when code contains non-numeric characters", () => {
        const result = validateCode("123a5", 5);

        expect(result).toEqual(
            createFailureResult("Code must contain only numbers and no letters"),
        );
    });

    test("3. Returns success when code is valid", () => {
        const result = validateCode("12345", 5);

        expect(result).toEqual(Result.Ok());
    });
});
