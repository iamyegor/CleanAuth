import React, { useEffect, useRef } from "react";
import focusRight from "@/pages/EmailVerificationPage/utils/focusRight.ts";
import focusLeft from "@/pages/EmailVerificationPage/utils/focusLeft.tsx";
import { IS_NUMBER_REGEX, ONLY_NUMBERS_REGEX } from "@/data/regularExpressions.ts";
import classNames from "classnames";

interface VerificationCodeProps {
    inputs: string[];
    setInputs: (inputs: string[]) => void;
    isError: boolean;
}

export default function VerificationCodeInput({
    inputs,
    setInputs,
    isError,
}: VerificationCodeProps) {
    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 5);
    }, []);

    function handleChange(index: number, value: string) {
        if (IS_NUMBER_REGEX.test(value)) {
            const newInputs = [...inputs];
            newInputs[index] = value.slice(0, 1);
            setInputs(newInputs);

            if (value && index < 4) {
                focusRight(inputRefs.current, index);
            }
        }
    }

    function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (event.key === "Backspace" && inputs[index] === "") {
            if (index > 0) {
                focusLeft(inputRefs.current, index);
            }
        } else if (event.key === "ArrowLeft") {
            if (index > 0) {
                focusLeft(inputRefs.current, index);
            }
        } else if (event.key === "ArrowRight" || (event.key === " " && inputs[index])) {
            if (index < inputs.length - 1) {
                focusRight(inputRefs.current, index);
            }
        }
    }

    function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
        event.preventDefault();
        const pastedText: string = event.clipboardData.getData("text").trim();

        if (pastedText.length === 5 && ONLY_NUMBERS_REGEX.test(pastedText)) {
            const newInputs: string[] = pastedText.split("");
            setInputs(newInputs);
            inputRefs.current[4].focus(); // focus last input
        }
    }

    function placeCaretBehindCharacter(input: HTMLInputElement) {
        input.setSelectionRange(input.value.length, input.value.length);
    }

    const defaultClasses =
        "w-12 h-14 text-center text-xl font-semibold border rounded-md shadow-sm shadow-gray-200 " +
        "outline-none ring-offset-1 transition-all";

    const noErrorClasses = "ring-blue-400 focus:ring-2";
    const errorClasses = "ring-red-400 ring-2";
    const classes = classNames(defaultClasses, isError ? errorClasses : noErrorClasses);

    return (
        <div className="flex justify-center space-x-3">
            {inputs.map((value, index) => (
                <input
                    ref={(el) => (inputRefs.current[index] = el!)}
                    name={`code-${index}`}
                    key={index}
                    id={`input-${index}`}
                    type="text"
                    autoComplete="off"
                    maxLength={1}
                    onPaste={(e) => handlePaste(e)}
                    value={value}
                    onSelect={() => placeCaretBehindCharacter(inputRefs.current[index])}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeydown(e, index)}
                    className={classes}
                    inputMode="numeric" // Show numeric keyboard on mobile devices
                />
            ))}
        </div>
    );
}
