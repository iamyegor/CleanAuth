import isInvalidEmailErrorCode from "@/pages/Signup/utils/isInvalidEmailErrorCode";

describe("isInvalidEmailErrorCode", () => {
    test("1. Returns true for valid email error codes", () => {
        const validErrorCodes = ["email.is.required", "email.invalid.signature", "email.too.long"];

        validErrorCodes.forEach((errorCode) => {
            const result = isInvalidEmailErrorCode(errorCode);
            expect(result).toBe(true);
        });
    });

    test("2. Returns false for an unrelated error code", () => {
        const result = isInvalidEmailErrorCode("some.other.error");

        expect(result).toBe(false);
    });
});
