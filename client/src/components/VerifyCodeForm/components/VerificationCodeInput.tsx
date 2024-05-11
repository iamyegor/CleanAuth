import React, { useEffect, useRef } from "react";
import focusRight from "@/components/VerifyCodeForm/utils/focusRight.ts";
import { IS_NUMBER_REGEX, ONLY_NUMBERS_REGEX } from "@/data/regularExpressions.ts";
import classNames from "classnames";
import focusInputBasedOnKey from "@/components/VerifyCodeForm/utils/focusInputBasedOnKey.ts";
import addNewValueToInputs from "@/components/VerifyCodeForm/utils/addNewValueToInputs.ts";
import "@/components/VerifyCodeForm/styles/index.css";
import ErrorMessage from "@/components/ui/ErrorMessage.tsx";
import checkImage from "@/components/VerifyCodeForm/images/check.png";
import DisplayedMessage from "@/components/VerifyCodeForm/utils/DisplayedMessage.ts";

interface VerificationCodeProps {
    inputs: string[];
    setInputs: (inputs: string[]) => void;
    message: DisplayedMessage | null;
}

export default function VerificationCodeInput({
    inputs,
    setInputs,
    message,
}: VerificationCodeProps) {
    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, inputs.length);
    }, []);

    function handleChange(index: number, value: string) {
        if (IS_NUMBER_REGEX.test(value)) {
            setInputs(addNewValueToInputs(value, inputs, index));
            if (value && index < inputs.length - 1) {
                focusRight(inputRefs.current, index);
            }
        }
    }

    function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>, index: number) {
        focusInputBasedOnKey(event.key, index, inputs, inputRefs.current);
    }

    function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
        event.preventDefault();
        const pastedText: string = event.clipboardData.getData("text").trim();

        if (pastedText.length === inputs.length && ONLY_NUMBERS_REGEX.test(pastedText)) {
            setInputs(pastedText.split(""));
            inputRefs.current[inputs.length - 1].focus();
        }
    }

    function placeCaretBehindCharacter(input: HTMLInputElement) {
        input.setSelectionRange(input.value.length, input.value.length);
    }

    const classes = classNames(
        "default-verification-code-input",
        !message || message.isSuccess
            ? "verification-code-input-ok"
            : "verification-code-input-error",
    );

    return (
        <div className="mb-8">
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
            {message && (
                <div className="flex justify-center">
                    {message.isSuccess ? (
                        <div className="flex space-x-1.5 items-center">
                            <img src={checkImage} alt="check" className="w-5 h-5" />
                            <p className="text-green-500">{message.message}</p>
                        </div>
                    ) : (
                        <ErrorMessage errorMessage={message.message} extraTopMargin />
                    )}
                </div>
            )}
        </div>
    );
}
