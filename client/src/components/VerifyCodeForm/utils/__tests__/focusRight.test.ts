import { test, describe, expect } from "vitest";
import focusRight from "@/components/VerifyCodeForm/utils/focusRight.ts";

function createInputElement(): HTMLInputElement {
    const input = document.createElement("input");
    document.body.appendChild(input);
    return input;
}

describe("focusRight", () => {
    test("1. Moves focus to the next input element when next input exists", () => {
        const inputElements = [createInputElement(), createInputElement(), createInputElement()];
        inputElements[0].focus();

        focusRight(inputElements, 0);

        expect(document.activeElement).toBe(inputElements[1]);
    });

    test("2. Does not move focus when there is no next input element", () => {
        const inputElements = [createInputElement(), createInputElement()];
        inputElements[1].focus();

        focusRight(inputElements, 1);

        expect(document.activeElement).toBe(inputElements[1]);
    });
});
