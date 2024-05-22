import { test, describe, expect } from "vitest";
import { ResultOf } from "@/utils/resultOfT.ts";

describe("ResultOf", () => {
    test("1. Creates a successful ResultOf with no error", () => {
        const result = ResultOf.Ok<string>();

        expect(result.isSuccess).toBe(true);
        expect(result.isFailure).toBe(false);
        expect(result.error).toBeNull();
    });

    test("2. Creates a failed ResultOf with an error message", () => {
        const errorMessage = "An error occurred";
        const result = ResultOf.Fail<string>(errorMessage);

        expect(result.isSuccess).toBe(false);
        expect(result.isFailure).toBe(true);
        expect(result.error).toBe(errorMessage);
    });

    test("3. Creates a failed ResultOf of any type", () => {
        const errorCode = 404;
        const result = ResultOf.Fail<number>(errorCode);

        expect(result.isSuccess).toBe(false);
        expect(result.isFailure).toBe(true);
        expect(result.error).toBe(errorCode);
    });
});
