import isInvalidLoginErrorCode from "@/pages/Signup/utils/isInvalidLoginErrorCode";

describe("isInvalidLoginErrorCode", () => {
    test("1. Returns true for valid login error codes", () => {
        const validErrorCodes = [
            "login.is.required",
            "login.invalid.symbols",
            "login.invalid.length"
        ];

        validErrorCodes.forEach((errorCode) => {
            const result = isInvalidLoginErrorCode(errorCode);
            expect(result).toBe(true);
        });
    });

    test("2. Returns false for an unrelated error code", () => {
        const result = isInvalidLoginErrorCode("some.other.error");

        expect(result).toBe(false);
    });
});
