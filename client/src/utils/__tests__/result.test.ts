import { test, describe, expect } from "vitest";
import { Result } from "@/utils/result.ts";

describe("Result", () => {
    test("1. Creates a successful Result", () => {
        const result = Result.Ok();

        expect(result.isSuccess).toBe(true);
        expect(result.isFailure).toBe(false);
        expect(result.errorMessage).toBeNull();
    });

    test("2. Creates a failed Result with an error message", () => {
        const errorMessage = "An error occurred";
        const result = Result.Fail(errorMessage);

        expect(result.isSuccess).toBe(false);
        expect(result.isFailure).toBe(true);
        expect(result.errorMessage).toBe(errorMessage);
    });
});
