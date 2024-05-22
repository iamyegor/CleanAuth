import { test, describe, expect } from "vitest";
import focusInputBasedOnKey from "@/components/VerifyCodeForm/utils/focusInputBasedOnKey.ts";

function createInputElement(): HTMLInputElement {
    const input = document.createElement("input");
    document.body.appendChild(input);
    return input;
}

describe("focusInputBasedOnKey", () => {
    test("1. Moves focus to the left when Backspace is pressed and input is empty", () => {
        const pressedKey = "Backspace";
        const index = 1;
        const inputValues = ["", ""];
        const inputElements = [createInputElement(), createInputElement()];
        inputElements[index].focus();

        focusInputBasedOnKey(pressedKey, index, inputValues, inputElements);

        expect(document.activeElement).toBe(inputElements[index - 1]);
    });

    test("2. Moves focus to the left when ArrowLeft is pressed", () => {
        const pressedKey = "ArrowLeft";
        const index = 1;
        const inputValues = ["", ""];
        const inputElements = [createInputElement(), createInputElement()];
        inputElements[index].focus();

        focusInputBasedOnKey(pressedKey, index, inputValues, inputElements);

        expect(document.activeElement).toBe(inputElements[index - 1]);
    });

    test("3. Moves focus to the right when ArrowRight is pressed", () => {
        const pressedKey = "ArrowRight";
        const index = 0;
        const inputValues = ["", ""];
        const inputElements = [createInputElement(), createInputElement()];
        inputElements[index].focus();

        focusInputBasedOnKey(pressedKey, index, inputValues, inputElements);

        expect(document.activeElement).toBe(inputElements[index + 1]);
    });

    test("4. Moves focus to the right when Space is pressed and input is not empty", () => {
        const pressedKey = " ";
        const index = 0;
        const inputValues = ["1", ""];
        const inputElements = [createInputElement(), createInputElement()];
        inputElements[index].focus();

        focusInputBasedOnKey(pressedKey, index, inputValues, inputElements);

        expect(document.activeElement).toBe(inputElements[index + 1]);
    });

    test("5. Does not move focus when Backspace is pressed and input is not empty", () => {
        const pressedKey = "Backspace";
        const index = 1;
        const inputValues = ["1", "2"];
        const inputElements = [createInputElement(), createInputElement()];
        inputElements[index].focus();

        focusInputBasedOnKey(pressedKey, index, inputValues, inputElements);

        expect(document.activeElement).toBe(inputElements[index]);
    });

    test("6. Does not move focus when ArrowLeft is pressed if already at first input", () => {
        const pressedKey = "ArrowLeft";
        const index = 0;
        const inputValues = ["1", "2"];
        const inputElements = [createInputElement(), createInputElement()];
        inputElements[index].focus();

        focusInputBasedOnKey(pressedKey, index, inputValues, inputElements);

        expect(document.activeElement).toBe(inputElements[index]);
    });

    test("7. Does not move focus when ArrowRight is pressed if already at last input", () => {
        const pressedKey = "ArrowRight";
        const index = 1;
        const inputValues = ["1", "2"];
        const inputElements = [createInputElement(), createInputElement()];
        inputElements[index].focus();

        focusInputBasedOnKey(pressedKey, index, inputValues, inputElements);

        expect(document.activeElement).toBe(inputElements[index]);
    });
});
