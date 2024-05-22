import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import InputField from "@/components/ui/InputField.tsx";
import ErrorMessage from "@/utils/ErrorMessage.ts";

const InputFieldDefault = (props: Partial<ComponentProps<typeof InputField>>) => (
    <InputField type="text" name="test-name" placeholder="test-placeholder" {...props} />
);

const inputField = {
    get input() {
        return screen.getByTestId("InputField.Input");
    },
    get errorMessage() {
        return screen.queryByTestId("ErrorMessageComponent.Message");
    },
};

describe("<InputField />", () => {
    test("1. Renders with correct type, name, and placeholder attributes", () => {
        render(<InputFieldDefault />);

        expect(inputField.input).toHaveAttribute("type", "text");
        expect(inputField.input).toHaveAttribute("name", "test-name");
        expect(inputField.input).toHaveAttribute("placeholder", "test-placeholder");
    });

    test("2. Applies defaultValue if provided", () => {
        render(<InputFieldDefault defaultValue="test-value" />);

        expect(inputField.input).toHaveValue("test-value");
    });

    test("3. Applies error class when errorMessage is provided", () => {
        const errorMessage = ErrorMessage.create("Test error message");
        render(<InputFieldDefault errorMessage={errorMessage} />);

        expect(inputField.input).toHaveClass("login-input__error");
    });

    test("4. Applies no-error class when errorMessage is not provided", () => {
        render(<InputFieldDefault />);

        expect(inputField.input).toHaveClass("login-input__no-error");
    });

    test("5. Displays the error message when errorMessage is provided", () => {
        const errorMessage = ErrorMessage.create("Test error message");
        render(<InputFieldDefault errorMessage={errorMessage} />);

        expect(inputField.errorMessage).toHaveTextContent("Test error message");
    });

    test("6. Does not display the error message when errorMessage is not provided", () => {
        render(<InputFieldDefault />);

        expect(inputField.errorMessage).not.toBeInTheDocument();
    });
});
