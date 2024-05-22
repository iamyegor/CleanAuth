import LoginForm, { action } from "@/pages/Login/components/LoginForm.tsx";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.ts";
import { http, HttpResponse } from "msw";

const failedLoginHandler = http.post(`*/api/login`, async () =>
    HttpResponse.json(
        { errorCode: "invalid.credentials", errorMessage: "Invalid login or password" },
        { status: 400 },
    ),
);

const LoginFormDefault = () => {
    const router = createMemoryRouter([{ path: "*", element: <LoginForm />, action: action }]);
    return <RouterProvider router={router} />;
};

const loginForm = {
    get form() {
        return screen.getByTestId("LoginForm");
    },
    loginOrEmail: {
        get input() {
            return screen.getByTestId("LoginOrEmailInput.Input");
        },
        get errorMessage() {
            const input = screen.getByTestId("LoginOrEmailInput");
            return within(input).getByTestId("ErrorMessageComponent.Message");
        },
    },
    password: {
        get input() {
            return screen.getByTestId("LoginPagePasswordInput.Input");
        },
        get errorMessage() {
            const input = screen.getByTestId("LoginPagePasswordInput");
            return within(input).getByTestId("ErrorMessageComponent.Message");
        },
    },
    get errorMessage() {
        return screen.getByTestId("ErrorMessageComponent.Message");
    },
    get submittingButton() {
        return screen.getByTestId("SubmittingButton");
    },
};

describe("<LoginForm />", () => {
    test("1. Displays error message for login or email input when empty", async () => {
        render(<LoginFormDefault />);

        await userEvent.click(loginForm.submittingButton);

        expect(loginForm.loginOrEmail.errorMessage).toHaveTextContent(
            "Login or Email field must not be empty",
        );
    });

    test("2. Displays error message for password input when invalid password is entered", async () => {
        render(<LoginFormDefault />);

        await userEvent.type(loginForm.loginOrEmail.input, "user@example.com");
        await userEvent.type(loginForm.password.input, "short");
        await userEvent.click(loginForm.submittingButton);

        expect(loginForm.password.errorMessage).toHaveTextContent(
            "Password length must be between 6 and 50 characters",
        );
    });

    test("3. Displays error message for both inputs when server invalidates credentials", async () => {
        server.use(failedLoginHandler);
        render(<LoginFormDefault />);

        await userEvent.type(loginForm.loginOrEmail.input, "user@example.com");
        await userEvent.type(loginForm.password.input, "ValidPassword1");
        await userEvent.click(loginForm.submittingButton);

        await waitFor(() => {
            expect(loginForm.errorMessage).toHaveTextContent("Invalid login or password");
            expect(loginForm.loginOrEmail.input.classList).toContain("login-input__error");
            expect(loginForm.password.input.classList).toContain("login-input__error");
        });
    });

    test("4. Disables submitting button when submitting", async () => {
        render(<LoginFormDefault />);

        await userEvent.type(loginForm.loginOrEmail.input, "user@example.com");
        await userEvent.type(loginForm.password.input, "ValidPassword1");
        await userEvent.click(loginForm.submittingButton);

        expect(loginForm.submittingButton).toBeDisabled();
    });
});