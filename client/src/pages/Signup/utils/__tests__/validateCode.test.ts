import { test, describe, expect } from "vitest";
import validateCode from "@/components/VerifyCodeForm/utils/validateCode.ts";
import { Result } from "@/utils/result.ts";

describe("validateCode", () => {
    test("1. Returns fail result when code length is not equal to the maximum length", () => {
        const code = "123";
        const codeMaxLength = 5;

        const result = validateCode(code, codeMaxLength);

        expect(result).toEqual(Result.Fail(`Code length must be ${codeMaxLength} numbers long`));
    });

    test("2. Returns fail result when code contains non-numeric characters", () => {
        const code = "123a";
        const codeMaxLength = 4;

        const result = validateCode(code, codeMaxLength);

        expect(result).toEqual(Result.Fail("Code must contain only numbers and no letters"));
    });

    test("3. Returns success result when code is valid", () => {
        const code = "1234";
        const codeMaxLength = 4;

        const result = validateCode(code, codeMaxLength);

        expect(result).toEqual(Result.Ok());
    });
});
