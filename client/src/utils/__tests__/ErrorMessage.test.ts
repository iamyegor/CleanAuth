import { describe, expect, test } from "vitest";
import ErrorMessage from "@/utils/ErrorMessage.ts";

const createErrorMessage = (message: string): ErrorMessage => {
    return ErrorMessage.create(message);
};

describe("ErrorMessage", () => {
    test("1. Creates ErrorMessage with given message", () => {
        const message = "Test error message";

        const errorMessage = createErrorMessage(message);

        expect(errorMessage.value).toBe(message);
    });

    test("2. Converts ErrorMessage to string", () => {
        const message = "Test error message";
        const errorMessage = createErrorMessage(message);

        const result = ErrorMessage.toString(errorMessage);

        expect(result).toBe(message);
    });
});
