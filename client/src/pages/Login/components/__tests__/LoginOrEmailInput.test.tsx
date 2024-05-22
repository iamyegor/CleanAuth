import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import LoginError from "@/pages/Login/types/LoginError.ts";
import LoginOrEmailInput from "@/pages/Login/components/LoginOrEmailInput.tsx";

const LoginOrEmailInputDefault = (props: Partial<ComponentProps<typeof LoginOrEmailInput>>) => (
    <LoginOrEmailInput loginError={null} {...props} />
);

const loginOrEmailInput = {
    get input() {
        return screen.getByTestId("LoginOrEmailInput.Input");
    },
    get errorMessage() {
        return screen.queryByTestId("ErrorMessageComponent.Message");
    },
};

describe("<LoginPagePasswordInput />", () => {
    test("1. Applies error class when error relates to the login or email field", () => {
        const loginError: LoginError = {
            problematicField: "loginOrEmail",
            errorMessage: "Invalid login or email",
        };
        render(<LoginOrEmailInputDefault loginError={loginError} />);

        expect(loginOrEmailInput.input).toHaveClass("login-input__error");
    });

    test("2. Applies error class when error relates to the both fields", () => {
        const loginError: LoginError = {
            problematicField: "both",
            errorMessage: "Invalid credentials",
        };
        render(<LoginOrEmailInputDefault loginError={loginError} />);

        expect(loginOrEmailInput.input).toHaveClass("login-input__error");
    });

    test("3. Displays error message when error relates to the login or email field", () => {
        const loginError: LoginError = {
            problematicField: "loginOrEmail",
            errorMessage: "Invalid password",
        };
        render(<LoginOrEmailInputDefault loginError={loginError} />);

        expect(loginOrEmailInput.errorMessage).toHaveTextContent("Invalid password");
    });

    test("4. Doesn't display error message when it relates to both fields", () => {
        const loginError: LoginError = {
            problematicField: "both",
            errorMessage: "Invalid credentials",
        };
        render(<LoginOrEmailInputDefault loginError={loginError} />);

        expect(loginOrEmailInput.errorMessage).not.toBeInTheDocument();
    });

    test("6. Does not display error message when errorMessage is not present", () => {
        render(<LoginOrEmailInputDefault />);

        expect(loginOrEmailInput.errorMessage).not.toBeInTheDocument();
    });
});