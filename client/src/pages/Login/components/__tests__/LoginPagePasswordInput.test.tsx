import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";
import LoginError from "@/pages/Login/types/LoginError.ts";
import LoginPagePasswordInput from "@/pages/Login/components/LoginPagePasswordInput.tsx";
import FieldError from "@/utils/FieldError.ts";

const LoginPagePasswordInputDefault = (
    props: Partial<ComponentProps<typeof LoginPagePasswordInput>>,
) => <LoginPagePasswordInput loginError={null} {...props} />;

const loginPagePasswordInput = {
    get input() {
        return screen.getByTestId("LoginPagePasswordInput.Input");
    },
    get toggleButton() {
        return screen.getByTestId("LoginPagePasswordInput.ToggleButton");
    },
    get errorMessage() {
        return screen.queryByTestId("ErrorMessageComponent.Message");
    },
};

describe("<LoginPagePasswordInput />", () => {
    test("1. Renders input field with correct type", () => {
        render(<LoginPagePasswordInputDefault />);

        expect(loginPagePasswordInput.input).toBeInTheDocument();
        expect(loginPagePasswordInput.input).toHaveAttribute("type", "password");
    });

    test("2. Toggles password visibility", async () => {
        render(<LoginPagePasswordInputDefault />);

        await userEvent.click(loginPagePasswordInput.toggleButton);
        expect(loginPagePasswordInput.input).toHaveAttribute("type", "text");

        await userEvent.click(loginPagePasswordInput.toggleButton);
        expect(loginPagePasswordInput.input).toHaveAttribute("type", "password");
    });

    test("3. Applies error class when error relates to the password field", () => {
        const loginError = FieldError.create("password", "Invalid password");
        render(<LoginPagePasswordInputDefault loginError={loginError} />);

        expect(loginPagePasswordInput.input).toHaveClass("login-input__error");
    });

    test("4. Applies error class when error relates to the both fields", () => {
        const loginError = FieldError.create("both", "Invalid credentials");
        render(<LoginPagePasswordInputDefault loginError={loginError} />);

        expect(loginPagePasswordInput.input).toHaveClass("login-input__error");
    });

    test("5. Displays error message when error relates to the password field", () => {
        const loginError = FieldError.create("password", "Invalid password");
        render(<LoginPagePasswordInputDefault loginError={loginError} />);

        expect(loginPagePasswordInput.errorMessage).toHaveTextContent("Invalid password");
    });

    test("6. Doesn't display error message when it relates to both fields", () => {
        const loginError = FieldError.create("both", "Invalid credentials");
        render(<LoginPagePasswordInputDefault loginError={loginError} />);

        expect(loginPagePasswordInput.errorMessage).not.toBeInTheDocument();
    });

    test("7. Does not display error message when errorMessage is not present", () => {
        render(<LoginPagePasswordInputDefault />);

        expect(loginPagePasswordInput.errorMessage).not.toBeInTheDocument();
    });
});
