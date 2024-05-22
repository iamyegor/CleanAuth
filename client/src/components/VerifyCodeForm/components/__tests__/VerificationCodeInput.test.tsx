import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import userEvent from "@testing-library/user-event";
import VerificationCodeInput from "@/components/VerifyCodeForm/components/VerificationCodeInput.tsx";
import FeedbackMessage from "@/utils/FeedbackMessage.ts";

const VerificationCodeInputDefault = (
    props: Partial<ComponentProps<typeof VerificationCodeInput>>,
) => (
    <VerificationCodeInput
        inputs={Array(6).fill("")}
        setInputs={() => {}}
        message={null}
        {...props}
    />
);

const verificationCodeInput = {
    get inputs() {
        return screen.queryAllByRole("textbox");
    },
    get errorFeedback() {
        return screen.getByTestId("ErrorMessageComponent.Message");
    },
};

describe("<VerificationCodeInput />", () => {
    test("1. Renders correct number of input fields", () => {
        render(<VerificationCodeInputDefault inputs={Array(6).fill("")} />);

        expect(verificationCodeInput.inputs).toHaveLength(6);
    });

    test("2. Only allows numeric input", async () => {
        const setInputs = vi.fn();
        render(<VerificationCodeInputDefault inputs={Array(6).fill("")} setInputs={setInputs} />);
        const input = verificationCodeInput.inputs[0];

        await userEvent.type(input, "a");
        expect(setInputs).not.toHaveBeenCalled();

        await userEvent.type(input, "1");
        expect(setInputs).toHaveBeenCalledWith(["1", "", "", "", "", ""]);
    });

    test("3. Moves focus to next input field upon entering a digit", async () => {
        render(<VerificationCodeInputDefault inputs={Array(6).fill("")} />);
        const input = verificationCodeInput.inputs[0];
        const nextInput = verificationCodeInput.inputs[1];

        await userEvent.type(input, "1");
        expect(nextInput).toHaveFocus();
    });

    test("4. Moves focus to previous input field upon pressing Backspace on an empty input", async () => {
        render(<VerificationCodeInputDefault inputs={Array(6).fill("")} />);
        const input = verificationCodeInput.inputs[1];
        const previousInput = verificationCodeInput.inputs[0];

        await userEvent.click(input);
        await userEvent.type(input, "{backspace}");
        expect(previousInput).toHaveFocus();
    });

    test("5. Pastes numeric code correctly", async () => {
        const setInputs = vi.fn();
        render(<VerificationCodeInputDefault inputs={Array(6).fill("")} setInputs={setInputs} />);

        await userEvent.click(verificationCodeInput.inputs[0]);
        await userEvent.paste("123456");

        expect(setInputs).toHaveBeenCalledWith(["1", "2", "3", "4", "5", "6"]);
    });

    test("6. Displays feedback message", () => {
        const errorMessage = FeedbackMessage.createError("Custom Error");
        render(<VerificationCodeInputDefault inputs={Array(6).fill("")} message={errorMessage} />);

        expect(verificationCodeInput.errorFeedback).toHaveTextContent("Custom Error");
    });
});
