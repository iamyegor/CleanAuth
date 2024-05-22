import PasswordInput from "@/components/ui/PasswordInput.tsx";
import React, { ComponentProps } from "react";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

const PasswordInputDefault = (props: Partial<ComponentProps<typeof PasswordInput>>) => (
    <PasswordInput name="password" placeholder="Enter your password" {...props} />
);

const passwordInput = {
    get input() {
        return screen.getByTestId("PasswordInput.Input");
    },
    get toggleVisibilityButton() {
        return screen.getByTestId("PasswordInput.ToggleVisibility");
    },
};

const errorMessage = {
    get message() {
        return screen.getByTestId("ErrorMessageComponent.Message");
    },
};

describe("<PasswordInput />", () => {
    test("1. Renders input with correct attributes", () => {
        render(<PasswordInputDefault />);

        expect(passwordInput.input).toBeInTheDocument();
        expect(passwordInput.input).toHaveAttribute("type", "password");
        expect(passwordInput.input).toHaveAttribute("placeholder", "Enter your password");
    });

    test("2. Shows password", async () => {
        const user = userEvent.setup();
        render(<PasswordInputDefault />);

        await user.click(passwordInput.toggleVisibilityButton);
        
        expect(passwordInput.input).toHaveAttribute("type", "text");
    });
    
    test("3. Hides password", async () => {
        const user = userEvent.setup();
        render(<PasswordInputDefault />);

        await user.click(passwordInput.toggleVisibilityButton);
        await user.click(passwordInput.toggleVisibilityButton);
        
        expect(passwordInput.input).toHaveAttribute("type", "password");
    });

    test("4. Displays error message when provided", () => {
        const messageToDisplay: ErrorMessage = ErrorMessage.create("Password is required");
        render(<PasswordInputDefault errorMessage={messageToDisplay} />);

        expect(errorMessage.message).toHaveTextContent("Password is required");
    });
});
