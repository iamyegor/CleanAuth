import { test, describe, expect } from "vitest";
import isNullOrWhitespace from "@/utils/isNullOrWhitespace";

describe("isNullOrWhitespace", () => {
    test("1. Returns true for null input", () => {
        const input = null;

        const result = isNullOrWhitespace(input);

        expect(result).toBe(true);
    });

    test("2. Returns true for empty string input", () => {
        const input = "";

        const result = isNullOrWhitespace(input);

        expect(result).toBe(true);
    });

    test("3. Returns true for string with only whitespace", () => {
        const input = "    ";

        const result = isNullOrWhitespace(input);

        expect(result).toBe(true);
    });

    test("4. Returns false for non-empty string with non-whitespace characters", () => {
        const input = "Hello";

        const result = isNullOrWhitespace(input);

        expect(result).toBe(false);
    });
});
