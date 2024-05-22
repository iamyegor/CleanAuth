import { test, describe, expect } from "vitest";
import getErrorMessageForField from "@/utils/getErrorMessageForField";
import ErrorMessage from "@/utils/ErrorMessage";

const createFieldAndMessageError = (field: string, message: string) => ({
    problematicField: field,
    errorMessage: message
});

describe("getErrorMessageForField", () => {
    test("1. Returns ErrorMessage for matching field", () => {
        const error = createFieldAndMessageError("username", "Invalid username");

        const result = getErrorMessageForField("username", error);

        expect(result).toEqual(ErrorMessage.create("Invalid username"));
    });

    test("2. Returns null for non-matching field", () => {
        const error = createFieldAndMessageError("username", "Invalid username");

        const result = getErrorMessageForField("email", error);

        expect(result).toBeNull();
    });

    test("3. Returns null for null error object", () => {
        const result = getErrorMessageForField("username", null);

        expect(result).toBeNull();
    });
});
