
// Utility function to create a mock input values array
import addNewValueToInputs from "@/components/VerifyCodeForm/utils/addNewValueToInputs.ts";

const createMockInputValues = (values: string[]): string[] => [...values];

describe("addNewValueToInputs", () => {
    test("1. Adds single character value to specified index", () => {
        const value = "a";
        const inputValues = createMockInputValues(["", "", ""]);
        const index = 1;

        const result = addNewValueToInputs(value, inputValues, index);

        expect(result).toEqual(["", "a", ""]);
    });

    test("2. Overwrites value at specified index with first character of input value", () => {
        const value = "hello";
        const inputValues = createMockInputValues(["", "", ""]);
        const index = 2;

        const result = addNewValueToInputs(value, inputValues, index);

        expect(result).toEqual(["", "", "h"]);
    });
});
