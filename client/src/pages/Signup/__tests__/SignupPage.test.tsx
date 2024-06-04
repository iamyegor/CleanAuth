import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.tsx";
import routes from "@/lib/routes.tsx";
import userEvent from "@testing-library/user-event";
import {
    failIsAuthenticatedHandler,
    successIsAuthenticatedHandler,
} from "@/test/requestHandlers/isAuthenticatedHandlers.ts";
import { successGetUsernameHandler } from "@/test/requestHandlers/loginPageHandlers.ts";
import { successSignupHandler } from "@/test/requestHandlers/signupPageHandlers.ts";
import { successEmailForVerificationHandler } from "@/test/requestHandlers/verifyEmailPageHandlers.ts";

const SignupPageDefault = () => {
    const router = createMemoryRouter(routes, {
        initialEntries: ["/signup"],
    });
    return <RouterProvider router={router} />;
};

const signupPage = {
    get form() {
        return screen.getByTestId("SignupForm");
    },
    formElements: {
        get usernameInput() {
            return screen.getAllByTestId("InputField.Input")[0];
        },
        get emailInput() {
            return screen.getAllByTestId("InputField.Input")[1];
        },
        get passwordInput() {
            return screen.getAllByTestId("PasswordInput.Input")[0];
        },
        get repeatedPasswordInput() {
            return screen.getAllByTestId("PasswordInput.Input")[1];
        },
        get submittingButton() {
            return screen.getByTestId("SubmittingButton");
        },
    },
};

describe("<SignupPage />", async () => {
    test("1. Redirects to home page if already authenticated", async () => {
        server.use(successIsAuthenticatedHandler);
        server.use(successGetUsernameHandler);
        render(<SignupPageDefault />);

        await waitFor(() => expect(screen.getByTestId("HomePage")).toBeInTheDocument());
    });

    test("2. Displays signup page when user isn't authenticated", async () => {
        server.use(failIsAuthenticatedHandler);
        render(<SignupPageDefault />);

        await waitFor(() => expect(signupPage.form).toBeInTheDocument());
    });

    test("3. Successfully signs up and redirects to verify email page", async () => {
        // Arrange
        server.use(failIsAuthenticatedHandler);
        server.use(successGetUsernameHandler);
        server.use(successSignupHandler);
        server.use(successEmailForVerificationHandler);

        render(<SignupPageDefault />);

        await waitFor(() => expect(signupPage.form).toBeInTheDocument());

        // Act
        await userEvent.type(signupPage.formElements.usernameInput, "testuser");
        await userEvent.type(signupPage.formElements.emailInput, "test@example.com");
        await userEvent.type(signupPage.formElements.passwordInput, "strongPassword123");
        await userEvent.type(signupPage.formElements.repeatedPasswordInput, "strongPassword123");
        await userEvent.click(signupPage.formElements.submittingButton);

        // Assert
        await waitFor(() => expect(screen.getByTestId("VerifyEmailPage")).toBeInTheDocument());
    });
});
