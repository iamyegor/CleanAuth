import { test, describe, expect } from "vitest";
import focusLeft from "@/components/VerifyCodeForm/utils/focusLeft.ts";

function createInputElement(): HTMLInputElement {
    const input = document.createElement("input");
    document.body.appendChild(input);
    return input;
}

describe("focusLeft", () => {
    test("1. Moves focus to the previous input element when previous input exists", () => {
        const inputElements = [createInputElement(), createInputElement(), createInputElement()];
        inputElements[2].focus();

        focusLeft(inputElements, 2);

        expect(document.activeElement).toBe(inputElements[1]);
    });
    
    test("2. Does not move focus when there is no previous input element", () => {
        const inputElements = [createInputElement(), createInputElement()];
        inputElements[0].focus();

        focusLeft(inputElements, 0);

        expect(document.activeElement).toBe(inputElements[0]);
    });
});
