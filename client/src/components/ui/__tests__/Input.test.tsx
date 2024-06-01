import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Input from "@/components/ui/Input.tsx";

const InputDefault = (props: Partial<ComponentProps<typeof Input>>) => (
    <Input type="text" name="test-name" placeholder="test-placeholder" {...props} />
);

const inputField = {
    get input() {
        return screen.getByTestId("InputField.Input");
    },
    get errorMessage() {
        return screen.queryByTestId("ErrorMessageComponent.Message");
    },
};

describe("<Input />", () => {
    test("1. Renders with correct type, name, and placeholder attributes", () => {
        render(<InputDefault />);

        expect(inputField.input).toHaveAttribute("type", "text");
        expect(inputField.input).toHaveAttribute("name", "test-name");
        expect(inputField.input).toHaveAttribute("placeholder", "test-placeholder");
    });

    test("2. Applies defaultValue if provided", () => {
        render(<InputDefault defaultValue="test-value" />);

        expect(inputField.input).toHaveValue("test-value");
    });

    test("3. Applies error class when input is invalid", () => {
        render(<InputDefault isInvalid={true} />);

        expect(inputField.input).toHaveClass("input__error");
    });

    test("4. Applies no-error class when errorMessage is not provided", () => {
        render(<InputDefault />);

        expect(inputField.input).toHaveClass("input__no-error");
    });

    test("5. Does not display the error message when errorMessage is not provided", () => {
        render(<InputDefault />);

        expect(inputField.errorMessage).not.toBeInTheDocument();
    });
});
