import { describe, expect, test } from "vitest";
import getFieldErrorMessage from "@/utils/getFieldErrorMessage.ts";
import ErrorMessage from "@/utils/ErrorMessage";
import FieldError from "@/utils/FieldError.ts";

describe("getErrorMessageForField", () => {
    test("1. Returns ErrorMessage for matching field", () => {
        const error = FieldError.create("username", "Invalid username");

        const result = getFieldErrorMessage("username", error);

        expect(result).toEqual(ErrorMessage.create("Invalid username"));
    });

    test("2. Returns null for non-matching field", () => {
        const error = FieldError.create("username", "Invalid username");

        const result = getFieldErrorMessage("email", error);

        expect(result).toBeNull();
    });

    test("3. Returns null for null error object", () => {
        const result = getFieldErrorMessage("username", null);

        expect(result).toBeNull();
    });
});
