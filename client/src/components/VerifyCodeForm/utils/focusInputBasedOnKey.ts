import focusLeft from "@/components/VerifyCodeForm/utils/focusLeft.ts";
import focusRight from "@/components/VerifyCodeForm/utils/focusRight.ts";

export default function focusInputBasedOnKey(
    pressedKey: string,
    index: number,
    inputValues: string[],
    inputElements: HTMLInputElement[],
) {
    if (pressedKey === "Backspace" && inputValues[index] === "") {
        if (index > 0) {
            focusLeft(inputElements, index);
        }
    } else if (pressedKey === "ArrowLeft") {
        if (index > 0) {
            focusLeft(inputElements, index);
        }
    } else if (pressedKey === "ArrowRight" || (pressedKey === " " && inputValues[index])) {
        if (index < inputElements.length - 1) {
            focusRight(inputElements, index);
        }
    }
}
